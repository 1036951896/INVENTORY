# 📖 GUÍA DE ENDPOINTS - NUEVAS FUNCIONALIDADES

## 🏠 ADDRESSES (Direcciones de Entrega)

### 1. Crear nueva dirección

```bash
POST http://localhost:3000/api/v1/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "calle": "Carrera 5",
  "numero": "456",
  "apartamento": "Apt 12",
  "ciudad": "Medellín",
  "departamento": "Antioquia",
  "codigoPostal": "050001",
  "pais": "Colombia",
  "detallesAdicionales": "Casa amarilla al lado del parque",
  "esPrincipal": true
}
```

**Response 201:**

```json
{
  "id": "cljsn5k3k0000qz088h7j0k9j",
  "calle": "Carrera 5",
  "numero": "456",
  "apartamento": "Apt 12",
  "ciudad": "Medellín",
  "departamento": "Antioquia",
  "codigoPostal": "050001",
  "pais": "Colombia",
  "detallesAdicionales": "Casa amarilla al lado del parque",
  "esPrincipal": true,
  "usuarioId": "clj1q8h5t0000aa08b8k5j0k9",
  "createdAt": "2026-02-11T10:30:45.123Z",
  "updatedAt": "2026-02-11T10:30:45.123Z"
}
```

---

### 2. Obtener mis direcciones

```bash
GET http://localhost:3000/api/v1/addresses
Authorization: Bearer {token}
```

**Response 200:**

```json
[
  {
    "id": "cljsn5k3k0000qz088h7j0k9j",
    "calle": "Carrera 5",
    "numero": "456",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "esPrincipal": true,
    "createdAt": "2026-02-11T10:30:45.123Z"
  },
  {
    "id": "cljsn5k3k0000qz088h7j0k9k",
    "calle": "Diagonal 10",
    "numero": "789",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "esPrincipal": false,
    "createdAt": "2026-02-10T14:20:30.123Z"
  }
]
```

---

### 3. Obtener dirección principal

```bash
GET http://localhost:3000/api/v1/addresses/principal
Authorization: Bearer {token}
```

**Response 200:**

```json
{
  "id": "cljsn5k3k0000qz088h7j0k9j",
  "calle": "Carrera 5",
  "numero": "456",
  "ciudad": "Medellín",
  "esPrincipal": true
}
```

---

### 4. Actualizar dirección

```bash
PATCH http://localhost:3000/api/v1/addresses/cljsn5k3k0000qz088h7j0k9j
Authorization: Bearer {token}
Content-Type: application/json

{
  "ciudad": "Cali",
  "apartamento": "Apt 5-A"
}
```

**Response 200:**

```json
{
  "id": "cljsn5k3k0000qz088h7j0k9j",
  "calle": "Carrera 5",
  "numero": "456",
  "apartamento": "Apt 5-A",
  "ciudad": "Cali",
  "departamento": "Antioquia",
  "esPrincipal": true,
  "updatedAt": "2026-02-11T10:35:20.123Z"
}
```

---

### 5. Eliminar dirección

```bash
DELETE http://localhost:3000/api/v1/addresses/cljsn5k3k0000qz088h7j0k9j
Authorization: Bearer {token}
```

**Response 200:**

```json
{ "message": "Dirección eliminada exitosamente" }
```

---

## 📦 STOCK MOVEMENTS (Auditoría de Inventario)

### 1. Registrar movimiento de stock (ADMIN ONLY)

```bash
POST http://localhost:3000/api/v1/stock-movements
Authorization: Bearer {token-admin}
Content-Type: application/json

{
  "tipo": "ENTRADA",
  "cantidad": 50,
  "razon": "Reposición - Compra a proveedor",
  "productoId": "prod-12345",
  "referencia": "ORD-PROV-001"
}
```

**Tipos válidos:**

- `ENTRADA` - Mercancía que entra (compra a proveedor)
- `SALIDA` - Venta a cliente
- `DEVOLUCIÓN` - Cliente devuelve producto
- `AJUSTE` - Ajuste manual (pérdida, rotura, etc)

**Response 201:**

