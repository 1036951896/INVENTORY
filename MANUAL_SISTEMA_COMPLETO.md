# 📘 MANUAL COMPLETO DEL SISTEMA - INVENTORY E-COMMERCE

**Fecha Documento**: 11 de Febrero de 2026  
**Versión**: 1.0 - VERSIÓN PARA EVALUACIÓN  
**Estado**: Producción

---

## 📑 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Módulos y Funcionalidades](#módulos-y-funcionalidades)
6. [Manual del Usuario](#manual-del-usuario)
7. [API REST - Documentación Técnica](#api-rest---documentación-técnica)
8. [Base de Datos](#base-de-datos)
9. [Seguridad y Autenticación](#seguridad-y-autenticación)
10. [Procedimientos de Mantenimiento](#procedimientos-de-mantenimiento)

---

## 📋 RESUMEN EJECUTIVO

**Inventory E-Commerce** es una plataforma integral de comercio electrónico con gestión avanzada de inventario, desarrollada con tecnologías modernas y mejores prácticas de desarrollo.

### ✅ Características Principales:

- 🛒 **E-commerce funcional** con carrito persistente
- 📦 **Gestión de productos** y categorías en tiempo real
- 👥 **Sistema de pedidos** con seguimiento de estado
- 🔐 **Autenticación segura** con JWT y roles de usuario
- 📊 **Panel administrativo** con reportes y estadísticas
- 🎯 **Ofertas y descuentos** por cantidad o porcentaje
- 📱 **Interfaz responsive** adaptada a todos los dispositivos
- 🔄 **Sincronización** entre frontend y backend

### 📊 Indicadores de Éxito:

- ✅ **Funcionalidad**: Todas las features solicitadas implementadas
- ✅ **Confiabilidad**: Sistema de backup de BD
- ✅ **Seguridad**: Validación de datos, autenticación, control de permisos
- ✅ **Usabilidad**: Interfaz intuitiva, navegación clara
- ✅ **Eficiencia**: Respuesta rápida, optimización de queries
- ✅ **Mantenibilidad**: Código documentado, estructura modular
- ✅ **Portabilidad**: Docker, scripts de instalación

---

## 🛠️ STACK TECNOLÓGICO

### **Backend**

| Componente         | Versión | Propósito                                    |
| ------------------ | ------- | -------------------------------------------- |
| NestJS             | 10.2.8  | Framework backend, inyección de dependencias |
| TypeScript         | 5.9     | Tipado estático, mejor mantenibilidad        |
| Prisma ORM         | 5.x     | Acceso a BD, migraciones automáticas         |
| PostgreSQL         | 16+     | Base de datos relacional                     |
| JWT (jsonwebtoken) | 9.1.2   | Autenticación segura, tokens                 |
| Class-Validator    | 0.14.1  | Validación de DTOs                           |
| Casl               | 1.6.3   | Control de permisos basado en roles          |

### **Frontend**

| Componente | Versión | Propósito                                |
| ---------- | ------- | ---------------------------------------- |
| React      | 19.2.0  | Framework UI (planeado, en construcción) |
| Vite       | 7.2.4   | Build tool, dev server rápido            |
| TypeScript | 5.9     | Tipado estático en frontend              |
| HTML5/CSS3 | -       | Interfaz actual (vanilla)                |
| JavaScript | ES6+    | Lógica del cliente                       |

### **Infraestructura**

| Componente     | Propósito                     |
| -------------- | ----------------------------- |
| Docker         | Containerización de servicios |
| Docker Compose | Orquestación de contenedores  |
| Nginx          | Servidor web reverse proxy    |
| Node.js        | Runtime de JavaScript         |

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama General

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENTE (NAVEGADOR)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Frontend: HTML5/CSS/JavaScript (Vanilla JS)      │  │
│  │ - E-commerce: Productos, Carrito, Checkout      │  │
│  │ - Admin: Panel de gestión, Reportes             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ (HTTPS/REST API)
┌─────────────────────────────────────────────────────────┐
│              SERVIDOR WEB (Nginx - Puerto 80)            │
│  Sirve: HTML, CSS, JavaScript estático (public/)        │
└─────────────────────────────────────────────────────────┘
                          ↕ (HTTP Proxy)
┌─────────────────────────────────────────────────────────┐
│          BACKEND API (NestJS - Puerto 3000)              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 📦 Módulos:                                      │  │
│  │ - Auth (Login, JWT)                            │  │
│  │ - Products (CRUD productos)                    │  │
│  │ - Categories (Gestión categorías)              │  │
│  │ - Orders (Gestión pedidos)                     │  │
│  │ - Users (Gestión usuarios)                     │  │
│  │ - Notifications (Sistema de alertas)           │  │
│  │ - Addresses (Direcciones de envío)             │  │
│  │ - Cart (Carritos persistentes)                 │  │
│  │ - Offers (Descuentos y promociones)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ (JDBC/Prisma)
┌─────────────────────────────────────────────────────────┐
│         BASE DE DATOS (PostgreSQL - Puerto 5432)        │
│  Tablas: users, products, categories, orders, etc.      │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
1. Usuario → POST /api/v1/auth/login (email, password)
2. Backend valida credenciales en BD
3. Genera JWT token (válido 24 horas)
4. Devuelve token + datos usuario con permisos
5. Frontend almacena token en localStorage
6. Cada request siguiente incluye: Authorization: Bearer <token>
7. Backend valida token y permisos antes de procesar
```

---

## 💻 INSTALACIÓN Y CONFIGURACIÓN

### Requisitos Previos

```bash
- Node.js 18+
- npm o yarn
- PostgreSQL 14+
- Docker (opcional pero recomendado)
```

### Pasos de Instalación

#### 1️⃣ Clonar Repositorio y Dependencias

```bash
# Clonar proyecto
git clone <repo>
cd "inventory app"

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend (React - opcional)
cd ../frontend
npm install

# Volver a raíz
cd ..
```

#### 2️⃣ Configurar Base de Datos

```bash
# Copiar configuración de ambiente (backend)
cd backend
cp .env.example .env

# Editar .env con credenciales PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db

# Ejecutar migraciones
npx prisma migrate dev

# Seed inicial (datos de prueba)
npm run seed
```

#### 3️⃣ Configurar Variables de Ambiente

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/inventory_db
JWT_SECRET=tu_secret_key_muy_seguro_aqui
JWT_EXPIRATION=24h
NODE_ENV=production
```

**Frontend** (en `public/html/admin.html` y ecommerce):

```javascript
// Ya está configurado en admin.js
window.BACKEND_URL = "http://localhost:3000";
```

#### 4️⃣ Iniciar Servicios

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev  # Desarrollo
# o
npm run start      # Producción

# Terminal 2 - Servidor Nginx (con Docker)
docker-compose up

# La aplicación estará en:
# - Frontend: http://localhost (Nginx)
# - Admin: http://localhost/public/html/admin.html
# - API: http://localhost:3000/api/v1
```

---

## 📦 MÓDULOS Y FUNCIONALIDADES

### 1. 🔐 Módulo de Autenticación

**Ubicación**: `backend/src/modules/auth/`

#### Funcionalidades:

- ✅ Login de usuarios (email + contraseña)
- ✅ Login de administradores (email + contraseña)
- ✅ Generación de JWT tokens
- ✅ Validación de tokens en requests
- ✅ Recuperación de contraseña (planificado)

#### Endpoints:

```
POST   /api/v1/auth/login           - Login usuario
POST   /api/v1/auth/admin-login     - Login admin
POST   /api/v1/auth/logout          - Logout
GET    /api/v1/auth/verify          - Verificar token
```

#### Flujo de Uso:

```javascript
// Frontend - Login
const response = await fetch("http://localhost:3000/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "123456" }),
});
const { token, usuario } = await response.json();
localStorage.setItem("token", token);
localStorage.setItem("usuario", JSON.stringify(usuario));
```

---

### 2. 📦 Módulo de Productos

**Ubicación**: `backend/src/modules/products/`

#### Funcionalidades:

- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Búsqueda y filtrado por categoría
- ✅ Paginación
- ✅ Validación de datos (precio, stock)
- ✅ Gestión de imágenes

#### Endpoints:

```
GET    /api/v1/products              - Listar todos (con paginación)
GET    /api/v1/products/:id          - Obtener uno por ID
POST   /api/v1/products              - Crear nuevo (requiere admin)
PUT    /api/v1/products/:id          - Actualizar (requiere admin)
DELETE /api/v1/products/:id          - Eliminar (requiere admin)
GET    /api/v1/products/category/:id - Listar por categoría
```

#### Estructura de Producto:

```json
{
  "id": "uuid",
  "nombre": "Producto Ejemplo",
  "descripcion": "Descripción del producto",
  "precio": 29.99,
  "stock": 100,
  "categoriaId": "uuid",
  "categoria": { "id": "uuid", "nombre": "Bebidas" },
  "imagen": "https://...",
  "imagenes": [],
  "createdAt": "2026-02-11T...",
  "updatedAt": "2026-02-11T..."
}
```

---

### 3. 🏷️ Módulo de Categorías

**Ubicación**: `backend/src/modules/categories/`

#### Funcionalidades:

- ✅ CRUD de categorías
- ✅ Asociación con productos
- ✅ Descripción e iconos
- ✅ Conteo de productos por categoría

#### Endpoints:

```
GET    /api/v1/categories           - Listar todas
POST   /api/v1/categories           - Crear (requiere admin)
PUT    /api/v1/categories/:id       - Actualizar (requiere admin)
DELETE /api/v1/categories/:id       - Eliminar (requiere admin)
```

---

### 4. 🛒 Módulo de Órdenes/Pedidos

**Ubicación**: `backend/src/modules/orders/`

#### Funcionalidades:

- ✅ Creación de pedidos desde carrito
- ✅ Gestión de estado del pedido
- ✅ Cálculo de totales
- ✅ Notificaciones de pedido (WhatsApp, email)
- ✅ Seguimiento de pedidos

#### Estados del Pedido:

- `PENDIENTE` - Recién creado, esperando confirmación
- `EN_PREPARACION` - Confirmado, siendo preparado
- `ENVIADO` - En tránsito
- `ENTREGADO` - Entregado al cliente
- `CANCELADO` - Cancelado por cliente o admin

#### Endpoints:

```
GET    /api/v1/orders               - Listar pedidos del usuario
GET    /api/v1/orders/:id           - Obtener detalles de pedido
POST   /api/v1/orders               - Crear nuevo pedido
PATCH  /api/v1/orders/:id/status    - Cambiar estado
```

---

### 5. 👥 Módulo de Usuarios

**Ubicación**: `backend/src/modules/users/`

#### Funcionalidades:

- ✅ Registro de usuarios
- ✅ Actualización de perfil
- ✅ Gestión de permisos
- ✅ Eliminación de cuenta

#### Tipos de Usuario:

```
CLIENT    - Usuario cliente (permisos limitados)
ADMIN     - Administrador (acceso total)
VENDEDOR  - Vendedor (gestión de sus productos)
STAFF     - Personal (gestión de pedidos)
```

---

### 6. 📊 Panel Administrativo

**Ubicación**: `public/html/admin.html`  
**Lógica**: `public/js/admin.js`

#### Secciones:

- 📈 **Dashboard**: Resumen de ventas, estadísticas clave
- 📦 **Gestión de Productos**: CRUD productos, actualizar stock
- 🏷️ **Categorías**: Ver productos por categoría con estadísticas
- 🚚 **Gestión de Pedidos**: Ver, confirmar, seguimiento
- 👥 **Usuarios**: Listar y gestionar usuarios del sistema
- 📋 **Reportes**: Inventario, top sellers, sin rotación
- 🎉 **Ofertas**: Crear descuentos, ofertas por cantidad
- 🔔 **Notificaciones**: Sistema de alertas del sistema

#### Características de Administración:

```javascript
// Validación de Permisos
validarPermisosAdmin('ver_productos')
validarPermisosAdmin('editar_productos')
validarPermisosAdmin('eliminar_productos')
validarPermisosAdmin('crear_productos')
validarPermisosAdmin('autorizar_pedidos')

// Funciones Principales (en admin.js)
- cargarProductosFromJSON()        - Cargar productos desde API/JSON
- cargarTablaProductos()           - Renderizar tabla
- guardarProducto()                - Guardar nuevo o editar
- eliminarProducto()               - Eliminar con confirmación
- cargarCategoriasAdmin()          - Cargar categorías en select
- cargarTablaPedidos()             - Mostrar pedidos
- confirmarPedido()                - Cambiar estado a EN_PREPARACION
- marcarComoEntregado()            - Marcar pedido como ENTREGADO
- generarReportes()                - Reportes de inventario/ventas
```

---

### 7. 🛍️ Frontend E-Commerce

**Ubicación**: `public/html/` + `public/js/`

#### Flujo de Usuario:

1. **Inicio**: Ver productos en categorías
2. **Detalle**: Click en producto → ver detalles completos
3. **Carrito**: Agregar a carrito (persistente en localStorage)
4. **Checkout**: Ingresar dirección + método de pago
5. **Confirmación**: Verifica pedido, muestra resumen
6. **Seguimiento**: Link para ver estado del pedido

#### Características:

- ✅ Búsqueda de productos
- ✅ Filtrado por categoría
- ✅ Carrito persistente
- ✅ Aplicación de ofertas automática
- ✅ Validación de direcciones
- ✅ Seguimiento de pedidos sin login

---

## 👤 MANUAL DEL USUARIO

### Para Clientes

#### 1. Registrarse

```
1. Ir a http://localhost/public/html/registro.html
2. Ingresar email, contraseña, nombre, teléfono
3. Click "Crear Cuenta"
4. Será redirigido a login
```

#### 2. Comprar Productos

```
1. En http://localhost/ ver catálogo de productos
2. Hacer click en producto para ver detalles
3. Ingresar cantidad y hacer click "Agregar al Carrito"
4. Ir a carrito (icono en header)
5. Revisar artículos, cambiar cantidades si necesario
6. Click "Ir a Checkout"
7. Ingresar dirección de envío
8. Revisar resumen y hacer click "Confirmar Pedido"
9. Pedido se crea, recibe número de radicado
10. Puede hacer seguimiento con el número
```

#### 3. Seguimiento de Pedido

```
1. Ir a http://localhost/public/html/seguimiento-pedidos.html
2. Ingresar número de radicado
3. Ver estado actual y fecha de seguimiento
4. Si está "EN_PREPARACION" = siendo preparado
5. Si está "ENTREGADO" = ya llego
```

#### 4. Recuperar Contraseña

```
1. En login, click "¿Olvidaste tu contraseña?"
2. Ingresar email
3. Se enviará link de recuperación (cuando se implemente)
```

---

### Para Administradores

#### 1. Acceder al Panel

```
1. Ir a http://localhost/public/html/login-admin.html
2. Ingresar email y contraseña admin
3. Acceso al panel completo
```

#### 2. Gestionar Productos

```
Panel > Gestión de Productos
- Ver tabla: nombre, categoría, precio, stock
- [+ Agregar Producto] - Formulario modal
- [Editar] - Modificar producto existente
- [Eliminar] - Eliminar con confirmación
- Al editar: actualiza en BD automáticamente
```

#### 3. Gestionar Pedidos

```
Panel > Gestión de Pedidos
- Ver tabla: radicado, cliente, estado, total
- [Ver] - Detalles completos del pedido
- [Confirmar] - Cambiar a EN_PREPARACION (envía WhatsApp)
- [Entregado] - Marcar como ENTREGADO
- [Contactar] - Link WhatsApp al cliente
```

#### 4. Ver Reportes

```
Panel > Reportes
- Stock Bajo: Productos agotados o stock bajo
- Top Sellers: Productos más vendidos
- Sin Rotación: Productos que no se venden
- Exportar CSV: Descargar datos
- Exportar PDF: Imprimir reporte
```

#### 5. Crear Ofertas

```
Panel > Gestión de Ofertas
- [+ Nueva Oferta]
- Seleccionar producto
- Tipo: Descuento % o Precio por cantidad
- Ejemplo: "Lleva 3 por $15 c/u"
- Guardar
- Aparecerá automáticamente en ecommerce
```

---

## 🔌 API REST - DOCUMENTACIÓN TÉCNICA

### Autenticación

**Todos los endpoints excepto `/auth/login` requieren JWT token**

#### Headers Requeridos:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

### Endpoints Completos

#### 🔐 Autenticación

##### POST `/api/v1/auth/login`

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Respuesta** (200 OK):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "uuid",
    "email": "user@example.com",
    "nombre": "Juan Pérez",
    "tipo": "CLIENT",
    "permisos": {
      "ver_productos": true,
      "crear_pedidos": true
    }
  }
}
```

---

#### 📦 Productos

##### GET `/api/v1/products` - Listar productos

```bash
curl http://localhost:3000/api/v1/products?page=1&limit=10
```

**Respuesta** (200 OK):

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Gaseosa Coca Cola 2L",
    "precio": 8.99,
    "stock": 50,
    "categoriaId": "uuid",
    "categoria": {
      "id": "uuid",
      "nombre": "Bebidas",
      "icono": "🥤"
    },
    "imagen": "https://...",
    "descripcion": "Gaseosa Coca Cola botella de 2 litros"
  }
]
```

##### GET `/api/v1/products/:id` - Obtener producto por ID

```bash
curl http://localhost:3000/api/v1/products/550e8400-e29b-41d4-a716-446655440000
```

##### POST `/api/v1/products` - Crear producto (requiere ADMIN)

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Producto",
    "precio": 15.99,
    "stock": 20,
    "categoriaId": "uuid-categoria",
    "descripcion": "Descripción",
    "imagen": "https://url-imagen.jpg"
  }'
```

##### PUT `/api/v1/products/:id` - Actualizar producto

```bash
curl -X PUT http://localhost:3000/api/v1/products/uuid \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Actualizado",
    "precio": 18.99,
    "stock": 15
  }'
```

##### DELETE `/api/v1/products/:id` - Eliminar producto

```bash
curl -X DELETE http://localhost:3000/api/v1/products/uuid \
  -H "Authorization: Bearer TOKEN"
```

---

#### 🏷️ Categorías

##### GET `/api/v1/categories` - Listar categorías

```bash
curl http://localhost:3000/api/v1/categories
```

**Respuesta**:

```json
[
  {
    "id": "uuid-1",
    "nombre": "Bebidas",
    "descripcion": "Bebidas y refrescos",
    "icono": "🥤",
    "_count": { "productos": 15 }
  },
  {
    "id": "uuid-2",
    "nombre": "Snacks",
    "descripcion": "Productos de snack",
    "icono": "🍪",
    "_count": { "productos": 8 }
  }
]
```

---

#### 🚚 Pedidos

##### POST `/api/v1/orders` - Crear pedido

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productoId": "uuid",
        "cantidad": 2,
        "precio": 8.99
      }
    ],
    "direccionId": "uuid",
    "notas": "Por favor sonar timbre dos veces"
  }'
