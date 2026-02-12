# 📊 IEEE 830 - ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE

**Título**: Sistema de E-commerce con Gestión Integral de Inventario  
**Versión**: 1.0  
**Fecha**: 11 de Febrero de 2026  
**Autores**: Equipo de Desarrollo  
**Estado**: Aprobado para Producción

---

## 1. INTRODUCCIÓN

### 1.1 Propósito

Este documento especifica los requisitos funcionales y no funcionales del sistema de e-commerce con gestión integral de inventario, destinado a facilitar la compra en línea de productos y su posterior gestión administrativa.

### 1.2 Alcance

El sistema permite a usuarios finales comprar productos a través de una interfaz web intuitiva, mientras que los administradores pueden gestionar el inventario, productos, categorías, pedidos, y generar reportes de ventas.

**INCLUYE**:

- ✅ Autenticación de usuarios
- ✅ Catálogo de productos
- ✅ Carrito de compras persistente
- ✅ Sistema de pedidos
- ✅ Panel administrativo
- ✅ Generación de reportes
- ✅ Sistema de ofertas y descuentos
- ✅ Notificaciones (WhatsApp, Email)

**NO INCLUYE**:

- ❌ Procesamiento de pagos con tarjeta de crédito (fase 2)
- ❌ Inteligencia artificial (fase 3)
- ❌ App móvil nativa (usando web responsive)

---

## 2. REQUISITOS FUNCIONALES

### RF-001: Autenticación de Usuario

**Descripción**: El sistema debe permitir que usuarios se registren e inicien sesión.

| Requisito               | Detalle                                            |
| ----------------------- | -------------------------------------------------- |
| **Entrada**             | Email, Contraseña (mínimo 6 caracteres)            |
| **Proceso**             | Validar credenciales, generar JWT, almacenar token |
| **Salida**              | Token JWT + Datos usuario                          |
| **Actor**               | Usuario cliente / Administrador                    |
| **Criterio Aceptación** | Usuario accede al sistema, token válido 24 horas   |

**Implementado**: ✅  
**Código**: `backend/src/modules/auth/`

---

### RF-002: Listar Productos

**Descripción**: Mostrar catálogo de productos con filtrados y búsqueda.

| Requisito               | Detalle                                           |
| ----------------------- | ------------------------------------------------- |
| **Entrada**             | Categoría (opcional), Búsqueda (opcional), Página |
| **Proceso**             | Consultar BD, filtrar, paginar (10 por página)    |
| **Salida**              | Array de productos con detalles                   |
| **Actor**               | Usuario anónimo o autenticado                     |
| **Criterio Aceptación** | Se cargan 10 productos, se puede cambiar página   |

**Implementado**: ✅  
**Endpoint**: `GET /api/v1/products?page=1&limit=10`

---

### RF-003: Crear Productos (ADMIN)

**Descripción**: Los administradores pueden agregar nuevos productos.

| Requisito               | Detalle                                               |
| ----------------------- | ----------------------------------------------------- |
| **Entrada**             | Nombre, Precio, Stock, Categoría, Descripción, Imagen |
| **Proceso**             | Validar datos, insertar en BD                         |
| **Salida**              | Código 201 + Producto creado                          |
| **Actor**               | Administrador                                         |
| **Criterio Aceptación** | Producto aparece en catálogo inmediatamente           |

**Implementado**: ✅  
**Endpoint**: `POST /api/v1/products`

---

### RF-004: Actualizar Productos (ADMIN)

**Descripción**: Modificar datos de productos existentes.

| Requisito               | Detalle                            |
| ----------------------- | ---------------------------------- |
| **Entrada**             | ID producto, campos a actualizar   |
| **Proceso**             | Validar permisos, actualizar en BD |
| **Salida**              | Código 200 + Producto actualizado  |
| **Actor**               | Administrador                      |
| **Criterio Aceptación** | Cambios se reflejan en 1 segundo   |

**Implementado**: ✅  
**Endpoint**: `PUT /api/v1/products/:id`

---

### RF-005: Eliminar Productos (ADMIN)

**Descripción**: Marcar productos como inactivos o eliminarlos.

| Requisito               | Detalle                          |
| ----------------------- | -------------------------------- |
| **Entrada**             | ID producto                      |
| **Proceso**             | Validar permisos, eliminar de BD |
| **Salida**              | Código 200 + Confirmación        |
| **Actor**               | Administrador                    |
| **Criterio Aceptación** | Producto no aparece en catálogo  |

**Implementado**: ✅  
**Endpoint**: `DELETE /api/v1/products/:id`

