# 📐 ARQUITECTURA Y FUNCIONALIDAD DE LA APLICACIÓN

**Última Actualización:** 18 Febrero 2026  
**Versión:** 1.0  
**Estado:** Production

---

## 📑 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Backend - Estructura y Módulos](#3-backend---estructura-y-módulos)
4. [Frontend - Estructura y Componentes](#4-frontend---estructura-y-componentes)
5. [Base de Datos](#5-base-de-datos)
6. [Flujos Principales](#6-flujos-principales)
7. [Seguridad y Autenticación](#7-seguridad-y-autenticación)
8. [API REST Endpoints](#8-api-rest-endpoints)

---

## 1. Visión General

Sistema de e-commerce completo con gestión integral de inventario que permite:

### 👥 Para Clientes

- Navegar y buscar productos
- Gestionar carrito de compras
- Realizar compras y seguimiento
- Gestionar dirección de envío
- Ver historial de órdenes
- Protección con autenticación JWT

### 👨‍💼 Para Administradores

- Gestionar catálogo de productos
- Administrar categorías
- Gestionar inventario y stock
- Ver y actualizar órdenes
- Administrar usuarios
- Generar reportes
- Dashboard con métricas

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                        │
│         React 19 + TypeScript + Vite + TailwindCSS          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Componentes UI                 | Admin Dashboard     │   │
│  │  - Tienda                       | - Gestión Pro.      │   │
│  │  - Carrito                      | - Gestión Órdenes   │   │
│  │  - Checkout                     | - Usuarios          │   │
│  │  - Login/Register               | - Reportes          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Servicios (API Client)                              │   │
│  │  - authService    - productsService - ordersService  │   │
│  │  - usersService   - categoriesService                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/HTTPS (REST API v1)
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR (Backend)                        │
│         NestJS + Express + TypeScript + Prisma              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Módulos (Controladores)                             │   │
│  │  - Auth              - Products         - Cart       │   │
│  │  - Users             - Orders           - Addresses  │   │
│  │  - Categories        - Stock Movts      - Images     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Servicios (Lógica de Negocio)                       │   │
│  │  - Autenticación JWT                                 │   │
│  │  - Validación de datos con DTOs                      │   │
│  │  - Operaciones de BD con Prisma ORM                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middlewares y Guardias                              │   │
│  │  - JWT Authentication                                │   │
│  │  - Authorization (Roles)                             │   │
│  │  - CORS                                              │   │
│  │  - Error Handling                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ SQL (Prisma Client)
┌─────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS PostgreSQL                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tablas Principales                                 │   │
│  │  usuarios | productos | órdenes | categorías        │   │
│  │  direcciones | imágenes | movimientos_stock         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Backend - Estructura y Módulos

### 📂 Estructura Directorio

```
backend/
├── src/
│   ├── main.ts                      (Entrada aplicación)
│   ├── app.module.ts                (Módulo raíz)
│   ├── modules/
│   │   ├── auth/                    (Autenticación JWT)
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── auth.module.ts
│   │   ├── users/                   (Gestión usuarios)
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   │   └── user.dto.ts
│   │   │   └── users.module.ts
│   │   ├── products/                (Catálogo productos)
│   │   ├── categories/              (Categorías)
│   │   ├── orders/                  (Órdenes de compra)
│   │   ├── cart/                    (Carrito)
│   │   ├── addresses/               (Direcciones de envío)
│   │   ├── stock-movements/         (Movimientos de stock)
│   │   ├── product-images/          (Imágenes de productos)
│   │   └── notifications/           (Notificaciones)
│   ├── prisma/
│   │   └── prisma.service.ts        (ORM - BD)
│   ├── health/                      (Health check)
│   └── config/
│       └── database.config.ts       (Configuración BD)
├── prisma/
│   ├── schema.prisma                (Definición del modelo)
│   └── migrations/                  (Historial cambios BD)
└── package.json
```

### 🔐 Módulo Auth

**Funcionalidad:**

- Login con email/contraseña
- Registro de nuevos usuarios
- Generación de JWT
- Refresh tokens
- Protección de rutas

**Endpoints:**

```
POST   /auth/register          Registrar usuario
POST   /auth/login             Iniciar sesión
POST   /auth/refresh           Refrescar token
GET    /auth/profile          Obtener perfil (protegido)
```

**Flujo de Autenticación:**

```
1. Usuario ingresa credenciales
2. Backend valida contra BD
3. Si valida, genera JWT
4. Frontend almacena en localStorage
5. Cada request incluye Bearer token
6. Backend verifica JWT
```

### 📦 Módulo Products

**Funcionalidad:**

- CRUD de productos
- Búsqueda y filtrado
- Gestión de stock
- Asociación con categorías
- Imágenes de productos

**Endpoints:**

```
GET    /products              Listar productos (paginado)
GET    /products/:id          Obtener producto
POST   /products              Crear (admin)
PATCH  /products/:id          Actualizar (admin)
DELETE /products/:id          Eliminar (admin)
GET    /products/category/:id Productos por categoría
```

**Control de Stock:**

- Stock se reduce al crear orden
- Se registran movimientos de stock
- Alertas si stock bajo
- Reversión si orden se cancela

### 👥 Módulo Users

**Funcionalidad:**

- Gestión de perfiles
- Asignación de roles (ADMIN/CLIENT)
- Actualización de información
- Eliminación de cuentas

**EndpointS:**

```
GET    /users                 Listar usuarios (admin)
GET    /users/:id            Obtener usuario
GET    /users/profile        Obtener perfil actual
PATCH  /users/:id            Actualizar (admin)
PATCH  /users/:id/role       Cambiar rol (admin)
DELETE /users/:id            Eliminar usuario
```

### 🛒 Módulo Orders

**Funcionalidad:**

- Crear órdenes de compra
- Gestión de estados (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Historial de órdenes
- Cálculo de totales

**Estados de Orden:**

```
PENDING     → Orden creada, esperando confirmación
PROCESSING  → Orden confirmada, en preparación
SHIPPED     → Orden enviada
DELIVERED   → Orden entregada
CANCELLED   → Orden cancelada
```

### 📂 Módulo Categories

**Funcionalidad:**

- CRUD de categorías
- Agrupación de productos
- Íconos y descripciones

---

## 4. Frontend - Estructura y Componentes

### 📂 Estructura Directorio

```
frontend/src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx       (Panel principal admin)
│   │   ├── AdminLayout.tsx          (Layout admin)
│   │   ├── AdminLogin.tsx           (Login admin)
│   │   ├── ProductsManagement.tsx   (Gestión productos)
│   │   ├── OrdersManagement.tsx     (Gestión órdenes)
│   │   ├── UsersManagement.tsx      (Gestión usuarios)
│   │   └── Reports.tsx              (Reportes)
│   └── ui/
│       ├── button.tsx               (Botón reutilizable)
│       ├── card.tsx                 (Tarjeta reutilizable)
│       ├── input.tsx                (Input reutilizable)
│       ├── dialog.tsx               (Modal)
│       ├── select.tsx               (Selector)
│       ├── label.tsx                (Etiqueta)
│       └── badge.tsx                (Badge)
├── services/
│   ├── api.client.ts                (Cliente HTTP Axios)
│   ├── auth.service.ts              (Autenticación)
│   ├── products.service.ts          (Productos)
│   ├── orders.service.ts            (Órdenes)
│   ├── users.service.ts             (Usuarios)
│   ├── categories.service.ts        (Categorías)
│   └── index.ts                     (Exportaciones)
├── context/
│   ├── admin.tsx                    (Context admin)
│   └── auth.tsx                     (Context autenticación)
├── types/
│   └── index.ts                     (Tipos compartidos)
├── App.tsx                          (Componente raíz)
├── main.tsx                         (Entrada)
└── vite.config.ts                   (Config Vite)
```

### 🎨 Componentes Principales

#### StoreFront (Tienda para clientes)

```
App
├── Header (Nav, búsqueda, carrito)
├── ProductGrid (Listado productos)
├── ProductDetail (Detalle producto)
├── Cart (Carrito compras)
├── Checkout (Pago y dirección)
└── Footer
```

#### AdminDashboard (Panel administrativo)

```
AdminLayout
├── Sidebar (Navegación)
├── AdminDashboard
│   ├── ProductsManagement
│   ├── OrdersManagement
│   ├── UsersManagement
│   └── Reports
```

### 🔧 Servicios Frontend

**Proporcionados en refactorización:**

1. **api.client.ts** - Cliente HTTP centralizado
   - Configuración Axios
   - Interceptores (Token, Errores)
   - Manejo de 401 (Token expirado)

2. **auth.service.ts** - Autenticación
   - Login/Register
   - Logout
   - Verificación de rol
   - Almacenamiento de sesión

3. **products.service.ts** - Productos
   - CRUD completo
   - Búsqueda
   - Filtrado por categoría
   - Tipos totalmente documentados

4. **orders.service.ts** - Órdenes
   - Crear/Listar órdenes
   - Actualizar estado
   - Cancelar órdenes
   - Historial de compras

5. **users.service.ts** - Usuarios
   - Gestión de perfil
   - Listado de usuarios (admin)
   - Cambio de roles
   - Actualización de información

6. **categories.service.ts** - Categorías
   - CRUD de categorías
   - Listado para tienda

---

## 5. Base de Datos

### 📊 Diagrama Entidad-Relación

```
usuarios
├── id (PK)
├── nombre
├── email (UNIQUE)
├── password (bcrypt)
├── teléfono
├── rol (ADMIN | CLIENT)
├── fechaCreación

productos
├── id (PK)
├── nombre
├── descripción
├── precio
├── stock
├── categoriaId (FK)
├── imagen
├── fechaCreación

categorías
├── id (PK)
├── nombre
├── descripción
├── ícono

órdenes
├── id (PK)
├── usuarioId (FK)
├── estado (PENDING...)
├── total
├── direcciónEnvío
├── fechaCreación

ordenItems
├── id (PK)
├── ordenId (FK)
├── productoId (FK)
├── cantidad
├── precio

direcciones
├── id (PK)
├── usuarioId (FK)
├── dirección
├── ciudad
├── código postal

movimientosStock
├── id (PK)
├── productoId (FK)
├── cantidad
├── tipo (ENTRADA|SALIDA)
├── motivo
├── fechaCreación
```

### 🔑 Relaciones Principales

- **Usuario → Órdenes** (1:N)
- **Usuario → Direcciones** (1:N)
- **Producto → Categoría** (N:1)
- **Orden → OrderItems** (1:N)
- **Producto → MovimientosStock** (1:N)

---

## 6. Flujos Principales

### 🛍️ Flujo de Compra (Cliente)

```
1. AUTENTICACIÓN
   ├─ Usuario navega a /login
   ├─ Ingresa email/contraseña
   ├─ authService.login() POST /auth/login
   ├─ Backend valida y genera JWT
   └─ Frontend almacena token + usuario en localStorage

2. PRODUCTO
   ├─ Cliente navega a tienda
   ├─ productsService.getAll() GET /products
   ├─ Visualiza catálogo
   └─ Puede ver detalles (GET /products/:id)

3. BÚSQUEDA/FILTRADO
   ├─ Cliente busca o filtra por categoría
   ├─ productsService.search() o getByCategory()
   └─ Recibe productos filtrados

4. CARRITO
   ├─ Agrega producto a carrito
   ├─ Se guarda en localStorage (JSON)
   ├─ Se muestra cantidad de items
   └─ Puede modificar cantidades o remover

5. CHECKOUT
   ├─ Va a carrito
   ├─ Selecciona dirección de envío
   ├─ Confirma compra
   ├─ ordersService.create() POST /orders
   ├─ Backend: reduce stock, crea movimiento
   └─ Frontend: limpia carrito, muestra confirmación

6. SEGUIMIENTO
   ├─ ordersService.getAll()
   ├─ Cliente ve sus órdenes
   ├─ Ve estado actual (PENDING, SHIPPED, etc)
   └─ Puede cancelar si aún está PENDING
```

### 👨‍💼 Flujo de Administración (Admin)

```
1. LOGIN ADMIN
   ├─ Admin navega a /admin/login
   ├─ authService.login()
   ├─ Genera JWT con rol ADMIN
   └─ Accede a AdminDashboard

2. GESTIÓN PRODUCTOS
   ├─ Accede a Productos Management
   ├─ Visualiza, crea, edita o elimina
   ├─ productsService.create/update/delete
   ├─ Puede ver stock actual
   └─ Registra cambios en movimientos_stock

3. GESTIÓN ÓRDENES
   ├─ Accede a Órdenes Management
   ├─ ordersService.getAll()
   ├─ Ve todas las órdenes de clientes
   ├─ Puede cambiar estado (PROCESSING → SHIPPED)
   ├─ ordersService.updateStatus()
   └─ Sistema puede enviar notificaciones

4. GESTIÓN USUARIOS
   ├─ Accede a Usuarios Management
   ├─ usersService.getAll()
   ├─ Puede ver, editar o elminar usuarios
   ├─ usersService.changeRole() cambiar rol
   └─ Validar datos y permisos

5. REPORTES
   ├─ Dashboard con métricas
   ├─ Gráficos de ventas
   ├─ Stock Low alerts
   ├─ Top productos
   └─ Usuarios más activos
```

---

## 7. Seguridad y Autenticación

### 🔒 Estrategia de JWT

```
Flujo JWT:
1. User login con email/password
2. Backend:
   ├─ Verifica credenciales
   ├─ Genera JWT con payload:
   │  ├─ id
   │  ├─ email
   │  ├─ rol
   │  └─ exp (expiración 24h)
   └─ Retorna access_token

3. Frontend:
   ├─ Almacena token en localStorage
   ├─ En cada request incluye:
   │  └─ Authorization: Bearer <token>
   └─ Si 401: limpia sesión y redirige a login

4. Backend:
   ├─ En cada request protegido:
   │  ├─ Extrae token de header
   │  ├─ Verifica firma (secreta)
   │  ├─ Si válido: obtiene usuario
   │  └─ Si inválido: retorna 401
   └─ @UseGuards(AuthGuard('jwt'))
```

### 🛡️ Protección de Rutas

**Frontend:**

```typescript
// Verificar autenticación
if (!authService.isAuthenticated()) {
  navigate("/login");
}

// Verificar rol
if (!authService.hasRole("ADMIN")) {
  navigate("/");
}
```

**Backend:**

```typescript
@UseGuards(AuthGuard('jwt'))
@Roles('ADMIN')
@Post('/products')
create(@Body() dto: CreateProductDto) { }
```

### 🔐 Contraseñas

- Hasheadas con bcrypt (saltRounds: 10)
- Nunca se almacenan en texto plano
- Se validan en login

### 🚫 Validaciones

- DTOs validados con class-validator
- Tipos en TypeScript
- Sanitizadas entradas
- CORS habilitado solo para dominios permitidos

---

## 8. API REST Endpoints

### ✅ Autenticación

```
POST   /auth/register
  Body: { nombre, email, contraseña, teléfono? }
  Response: { access_token, user }

POST   /auth/login
  Body: { email, contraseña }
  Response: { access_token, user }

GET    /auth/profile         [PROTEGIDO]
  Response: { usuario }
```

### 📦 Productos

```
GET    /products?page=1&limit=10
  Response: { data, total, pages }

GET    /products/:id
  Response: { producto }

POST   /products              [ADMIN]
  Body: CreateProductDto
  Response: { producto }

PATCH  /products/:id         [ADMIN]
  Body: UpdateProductDto
  Response: { producto }

DELETE /products/:id         [ADMIN]
  Response: { }

GET    /products/category/:categoriaId
  Response: { data, total }
```

### 📂 Categorías

```
GET    /categories
  Response: { data }

GET    /categories/:id
  Response: { categoría }

POST   /categories            [ADMIN]
  Body: CreateCategoryDto
  Response: { categoría }

PATCH  /categories/:id       [ADMIN]
  Body: UpdateCategoryDto
  Response: { categoría }

DELETE /categories/:id       [ADMIN]
  Response: { }
```

### 👥 Usuarios

```
GET    /users?page=1&limit=10  [ADMIN]
  Response: { data, total, pages }

GET    /users/:id            [ADMIN]
  Response: { usuario }

PATCH  /users/:id            [ADMIN]
  Body: UpdateUserDto
  Response: { usuario }

PATCH  /users/:id/role       [ADMIN]
  Body: { role: 'ADMIN' | 'CLIENT' }
  Response: { usuario }

DELETE /users/:id            [ADMIN]
  Response: { }
```

### 🛒 Órdenes

```
GET    /orders?page=1&limit=10  [PROTEGIDO]
  Response: { data, total, pages }

GET    /orders/:id            [PROTEGIDO]
  Response: { orden }

POST   /orders                 [PROTEGIDO]
  Body: CreateOrderDto
  Response: { orden }

PATCH  /orders/:id/status     [ADMIN]
  Body: { status }
  Response: { orden }

PATCH  /orders/:id            [PROTEGIDO]
  Body: Partial<CreateOrderDto>
  Response: { orden }

DELETE /orders/:id            [ADMIN]
  Response: { }
```

### 📍 Direcciones

```
GET    /addresses             [PROTEGIDO]
  Response: { data }

POST   /addresses              [PROTEGIDO]
  Body: CreateAddressDto
  Response: { dirección }

DELETE /addresses/:id         [PROTEGIDO]
  Response: { }
```

---

## 📊 Resumen Técnico

| Aspecto                | Stack                            |
| ---------------------- | -------------------------------- |
| **Backend**            | NestJS 10 + Express              |
| **Frontend**           | React 19 + TypeScript + Vite     |
| **Base de Datos**      | PostgreSQL + Prisma ORM          |
| **Autenticación**      | JWT (Bearer Token)               |
| **Validación**         | class-validator, DTOs            |
| **HTTP Client**        | Axios                            |
| **Estilos**            | CSS + TailwindCSS en componentes |
| **Estado Frontend**    | Context API + localStorage       |
| **Versionamiento API** | /api/v1                          |

---

## 🚀 Próximos Pasos para Desarrollo

1. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)

2. **Performance**
   - Caché de productos
   - Paginación eficiente
   - Lazy loading de imágenes

3. **Notificaciones**
   - WebSockets para updatess en tiempo real
   - Email para confirmación de órdenes
   - SMS de seguimiento

4. **Pagos**
   - Integración Stripe/PayPal
   - Procesamiento de pagos seguros

5. **SEO**
   - Meta tags dinámicos
   - Sitemap
   - Structured data

---

**Preguntas frecuentes sobre arquitectura:**

- Ver [MANUAL_USUARIO.md](MANUAL_USUARIO.md) para guía de usuario
- Ver [MANUAL_ADMIN.md](MANUAL_ADMIN.md) para guía de administrador