```

##### GET `/api/v1/orders` - Listar pedidos del usuario

```bash
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer TOKEN"
```

##### GET `/api/v1/orders/:id` - Ver detalles del pedido

```bash
curl http://localhost:3000/api/v1/orders/pedido-uuid \
  -H "Authorization: Bearer TOKEN"
```

##### PATCH `/api/v1/orders/:id/status` - Cambiar estado (ADMIN)

```bash
curl -X PATCH http://localhost:3000/api/v1/orders/pedido-uuid/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "EN_PREPARACION",
    "notasEntrega": "Se está preparando tu pedido"
  }'
```

---

## 🗄️ BASE DE DATOS

### Diagrama Entidad-Relación (MER)

**Localización**: `MER_PROYECTO.puml` (PlantUML)

### Tablas Principales

#### **users** (Usuarios)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  tipo ENUM('CLIENT', 'ADMIN', 'VENDEDOR', 'STAFF') DEFAULT 'CLIENT',
  telefono VARCHAR(20),
  avatar_url VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **categories** (Categorías)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(10),
  slug VARCHAR(255) UNIQUE,
  orden INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **products** (Productos)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  categoria_id UUID REFERENCES categories(id),
  imagen VARCHAR(255),
  vendedor_id UUID REFERENCES users(id),
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **orders** (Pedidos)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  numero VARCHAR(50) UNIQUE,
  usuario_id UUID REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('PENDIENTE', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO') DEFAULT 'PENDIENTE',
  direccion_id UUID REFERENCES addresses(id),
  comprobante_url VARCHAR(255),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **order_items** (Items del Pedido)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  pedido_id UUID REFERENCES orders(id),
  producto_id UUID REFERENCES products(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);
```

