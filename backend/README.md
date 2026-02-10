# Backend - Inventory API

NestJS REST API para el sistema de inventario e-commerce con autenticación JWT, gestión de productos, órdenes y usuarios.

## Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL 12+ instalado y ejecutándose
- npm o yarn como gestor de paquetes

## Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar base de datos PostgreSQL

```bash
# Crear base de datos
createdb inventory_db

# O si usas una herramienta gráfica como pgAdmin:
# - Click derecho en "Databases"
# - Create → Database
# - Nombre: inventory_db
```

### 3. Configurar variables de entorno

Editar el archivo `.env`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/inventory_db
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui_1234567890
JWT_EXPIRATION=24h
API_PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
NODE_ENV=development
```

**Notas:**

- Reemplaza `usuario` y `contraseña` con tus credenciales de PostgreSQL
- Genera un `JWT_SECRET` seguro: `openssl rand -base64 32`
- `CORS_ORIGIN` debe incluir URLs donde está el frontend

### 4. Ejecutar migraciones y seed

```bash
# Crear el esquema de base de datos
npm run prisma:migrate

# Cargar datos iniciales (70 productos + usuarios de prueba)
npm run prisma:seed
```

### 5. Iniciar servidor de desarrollo

```bash
npm run start:dev
```

El servidor iniciará en `http://localhost:3000` (o el puerto especificado en `.env`)

## Usuarios de Prueba

**Admin:**

- Email: `admin@inventory.com`
- Contraseña: `Admin123!`

**Cliente:**

- Email: `cliente@example.com`
- Contraseña: `Cliente123!`

## Estructura del Proyecto

```
backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   ├── prisma/
│   │   ├── prisma.service.ts   # Prisma client service
│   │   └── prisma.module.ts    # Prisma module
│   └── modules/
│       ├── auth/
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   ├── dto/
│       │   │   └── auth.dto.ts
│       │   ├── guards/
│       │   │   └── jwt-auth.guard.ts
│       │   └── strategies/
│       │       └── jwt.strategy.ts
│       ├── products/
│       │   ├── products.controller.ts
│       │   ├── products.service.ts
│       │   ├── products.module.ts
│       │   └── dto/
│       │       └── product.dto.ts
│       ├── categories/
│       │   ├── categories.controller.ts
│       │   ├── categories.service.ts
│       │   ├── categories.module.ts
│       │   └── dto/
│       │       └── category.dto.ts
│       ├── users/
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   ├── users.module.ts
│       │   └── dto/
│       │       └── user.dto.ts
│       └── orders/
│           ├── orders.controller.ts
│           ├── orders.service.ts
│           ├── orders.module.ts
│           └── dto/
│               └── order.dto.ts
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed
├── .env                        # Variables de entorno
├── .env.example                # Plantilla de variables
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Autenticación

- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión

### Productos

- `GET /api/v1/products` - Listar productos (con paginación y búsqueda)
- `GET /api/v1/products/:id` - Obtener producto por ID
- `GET /api/v1/products/category/:categoriaId` - Listar productos por categoría
- `POST /api/v1/products` - Crear producto (solo ADMIN)
- `PUT /api/v1/products/:id` - Actualizar producto (solo ADMIN)
- `DELETE /api/v1/products/:id` - Eliminar producto (solo ADMIN)

### Categorías

- `GET /api/v1/categories` - Listar categorías
- `GET /api/v1/categories/:id` - Obtener categoría con productos
- `POST /api/v1/categories` - Crear categoría (solo ADMIN)
- `PUT /api/v1/categories/:id` - Actualizar categoría (solo ADMIN)
- `DELETE /api/v1/categories/:id` - Eliminar categoría (solo ADMIN)

### Órdenes

- `GET /api/v1/orders` - Listar órdenes (clientes: sus órdenes, admins: todas)
- `GET /api/v1/orders/:id` - Obtener orden por ID
- `POST /api/v1/orders` - Crear nueva orden
- `PATCH /api/v1/orders/:id/status` - Actualizar estado (solo ADMIN)
- `PATCH /api/v1/orders/:id/cancel` - Cancelar orden

### Usuarios

- `GET /api/v1/users` - Listar usuarios (solo ADMIN)
- `GET /api/v1/users/:id` - Obtener usuario por ID (solo ADMIN)
- `POST /api/v1/users` - Crear usuario (solo ADMIN)
- `PUT /api/v1/users/:id` - Actualizar usuario (solo ADMIN)
- `DELETE /api/v1/users/:id` - Desactivar usuario (solo ADMIN)
- `POST /api/v1/users/:id/reactivate` - Reactivar usuario (solo ADMIN)

## Ejemplos de Uso

### Registrarse

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Seguro123!",
    "telefono": "+57 315 5508228"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@inventory.com",
    "password": "Admin123!"
  }'
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "nombre": "Admin",
    "email": "admin@inventory.com",
    "rol": "ADMIN"
  }
}
```