---

### RF-006: Agregar al Carrito

**Descripción**: Usuario agrega productos al carrito de compras.

| Requisito               | Detalle                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| **Entrada**             | ID Producto, Cantidad                                             |
| **Proceso**             | Validar stock, agregar a carrito (localStorage)                   |
| **Salida**              | Carrito actualizado                                               |
| **Actor**               | Usuario cliente                                                   |
| **Criterio Aceptación** | Cantidad se suma si existe producto, carrito persiste al recargar |

**Implementado**: ✅  
**Ubicación**: `public/js/carrito.js`

---

### RF-007: Crear Pedido

**Descripción**: Convertir carrito en pedido formal.

| Requisito               | Detalle                                         |
| ----------------------- | ----------------------------------------------- |
| **Entrada**             | Items carrito, dirección envío, notas           |
| **Proceso**             | Validar stock, crear orden, enviar notificación |
| **Salida**              | Código 201 + Número radicado                    |
| **Actor**               | Usuario cliente                                 |
| **Criterio Aceptación** | Pedido en BD, cliente recibe confirmación       |

**Implementado**: ✅  
**Endpoint**: `POST /api/v1/orders`

---

### RF-008: Cambiar Estado de Pedido (ADMIN)

**Descripción**: Administrador actualiza estado del pedido.

| Requisito               | Detalle                                                  |
| ----------------------- | -------------------------------------------------------- |
| **Entrada**             | ID Pedido, Nuevo Estado                                  |
| **Proceso**             | Validar permisos, actualizar estado, enviar notificación |
| **Salida**              | Código 200 + Notificación enviada                        |
| **Actor**               | Administrador                                            |
| **Estados**             | PENDIENTE → EN_PREPARACION → ENVIADO → ENTREGADO         |
| **Criterio Aceptación** | Cliente recibe WhatsApp de actualización                 |

**Implementado**: ✅  
**Endpoint**: `PATCH /api/v1/orders/:id/status`

---

### RF-009: Seguimiento de Pedido

**Descripción**: Cliente puede ver estado de su pedido.

| Requisito               | Detalle                                 |
| ----------------------- | --------------------------------------- |
| **Entrada**             | Número radicado o número de pedido      |
| **Proceso**             | Buscar pedido, obtener datos            |
| **Salida**              | Estado actual, historial, fecha entrega |
| **Actor**               | Cliente                                 |
| **Criterio Aceptación** | Información coincide con BD             |

**Implementado**: ✅  
**URL**: `http://localhost/public/html/seguimiento-pedidos.html`

---

### RF-010: Gestión de Categorías

**Descripción**: CRUD de categorías para organizar productos.

| Requisito               | Detalle                                    |
| ----------------------- | ------------------------------------------ |
| **Entrada**             | Nombre, Descripción, Icono                 |
| **Proceso**             | Crear/Leer/Actualizar/Eliminar categorías  |
| **Salida**              | Categoría procesada                        |
| **Actor**               | Administrador                              |
| **Criterio Aceptación** | Categoría aparece en selector de productos |

**Implementado**: ✅  
**Endpoint**: `GET|POST|PUT|DELETE /api/v1/categories`

---

### RF-011: Reportes de Inventario

**Descripción**: Generar reportes de estado del inventario.

| Requisito               | Detalle                        |
| ----------------------- | ------------------------------ |
| **Salidas**             | Stock bajo, Agotados, Críticos |
| **Formato**             | Tabla HTML, CSV, PDF           |
| **Actor**               | Administrador                  |
| **Criterio Aceptación** | Datos coinciden con BD         |

**Implementado**: ✅  
**Ubicación**: Panel Admin → Reportes

---

### RF-012: Sistema de Ofertas

**Descripción**: Crear descuentos por porcentaje o cantidad.

| Requisito               | Detalle                                        |
| ----------------------- | ---------------------------------------------- |
| **Entrada**             | Producto, Tipo (%), Descuento (%)              |
| **Proceso**             | Guardar oferta en BD/localStorage              |
| **Salida**              | Precio con descuento en catálogo               |
| **Actor**               | Administrador                                  |
| **Criterio Aceptación** | Descuento se aplica automáticamente al carrito |

**Implementado**: ✅  
**Ubicación**: Panel Admin → Gestión de Ofertas

---

## 3. REQUISITOS NO FUNCIONALES

### RNF-001: Rendimiento

- **Meta**: Página carga en < 3 segundos
- **Criterio**: Respuesta API < 500ms
- **Estado**: ✅ Cumple (Prisma optimizado)