---

### Script de Backup

**Ubicación**: `backend/scripts/backup-db.sh`

```bash
#!/bin/bash
# Backup de Base de Datos PostgreSQL

BACKUP_DIR="./backups"
DB_NAME="inventory_db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Ejecutar backup
pg_dump -U postgres -d $DB_NAME > $BACKUP_FILE

# Comprimir
gzip $BACKUP_FILE

echo "✅ Backup realizado: $BACKUP_FILE.gz"

# Mantener solo últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

**Cómo usarlo**:

```bash
cd backend
chmod +x ./scripts/backup-db.sh
./scripts/backup-db.sh
```

**Restaurar un backup**:

```bash
gunzip backup_20260211_120000.sql.gz
psql -U postgres -d inventory_db < backup_20260211_120000.sql
```

---

## 🔐 SEGURIDAD Y AUTENTICACIÓN

### 1. Validación de Datos

**Backend validations** (`backend/src/common/dto/`):

```typescript
// crear-producto.dto.ts
export class CrearProductoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsUUID()
  categoriaId: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
```

### 2. Autenticación JWT

**JWT Strategy** (`backend/src/modules/auth/jwt.strategy.ts`):

```typescript
// Verificar token en cada request
// Token expira en 24 horas
// Se envía en header: Authorization: Bearer <token>
```

### 3. Control de Permisos (CASL)

**Permisos por rol**:

```javascript
// ADMIN: acceso total
// CLIENT: solo ver productos, crear pedidos, ver sus pedidos
// STAFF: gestionar pedidos, cambiar estados
// VENDEDOR: gestionar sus productos