```json
{
  "id": "mov-1234567890",
  "tipo": "ENTRADA",
  "cantidad": 50,
  "razon": "Reposición - Compra a proveedor",
  "referencia": "ORD-PROV-001",
  "productoId": "prod-12345",
  "usuarioId": "admin-001",
  "nuevoStock": 150,
  "createdAt": "2026-02-11T10:40:15.123Z"
}
```

---

### 2. Obtener todos los movimientos (ADMIN ONLY)

```bash
GET http://localhost:3000/api/v1/stock-movements?limit=50&offset=0
Authorization: Bearer {token-admin}
```

**Response 200:**

```json
{
  "total": 125,
  "movimientos": [
    {
      "id": "mov-1234567890",
      "tipo": "SALIDA",
      "cantidad": 5,
      "razon": "Venta - Pedido PED-1707340200000",
      "referencia": "PED-1707340200000",
      "productoId": "prod-12345",
      "producto": { "id": "prod-12345", "nombre": "Laptop Dell" },
      "usuario": null,
      "createdAt": "2026-02-11T09:30:00.123Z"
    },
    {
      "id": "mov-1234567889",
      "tipo": "ENTRADA",
      "cantidad": 10,
      "razon": "Devolución del cliente",
      "referencia": "PED-1707330200000",
      "productoId": "prod-12345",
      "usuario": { "id": "user-001", "nombre": "Juan Admin" },
      "createdAt": "2026-02-10T15:20:30.123Z"
    }
  ]
}
```

---

### 3. Obtener historial de producto específico

```bash
GET http://localhost:3000/api/v1/stock-movements/producto/prod-12345?limit=50
Authorization: Bearer {token-admin}
```

**Response 200:**

```json
{
  "total": 45,
  "movimientos": [
    {
      "id": "mov-1234567890",
      "tipo": "SALIDA",
      "cantidad": 5,
      "razon": "Venta - Pedido PED-1707340200000",
      "createdAt": "2026-02-11T09:30:00.123Z"
    },
    {
      "id": "mov-1234567889",
      "tipo": "ENTRADA",
      "cantidad": 50,
      "razon": "Reposición",
      "createdAt": "2026-02-10T14:00:00.123Z"
    }
  ]
}
```

---

### 4. Obtener movimientos por rango de fechas

```bash
GET http://localhost:3000/api/v1/stock-movements/rango/2026-02-01T00:00:00Z/2026-02-11T23:59:59Z?limit=100
Authorization: Bearer {token-admin}
```

**Response 200:**

```json
{
  "total": 234,
  "movimientos": [
    /* ... */
  ]
}
```

---

## 🖼️ PRODUCT IMAGES (Imágenes de Productos)

### 1. Agregar imagen a producto (ADMIN ONLY)

```bash
POST http://localhost:3000/api/v1/product-images
Authorization: Bearer {token-admin}
Content-Type: application/json

{
  "url": "https://cdn.example.com/laptop-dell-1.jpg",
  "productoId": "prod-12345",
  "principal": true
}
```

**Response 201:**

```json
{
  "id": "img-98765",
  "url": "https://cdn.example.com/laptop-dell-1.jpg",
  "orden": 0,
  "principal": true,
  "productoId": "prod-12345",
  "createdAt": "2026-02-11T10:50:00.123Z"
}
```

---

### 2. Obtener imágenes de producto

```bash
GET http://localhost:3000/api/v1/product-images/producto/prod-12345
```

**Response 200:**

```json
[
  {
    "id": "img-98765",
    "url": "https://cdn.example.com/laptop-dell-1.jpg",
    "orden": 0,
    "principal": true
  },
  {
    "id": "img-98766",
    "url": "https://cdn.example.com/laptop-dell-side.jpg",
    "orden": 1,
    "principal": false
  },
  {
    "id": "img-98767",
    "url": "https://cdn.example.com/laptop-dell-back.jpg",
    "orden": 2,
    "principal": false
  }
]
```

---

### 3. Obtener imagen principal

```bash
GET http://localhost:3000/api/v1/product-images/principal/prod-12345
```

**Response 200:**

```json
{
  "id": "img-98765",
  "url": "https://cdn.example.com/laptop-dell-1.jpg",
  "principal": true
}
```

---

### 4. Actualizar imagen (ADMIN ONLY)