### Obtener productos con búsqueda y paginación

```bash
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10&search=papas" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Crear orden

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {
        "productoId": "prod-1001",
        "cantidad": 2,
        "precioUnitario": 2250000
      }
    ],
    "notasEntrega": "Entregar en la puerta principal"
  }'
```

## Scripts npm

```bash
# Desarrollo
npm run start:dev        # Iniciar en modo watch

# Producción
npm run build            # Compilar TypeScript
npm run start:prod       # Ejecutar build compilado

# Base de datos
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Cargar datos iniciales
npm run prisma:studio    # Abrir Prisma Studio (UI gráfica)
npm run db:reset         # Resetear base de datos (desarrollador)

# Testing
npm run test             # Tests unitarios
npm run test:e2e         # Tests E2E

# Linting
npm run lint             # ESLint
npm run lint:fix         # ESLint con correcciones automáticas
```

## Modelos de Datos

### User

- id (UUID)
- nombre (String)
- email (String, único)
- password (String, hasheado con bcrypt)
- telefono (String, opcional)
- rol (ADMIN | CLIENTE)
- activo (Boolean)
- createdAt, updatedAt

### Product

- id (UUID)
- nombre (String)
- descripcion (String, opcional)
- precio (Integer, en centavos COP)
- stock (Integer)
- imagen (String, opcional)
- categoriaId (FK)
- activo (Boolean, soft delete)
- createdAt, updatedAt

### Category

- id (UUID)
- nombre (String, único)
- descripcion (String, opcional)
- icono (String, opcional)
- createdAt, updatedAt

### Order

- id (UUID)
- numero (String, unique, ej: PED-1234567890)
- total (Integer, en centavos)
- estado (PENDIENTE | EN_PREPARACION | ENTREGADO | CANCELADO)
- usuarioId (FK)
- entregaEn (DateTime, opcional)
- notasEntrega (String, opcional)
- createdAt, updatedAt

### OrderItem

- id (UUID)
- cantidad (Integer)
- precioUnitario (Integer, en centavos)
- subtotal (Integer, en centavos)
- ordenId (FK)
- productoId (FK)

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 salt rounds)
- ✅ JWT para autenticación stateless
- ✅ CORS configurado
- ✅ Validación de DTOs con class-validator
- ✅ Control de acceso basado en roles (RBAC)
- ✅ Soft deletes para auditoría

## Solución de Problemas

### Error: "could not connect to server"

```
Verificar que PostgreSQL está ejecutándose:
- Windows: Servicios > PostgreSQL
- Mac: brew services list
- Linux: sudo systemctl status postgresql
```

### Error: "database does not exist"

```
Crear la base de datos:
createdb inventory_db
```

### Error: "Invalid JWT secret"

```
Generar nuevo secreto en .env:
openssl rand -base64 32
```

### Prisma Studio para debugging

```bash
npm run prisma:studio
# Abre interfaz gráfica en http://localhost:5555
```

## Próximos Pasos

1. Conectar frontend a endpoints API
2. Implementar validaciones adicionales
3. Agregar tests unitarios
4. Configurar CI/CD
5. Desplegar a producción

## Contacto

Para más información: +57 315 5508228 (WhatsApp)