// En backend se valida con @Able() decorator
@Ability('manage', 'products')
updateProduct(@Param('id') id: string) { ... }
```

### 4. Validación en Frontend

```javascript
// admin.js
function validarPermisosAdmin(permisoRequerido) {
  const adminUsuario = JSON.parse(
    localStorage.getItem("admin-usuario") || "{}",
  );
  return adminUsuario.permisos && adminUsuario.permisos[permisoRequerido];
}

// Ejemplo de uso
if (!validarPermisosAdmin("editar_productos")) {
  mostrarMensajeAdmin("❌ No tienes permisos", "error");
  return;
}
```

### 5. Validación de Entrada en HTML

```html
<input type="email" required />
<!-- Valida formato email -->
<input type="number" min="0" required />
<!-- Valida números positivos -->
<input type="text" maxlength="255" />
<!-- Limita caracteres -->
```

### 6. Headers de Seguridad

**En Nginx** (`nginx/nginx.conf`):

```nginx
# Prevenir XSS
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";

# CORS
add_header Access-Control-Allow-Origin "http://localhost";
```

---

## 🔧 PROCEDIMIENTOS DE MANTENIMIENTO

### 1. Actualización de Dependencias

```bash
cd backend
npm outdated              # Ver dependencias antiguas
npm update                # Actualizar todas
npm audit                 # Ver vulnerabilidades
npm audit fix             # Arreglar vulnerabilidades

