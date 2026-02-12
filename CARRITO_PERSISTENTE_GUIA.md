# 🛒 CARRITO DE COMPRAS - SISTEMA PERSISTENTE

## Descripción

Se ha implementado un **sistema de carrito persistente** en base de datos para mejorar significativamente la experiencia del usuario en el e-commerce.

### ¿Por qué es fundamental?

| Beneficio          | Descripción                                        |
| ------------------ | -------------------------------------------------- |
| **Persistencia**   | El carrito se guarda entre sesiones y dispositivos |
| **Sincronización** | Mismo carrito en web, mobile y app                 |
| **Recuperación**   | Cliente puede recuperar carrito abandonado         |
| **Análisis**       | Datos de comportamiento de compra                  |
| **Ofertas**        | Marketing targetizado a carritos abandonados       |

---

## Estructura de Datos

### Tabla: `carts`

```
- id (PK)
- usuarioId (FK, UNIQUE) - Un carrito por usuario
- createdAt
- updatedAt
```

### Tabla: `cart_items`

```
- id (PK)
- cantidad (INT)
- precioUnitario (INT en centavos)
- carritoId (FK) → carts
- productoId (FK) → products
- createdAt / updatedAt
- UNIQUE(carritoId, productoId)
```

---

## 📋 Endpoints del Carrito

### 1️⃣ Obtener Carrito (o crearlo si no existe)

```bash
GET http://localhost:3000/api/v1/cart
Authorization: Bearer {token}
```

**Response 200:**

```json
{
  "id": "cart-1234567890",
  "usuarioId": "user-001",
  "items": [
    {
      "id": "ci-1",
      "cantidad": 2,
      "precioUnitario": 2250000,
      "subtotal": 4500000,
      "producto": {
        "id": "prod-12345",
        "nombre": "Laptop Dell XPS 13",
        "precio": 2250000,
        "stock": 5
      }
    },
    {
      "id": "ci-2",
      "cantidad": 1,
      "precioUnitario": 89900,
      "subtotal": 89900,
      "producto": {
        "id": "prod-67890",
        "nombre": "Mouse Logitech",
        "precio": 89900,
        "stock": 50
      }
    }
  ],
  "total": 4589900,
  "cantidadItems": 3,
  "createdAt": "2026-02-10T14:30:00.123Z",
  "updatedAt": "2026-02-11T10:45:00.123Z"
}
```

**Campos importantes:**

- ✅ `total` - Suma de todos los subtotales (en centavos)
- ✅ `cantidadItems` - Cantidad total de artículos
- ✅ `subtotal` (por item) - cantidad × precioUnitario

---

### 2️⃣ Agregar Producto al Carrito

```bash
POST http://localhost:3000/api/v1/cart/agregar
Authorization: Bearer {token}
Content-Type: application/json

{
  "productoId": "prod-12345",
  "cantidad": 2
}
```

**Validaciones:**

- ✅ Producto debe existir
- ✅ Stock debe ser suficiente
- ✅ Si ya está en carrito, se suma la cantidad

**Response 201:**

```json
{
  "id": "cart-1234567890",
  "usuarioId": "user-001",
  "items": [
    {
      "id": "ci-1",
      "cantidad": 2,
      "precioUnitario": 2250000,
      "subtotal": 4500000,
      "producto": { ... }
    }
  ],
  "total": 4500000,
  "cantidadItems": 2,
  "updatedAt": "2026-02-11T10:50:00.123Z"
}
```

---

### 3️⃣ Actualizar Cantidad de Producto

```bash
PATCH http://localhost:3000/api/v1/cart/producto/prod-12345
Authorization: Bearer {token}
Content-Type: application/json

{
  "cantidad": 3
}
```

**Validaciones:**

- ✅ Cantidad debe ser ≥ 1
- ✅ Stock disponible debe ser suficiente
- ✅ Producto debe estar en el carrito

**Response 200:**

```json
{
  "id": "cart-1234567890",
  "items": [
    {
      "id": "ci-1",
      "cantidad": 3,
      "precioUnitario": 2250000,
      "subtotal": 6750000,
      "producto": { ... }
    }
  ],
  "total": 6750000,
  "cantidadItems": 3,
  "updatedAt": "2026-02-11T10:52:00.123Z"
}
```

---

### 4️⃣ Eliminar Producto del Carrito

```bash
DELETE http://localhost:3000/api/v1/cart/producto/prod-12345
Authorization: Bearer {token}
```

**Response 200:**

```json
{
  "id": "cart-1234567890",
  "items": [],
  "total": 0,
  "cantidadItems": 0,
  "updatedAt": "2026-02-11T10:55:00.123Z"
}
```

---

### 5️⃣ Vaciar Carrito Completamente

```bash
DELETE http://localhost:3000/api/v1/cart
Authorization: Bearer {token}
```

**Response 200:**

```json
{
  "id": "cart-1234567890",
  "items": [],
  "total": 0,
  "cantidadItems": 0,
  "updatedAt": "2026-02-11T10:57:00.123Z"
}
```

---

## 🔄 Flujo Completo: Compra

### 1. Cliente visualiza catálogo

```
GET /api/v1/products
```