### RNF-002: Disponibilidad

- **Meta**: 99.5% uptime
- **Criterio**: Sistema disponible 23.5 horas/día
- **Estado**: ✅ Con Docker orchestration

### RNF-003: Seguridad

- **Meta**: Datos encriptados
- **Criterio**: Passwords hasheados, JWT tokens, validación entrada
- **Estado**: ✅ Implementado

### RNF-004: Escalabilidad

- **Meta**: Soportar 10,000 usuarios concurrentes
- **Criterio**: Databases pooling, caché Redis (fase 2)
- **Estado**: ⚠️ Parcial (requiere caché)

### RNF-005: Usabilidad

- **Meta**: Interfaz intuitiva, curva aprendizaje < 5 min
- **Criterio**: Navegación clara, iconos descriptivos
- **Estado**: ✅ Cumple

### RNF-006: Mantenibilidad

- **Meta**: Código documentado y modular
- **Criterio**: Modulos independientes, comentarios en código
- **Estado**: ✅ Cumple

### RNF-007: Portabilidad

- **Meta**: Correr en Windows, Linux, Mac
- **Criterio**: Docker containerizado
- **Estado**: ✅ Cumple

### RNF-008: Compatibilidad

- **Meta**: Navegadores modernos
- **Criterio**: Chrome 90+, Firefox 88+, Safari 14+
- **Estado**: ✅ Cumple

---

## 4. REQUISITOS DE DATOS

### Modelo de Datos

```
users
├── id (UUID)
├── email (STRING, UNIQUE)
├── password_hash (STRING)
├── nombre (STRING)
├── tipo (ENUM: CLIENT, ADMIN, VENDEDOR)
├── telefono (STRING)
└── permisos (JSON)

categories
├── id (UUID)
├── nombre (STRING)
├── descripcion (TEXT)
├── icono (STRING)
└── _count.productos (INT)

products
├── id (UUID)
├── nombre (STRING)
├── descripcion (TEXT)
├── precio (DECIMAL)
├── stock (INT)
├── categoriaId (FK)
├── imagen (STRING)
└── createdAt (TIMESTAMP)

orders
├── id (UUID)
├── numero (STRING, UNIQUE)
├── usuarioId (FK)
├── total (DECIMAL)
├── estado (ENUM)
├── items (ORDER_ITEMS[])
├── createdAt (TIMESTAMP)
└── entregaEn (TIMESTAMP)

order_items
├── id (UUID)
├── productoId (FK)
├── cantidad (INT)
├── precioUnitario (DECIMAL)
└── subtotal (DECIMAL)
```

---

## 5. INTERFACES EXTERNAS

### API REST

- **Puerto**: 3000
- **Prefijo**: /api/v1
- **Autenticación**: JWT en header `Authorization: Bearer <token>`
- **Formato**: JSON
- **CORS**: Habilitado para http://localhost

### Base de Datos

- **Motor**: PostgreSQL 14+
- **Conexión**: Via Prisma ORM
- **Pool**: 10 conexiones máximo

### Notificaciones

- **WhatsApp**: Via API de terceros (fase 2)
- **Email**: SMTP (fase 2)
- **Push**: Navegador (fase 3)

---

## 6. RESTRICCIONES Y LIMITACIONES

| Restricción          | Descripción                        |
| -------------------- | ---------------------------------- |
| **Peso Imagen**      | Máximo 5MB                         |
| **Caracteres Campo** | Máximo 255 caracteres              |
| **Productos/Página** | 10 items                           |
| **Items/Carrito**    | Máximo 50 artículos                |
| **Token JWT**        | Expira en 24 horas                 |
| **Intentos Login**   | 5 fallos = bloqueo 15 min (fase 2) |

---

## 7. CRITERIOS DE ACEPTACIÓN GLOBALES

- [ ] Todos los endpoints CRUD funcionan correctamente
- [ ] Datos se persisten correctamente en BD
- [ ] Interfaz responsive en móvil, tablet, desktop
- [ ] Validación de entrada previene datos inválidos
- [ ] Base de datos se puede respaldar
- [ ] Sistema se recupera de errores sin perder datos
- [ ] Código es legible y tiene comentarios
- [ ] No hay vulnerabilidades OWASP Top 10
- [ ] Tiempo carga < 3 segundos
- [ ] Compatible con navegadores modernos

---

**Versión IEEE 830**: Cumplida ✅  
**Aprobado por**: Equipo de Desarrollo  
**Fecha Aprobación**: 11 de Febrero de 2026