# Específicamente
npm install -g npm        # Actualizar npm
```

### 2. Limpiar Base de Datos

```bash
# Ver estado de migraciones
npx prisma migrate status

# Resetear BD (⚠️ ELIMINA TODO)
npx prisma migrate reset

# Solo recrear schema sin datos
npx prisma db push --force-reset
```

### 3. Monitoreo de Errores

**Logs del Backend**:

```bash
# Ver logs en tiempo real
docker logs -f inventory-backend

# O en terminal si corre localmente
npm run start:dev
# Verá todos los logs en consola
```

**Errores Comunes y Soluciones**:

| Error                    | Causa                           | Solución             |
| ------------------------ | ------------------------------- | -------------------- |
| `Connection refused`     | PostgreSQL no corre             | `docker-compose up`  |
| `Token inválido`         | JWT expirado o inválido         | Hacer login de nuevo |
| `CORS error`             | Request de dominio no permitido | Revisar Nginx config |
| `Producto no encontrado` | ID incorrecto o eliminado       | Validar ID en BD     |

### 4. Performance Tuning

**Indexar columnas frecuentes**:

```sql
CREATE INDEX idx_products_categoria ON products(categoria_id);
CREATE INDEX idx_orders_usuario ON orders(usuario_id);
CREATE INDEX idx_orders_estado ON orders(estado);
```

**Monitorear consultas lentas**:

```sql
-- En PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 1000; -- queries > 1s
SELECT pg_reload_conf();
```

### 5. Backup Automático

**Script cron** (ejecutar diariamente a las 2 AM):

```bash
# Editar crontab
crontab -e