### 2. Agrega productos al carrito

```
POST /api/v1/cart/agregar
{
  "productoId": "prod-1",
  "cantidad": 1
}
```

### 3. Actualiza cantidades si es necesario

```
PATCH /api/v1/cart/producto/prod-1
{ "cantidad": 2 }
```

### 4. Obtiene direcciones

```
GET /api/v1/addresses
```

### 5. Selecciona dirección y crea orden

```
POST /api/v1/orders
{
  "items": [
    { "productoId": "prod-1", "cantidad": 2, "precioUnitario": 2250000 }
  ],
  "direccionId": "addr-abc123",
  "notasEntrega": "Entregar entre 2-4 pm"
}
```

### 6. Carrito se vacía automáticamente (opcional en frontend)

```
DELETE /api/v1/cart
```

---

## 💾 Características Implementadas

### ✅ Persistencia

- Carrito se guarda en BD
- Se mantiene entre sesiones
- Sincroniza mobile/web

### ✅ Validación de Stock

- Verifica disponibilidad al agregar
- Verifica disponibilidad al aumentar cantidad
- Previene sobreventa

### ✅ Cálculos Automáticos

- Subtotal por item (cantidad × precio)
- Total del carrito
- Cantidad total de artículos

### ✅ Relación con Productos

```
CarritoItem → Producto
- Guarda precio vigente al momento
- Referencia a producto actual
- Permite detectar cambios de precio
```

### ✅ Un Carrito por Usuario

```
User 1:1 Cart (relación única)
- Cada usuario tiene un carrito
- Si no existe, se crea automáticamente
```

---

## ⚠️ Errores Comunes

### Error: Stock insuficiente

```json
{
  "statusCode": 400,
  "message": "Stock insuficiente para \"Laptop Dell\". Disponible: 2",
  "error": "Bad Request"
}
```

**Causa**: No hay suficientes unidades

---

### Error: Producto no existe

```json
{
  "statusCode": 404,
  "message": "Producto con ID prod-invalid no encontrado",
  "error": "Not Found"
}
```

**Causa**: El ID del producto no existe

---

### Error: Cantidad inválida

```json
{
  "statusCode": 400,
  "message": "La cantidad debe ser mayor a 0",
  "error": "Bad Request"
}
```

**Causa**: Cantidad < 1

---

### Error: Producto no en carrito

```json
{
  "statusCode": 404,
  "message": "Producto no está en el carrito",
  "error": "Not Found"
}
```

**Causa**: Intento de actualizar/eliminar producto que no está en carrito

---

## 🧮 Ejemplo de Cálculo

**Carrito con 3 productos:**

```
Item 1: Laptop
  - Cantidad: 2
  - Precio unitario: $22,500 (2250000 centavos)
  - Subtotal: $45,000 (4500000 centavos)

Item 2: Mouse
  - Cantidad: 1
  - Precio unitario: $899 (89900 centavos)
  - Subtotal: $899 (89900 centavos)

Item 3: Teclado
  - Cantidad: 1
  - Precio unitario: $15,000 (1500000 centavos)
  - Subtotal: $15,000 (1500000 centavos)

─────────────────────────────────
TOTAL: $62,399 (6239900 centavos)
Cantidad total de items: 4
```

---

## 🔐 Seguridad

✅ **Autenticación requerida** en todos los endpoints  
✅ **Solo acceso al propio carrito** - No se puede ver carrito de otros usuarios  
✅ **Validación de stock** - Previene overselling  
✅ **Validación de cantidad** - Solo valores positivos  
✅ **Restricción de producto** - No se puede eliminar producto si está en uso

---

## 📊 Integración con Órdenes

Una vez que el cliente está listo para comprar:

```javascript
// 1. Obtener carrito actual
GET /api/v1/cart

// 2. Transformar items del carrito en OrderItems
const orderItems = cart.items.map(item => ({
  productoId: item.producto.id,
  cantidad: item.cantidad,
  precioUnitario: item.precioUnitario
}))

// 3. Crear orden
POST /api/v1/orders
{
  items: orderItems,
  direccionId: selectedAddressId
}

// 4. Vaciar carrito (opcional pero recomendado)
DELETE /api/v1/cart
```

---

## 🎯 Casos de Uso

### Caso 1: Cliente compra varias veces

```
Sesión 1: Agrega laptop al carrito
  → Se guarda en BD

Sesión 2 (semanas después): Accede nuevamente
  → Carrito sigue allí con la laptop
  → Decide finalizar compra
```

### Caso 2: Carrito abandonado (Marketing)

```
Cliente: Agrega 5 productos, no compra
  → SE REGISTRA en BD

ADMIN puede:
  - Ver carritos abandonados
  - Enviar recordatorio por email
  - Ofrecer descuento
```

### Caso 3: Precio ha cambiado

```
Cliente: Agrega producto @ $100
         (se guarda en carrito con ese precio)

ADMIN: Cambia precio a $80
       (producto en BD tiene nuevo precio)

Cliente: Ve su carrito con precio original $100
         (precio guardado en CartItem)
```

---

**Generado**: 11 de Febrero de 2026  
**Status**: ✅ IMPLEMENTADO