```bash
PATCH http://localhost:3000/api/v1/product-images/img-98766
Authorization: Bearer {token-admin}
Content-Type: application/json

{
  "url": "https://cdn.example.com/laptop-dell-side-updated.jpg",
  "principal": false
}
```

**Response 200:**

```json
{
  "id": "img-98766",
  "url": "https://cdn.example.com/laptop-dell-side-updated.jpg",
  "principal": false
}
```

---

### 5. Reordenar imágenes (ADMIN ONLY)

```bash
PATCH http://localhost:3000/api/v1/product-images/reordenar/prod-12345
Authorization: Bearer {token-admin}
Content-Type: application/json

{
  "imagenesIds": ["img-98767", "img-98765", "img-98766"]
}
```

**Response 200:**

```json
[
  { "id": "img-98767", "orden": 0 },
  { "id": "img-98765", "orden": 1 },
  { "id": "img-98766", "orden": 2 }
]
```

---

### 6. Eliminar imagen (ADMIN ONLY)

```bash
DELETE http://localhost:3000/api/v1/product-images/img-98766
Authorization: Bearer {token-admin}
```

**Response 200:**

```json
{ "message": "Imagen eliminada exitosamente" }
```

---

## 🛒 CREAR ORDEN CON DIRECCIÓN (MODIFICADO)

### Nuevo flujo - Crear orden

```bash
POST http://localhost:3000/api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productoId": "prod-12345",
      "cantidad": 2,
      "precioUnitario": 2250000
    },
    {
      "productoId": "prod-67890",
      "cantidad": 1,
      "precioUnitario": 89900
    }
  ],
  "direccionId": "addr-cljsn5k3k0000qz088h7j0k9j",  // ← NUEVO: Dirección obligatoria
  "notasEntrega": "Entregar entre 2 y 4 pm"
}
```

**Response 201:**

```json
{
  "id": "ord-1234567890",
  "numero": "PED-1707340200000",
  "total": 4589900,
  "estado": "PENDIENTE",
  "usuario": {
    "id": "user-001",
    "nombre": "Cliente Ejemplo",
    "email": "cliente@example.com",
    "telefono": "+573001234567"
  },
  "direccion": {
    "id": "addr-cljsn5k3k0000qz088h7j0k9j",
    "calle": "Carrera 5",
    "numero": "456",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "pais": "Colombia"
  },
  "items": [
    {
      "id": "oi-1",
      "cantidad": 2,
      "precioUnitario": 2250000,
      "subtotal": 4500000,
      "producto": {
        "id": "prod-12345",
        "nombre": "Laptop Dell XPS 13"
      }
    },
    {
      "id": "oi-2",
      "cantidad": 1,
      "precioUnitario": 89900,
      "subtotal": 89900,
      "producto": {
        "id": "prod-67890",
        "nombre": "Mouse Logitech"
      }
    }
  ],
  "notasEntrega": "Entregar entre 2 y 4 pm",
  "createdAt": "2026-02-11T11:00:00.123Z",
  "updatedAt": "2026-02-11T11:00:00.123Z"
}
```

---

## ⚠️ ERRORES COMUNES

### Error: Dirección no válida

```json
{
  "statusCode": 400,
  "message": "Dirección no válida o no pertenece al usuario",
  "error": "Bad Request"
}
```

**Causa**: La dirección no existe o pertenece a otro usuario

---

### Error: Stock insuficiente

```json
{
  "statusCode": 400,
  "message": "Stock insuficiente para el producto \"Laptop Dell\". Disponible: 2",
  "error": "Bad Request"
}
```

**Causa**: No hay suficientes unidades en inventario

---

### Error: Permission denied

```json
{
  "statusCode": 403,
  "message": "No tienes permiso para acceder a este recurso",
  "error": "Forbidden"
}
```

**Causa**: Solo ADMIN puede registrar movimientos de stock

---

## 📝 NOTAS FINALES

1. ✅ Todos los endpoints requieren autenticación JWT
2. ✅ Los endpoints de ADMIN requieren rol = 'ADMIN'
3. ✅ Las direcciones se crean por usuario (no se pueden ver las de otros)
4. ✅ Los movimientos de stock se registran automáticamente en las ventas
5. ✅ Las imágenes pueden ser URLs externas (CDN, AWS S3, etc)

---

**Generado**: 11 de Febrero de 2026