# Agregar línea:
0 2 * * * /home/user/inventory-app/backend/scripts/backup-db.sh >> /var/log/inventory-backup.log 2>&1
```

### 6. Recuperación ante Desastres

**Si se corrompe la BD**:

```bash
# 1. Detener aplicación
docker-compose down

# 2. Restaurar desde backup
gunzip backups/backup_latest.sql.gz
psql -U postgres -d inventory_db < backups/backup_latest.sql

# 3. Reiniciar servicios
docker-compose up -d

# 4. Verificar integridad
npx prisma db execute rawQuery "SELECT COUNT(*) FROM products;"
```

---

## 📋 CHECKLIST DE DEPLOYMENT

- [ ] Tod as dependencias instaladas (`npm install`)
- [ ] Variables de ambiente configuradas (`.env`)
- [ ] Base de datos migrada (`npx prisma migrate deploy`)
- [ ] Datos iniciales cargados (`npm run seed`)
- [ ] Backend inicia sin errores (`npm run start`)
- [ ] Frontend accesible (`http://localhost`)
- [ ] Endpoints respondiendo (`curl http://localhost:3000/api/v1/categories`)
- [ ] Panel admin funcional
- [ ] Login funcionando
- [ ] CRUD de productos ok
- [ ] Órdenes se crean correctamente
- [ ] Backup automático configurado
- [ ] Logs monitoreados
- [ ] Certificados SSL (en producción)

---

## 📞 CONTACTO Y SOPORTE

- **Documentación**: Este archivo (MANUAL_SISTEMA_COMPLETO.md)
- **Base de Código**: Repositorio Git
- **Reportar Bugs**: Abrir issue en repositorio
- **Preguntas Técnicas**: Revisar documentación técnica

---

**Versión**: 1.0  
**Última Actualización**: 11 de Febrero de 2026  
**Autor**: Equipo de Desarrollo  
**Estado**: ✅ Para Producción
