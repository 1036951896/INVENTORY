# 🏗️ Arquitectura del Proyecto - StoreHub E-Commerce

**Versión**: 2.0 | **Fecha**: Marzo 2026 | **Estado**: Documentado

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura de Alto Nivel](#arquitectura-de-alto-nivel)
3. [Frontend - React](#frontend---react)
4. [Backend - NestJS](#backend---nestjs)
5. [Base de Datos](#base-de-datos)
6. [Flujo de Datos](#flujo-de-datos)
7. [Patrones de Diseño](#patrones-de-diseño)
8. [Seguridad](#seguridad)
9. [Deploy](#deploy)

---

## Visión General

StoreHub es un **sistema e-commerce moderno** con arquitectura de **tres capas**:

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND - REACT 19 (SPA)              │
│         (Vite, React Router, Context API)               │
│         https://inventory-2-sewi.onrender.com           │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ↓
┌─────────────────────────────────────────────────────────┐
│                BACKEND - NESTJS API                     │
│      (Modular, JWT Auth, Prisma ORM)                    │
│      https://inventory-1-jkh2.onrender.com/api/v1       │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
                     ↓
┌─────────────────────────────────────────────────────────┐
│          DATABASE - POSTGRESQL 14+                      │
│    (Relacional, Prisma Migrations)                      │
│         Alojada en Render.com                           │
└─────────────────────────────────────────────────────────┘
```

---

## Arquitectura de Alto Nivel

### 🎭 Capas

#### 1. **Presentation Layer (Frontend)**
- **Responsabilidad**: Interfaz de usuario, renderizado, interacción
- **Tecnología**: React 19 + TypeScript + Vite
- **Ubicación**: `/frontend`
- **Servidor**: Express.js (SPA routing)

#### 2. **API Layer (Backend)**
- **Responsabilidad**: Lógica de negocio, validación, autenticación
- **Tecnología**: NestJS + TypeScript + Prisma ORM
- **Ubicación**: `/backend`
- **Servidor**: Node.js en Docker

#### 3. **Data Layer (Database)**
- **Responsabilidad**: Persistencia de datos
- **Tecnología**: PostgreSQL 14+
- **ORM**: Prisma
- **Ubicación**: Managed Database en Render

---

## Frontend - React

### Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Header.tsx          # Encabezado con navegación
│   │   ├── Hero.tsx            # Sección hero landing
│   │   ├── ProductGrid.tsx     # Grilla de productos
│   │   ├── CartPanel.tsx       # Panel carrito deslizable
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── Categories.tsx      # Selector de categorías
│   │   └── MobileMenu.tsx      # Menú móvil
│   │
│   ├── pages/                   # Páginas SPA
│   │   ├── Home.tsx            # Página principal
│   │   ├── ProductDetail.tsx   # Detalles de producto
│   │   ├── Checkout.tsx        # Carrito y pedido
│   │   ├── OrderConfirmation.tsx # Confirmación
│   │   ├── OrderTracking.tsx   # Historial pedidos
│   │   ├── Login.tsx           # Autenticación
│   │   ├── Register.tsx        # Registro
│   │   ├── Contact.tsx         # Contacto
│   │   ├── FAQ.tsx             # Preguntas frecuentes
│   │   ├── PrivacyPolicy.tsx   # Privacidad
│   │   ├── TermsConditions.tsx # Términos
│   │   ├── public/
│   │   │   └── PublicOffers.tsx # Ofertas públicas
│   │   └── admin/              # Panel administrador
│   │       ├── AdminLayout.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminOrders.tsx
│   │       ├── AdminCategories.tsx
│   │       ├── AdminUsers.tsx
│   │       └── AdminOffers.tsx
│   │
│   ├── context/                 # React Context (Estado Global)
│   │   └── CartContext.tsx     # Contexto del carrito
│   │
│   ├── services/                # Servicios API
│   │   ├── products.service.ts # Operaciones productos
│   │   ├── auth.service.ts     # Autenticación
│   │   ├── orders.service.ts   # Orderdelivery
│   │   └── admin-api.service.ts # API admin
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts            # Definiciones compartidas
│   │
│   ├── utils/                   # Utilidades
│   │   └── notifications.ts    # Sistema notificaciones (Sonner)
│   │
│   ├── styles/                  # CSS modular
│   │   ├── checkout.css
│   │   ├── admin.css
│   │   └── ...
│   │
│   ├── App.tsx                 # Componente raíz
│   ├── App.css                 # Estilos globales
│   ├── main.tsx                # Entrada React DOM
│   └── vite-env.d.ts           # Tipos Vite
│
├── public/                      # Assets estáticos
├── server.js                    # Express para SPA routing
├── vite.config.ts              # Configuración build
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencias
```

### Componentes Principales

#### **Header**
```tsx
export default function Header({ onCartClick, onHamburguesaClick }) {
  // Navegación principal
  // Búsqueda de productos
  // Botón carrito
  // Menú hamburguesa móvil
}
```

#### **ProductGrid**
```tsx
export default function ProductGrid({ activeCategory }) {
  // Obtiene productos de API
  // Filtra por categoría
  // Renderiza tarjetas con lazy loading
  // Manejo de errores y loading
}
```

#### **CartPanel**
```tsx
export default function CartPanel({ isOpen, onClose }) {
  // Usa CartContext
  // Muestra items del carrito
  // Cálculo total
  // Botón checkout
}
```

### Context API - CartContext

```typescript
interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

// Uso en componentes:
const { cart, addToCart } = useCart();
```

### Servicios API

#### **products.service.ts**
```typescript
export const productsService = {
  getAll: () => fetch('/api/v1/products'),
  getById: (id) => fetch(`/api/v1/products/${id}`),
  search: (query) => fetch(`/api/v1/products/search?q=${query}`),
  getByCategory: (category) => fetch(`/api/v1/products/category/${category}`)
};
```

#### **auth.service.ts**
```typescript
export const authService = {
  login: (email, password) => POST('/api/v1/auth/login'),
  register: (data) => POST('/api/v1/auth/register'),
  getToken: () => localStorage.getItem('authToken'),
  getCurrentUser: () => JSON.parse(localStorage.getItem('user')),
  logout: () => localStorage.clear()
};
```

#### **admin-api.service.ts**
```typescript
// Operaciones administrativas
export const productsApiService = {
  create: (data) => POST('/api/v1/admin/products', data),
  update: (id, data) => PUT(`/api/v1/admin/products/${id}`, data),
  delete: (id) => DELETE(`/api/v1/admin/products/${id}`),
  getOffers: () => GET('/api/v1/admin/offers')
};
```

### Flujo de Navegación

```
Home
├── ProductDetail (/:id)
│   └── Checkout
│       └── OrderConfirmation (/:orderId)
│
├── PublicOffers (/ofertas)
│
├── OrderTracking (/mis-pedidos)
│
├── Admin Routes (/admin/*)
│   ├── Dashboard
│   ├── Products
│   ├── Orders
│   ├── Categories
│   ├── Users
│   └── Offers
│
├── Auth Routes
│   ├── Login
│   └── Register
│
└── Info Routes
    ├── FAQ
    ├── Contact
    ├── PrivacyPolicy
    └── TermsConditions
```

### Variables de Entorno (Frontend)

```env
VITE_API_URL=https://inventory-1-jkh2.onrender.com
NODE_ENV=production
```

---

## Backend - NestJS

### Estructura Modular

```
backend/
├── src/
│   ├── app.module.ts           # Módulo raíz
│   ├── main.ts                 # Entry point
│   │
│   ├── health/                 # Health check
│   │   └── health.controller.ts
│   │
│   ├── modules/                # Módulos de negocio
│   │
│   ├── products/               # Products Module
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   └── entities/
│   │       └── product.entity.ts
│   │
│   ├── orders/                 # Orders Module
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── dto/
│   │   │   └── create-order.dto.ts
│   │   └── entities/
│   │       └── order.entity.ts
│   │
│   ├── auth/                   # Authentication Module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt.module.ts
│   │   └── guards/
│   │       └── jwt.guard.ts
│   │
│   ├── users/                  # Users Module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   │
│   ├── categories/             # Categories Module
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   └── dto/
│   │       └── create-category.dto.ts
│   │
│   ├── offers/                 # Offers Module
│   │   ├── offers.module.ts
│   │   ├── offers.controller.ts
│   │   ├── offers.service.ts
│   │   └── dto/
│   │       └── create-offer.dto.ts
│   │
│   ├── prisma/                 # Prisma ORM
│   │   └── prisma.service.ts
│   │
│   └── common/                 # Código compartido
│       ├── pipes/
│       ├── guards/
│       ├── decorators/
│       └── exceptions/
│
├── prisma/
│   ├── schema.prisma           # Definición modelos
│   ├── seed.ts                 # Datos iniciales
│   └── migrations/             # Historial cambios BD
│
├── Dockerfile                  # Para producción
├── docker-compose.yml          # Local development
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

### Arquitectura de Módulos

Cada módulo sigue el patrón **Feature Module**:

```
ProductsModule
├── ProductsController (Rutas HTTP)
├── ProductsService (Lógica negocio)
├── Prisma (Acceso datos)
├── DTOs (Validación entrada)
└── Entities (Modelos)
```

#### Ejemplo: Products Module

```typescript
// products.module.ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}

// products.controller.ts (Endpoints)
@Controller('api/v1/products')
export class ProductsController {
  @Get()
  findAll() { }
  
  @Get(':id')
  findOne(@Param('id') id: string) { }
  
  @Post()
  @UseGuards(JwtGuard)
  @Roles('admin')
  create(@Body() dto: CreateProductDto) { }
  
  @Put(':id')
  @UseGuards(JwtGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) { }
  
  @Delete(':id')
  @UseGuards(JwtGuard)
  @Roles('admin')
  delete(@Param('id') id: string) { }
}

// products.service.ts (Lógica negocio)
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(where?: any, skip?: number, take?: number) {
    return this.prisma.product.findMany({ where, skip, take });
  }
  
  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }
  
  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }
}
```

### Autenticación (JWT)

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });
    
    return { access_token: token, user };
  }
  
  async register(dto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(dto.password, 10);
    return this.usersService.create({
      ...dto,
      password: hashedPassword
    });
  }
}

// jwt.strategy.ts (Extrae user del token)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}

// jwt.guard.ts (Protege rutas)
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}

// roles.guard.ts (Autorización)
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### Rutas API

```
# Productos
GET    /api/v1/products              # Listar todos
GET    /api/v1/products/:id          # Obtener uno
POST   /api/v1/products              # Crear (Admin)
PUT    /api/v1/products/:id          # Actualizar (Admin)
DELETE /api/v1/products/:id          # Eliminar (Admin)

# Órdenes
GET    /api/v1/orders                # Mis órdenes
GET    /api/v1/orders/:id            # Detalle orden
POST   /api/v1/orders                # Crear orden

# Autenticación
POST   /api/v1/auth/register         # Registro
POST   /api/v1/auth/login            # Login

# Admin
GET    /api/v1/admin/orders          # Todas órdenes
GET    /api/v1/admin/offers          # Gestionar ofertas
POST   /api/v1/admin/products        # Crear producto
PUT    /api/v1/admin/products/:id    # Actualizar producto
DELETE /api/v1/admin/products/:id    # Eliminar producto

# Health
GET    /api/v1/health               # Estado servidor
```

### Variables de Entorno (Backend)

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/inventory
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRATION=7d
CORS_ORIGIN=https://inventory-2-sewi.onrender.com
```

---

## Base de Datos

### Schema Prisma

```prisma
// prisma/schema.prisma

model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String
  nombre    String
  telefono  String?
  role      String     @default("cliente") // 'admin' | 'cliente'
  
  ordenes   Order[]
  direcciones Address[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Product {
  id        String     @id @default(cuid())
  nombre    String
  descripcion String?
  precio    Float
  stock     Int
  imagen    String?
  imagenes  ProductImage[]
  
  categoria String
  categories Category[]
  
  ofertas   Offer[]
  orderItems OrderItem[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model ProductImage {
  id        String     @id @default(cuid())
  url       String
  principal Boolean    @default(false)
  orden     Int        @default(0)
  
  product   Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
}

model Order {
  id        String     @id @default(cuid())
  numero    String     @unique
  
  usuario   User       @relation(fields: [usuarioId], references: [id])
  usuarioId String
  
  items     OrderItem[]
  total     Float
  
  estado    String     @default("pendiente") // 'pendiente' | 'en_preparacion' | 'entregado'
  
  direccion String
  telefonoEntrega String
  notasEntrega String?
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model OrderItem {
  id        String     @id @default(cuid())
  
  order     Order      @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String
  
  product   Product    @relation(fields: [productId], references: [id])
  productId String
  
  cantidad  Int
  precioUnitario Float
  subtotal Float
}

model Category {
  id        String     @id @default(cuid())
  nombre    String     @unique
  descripcion String?
  
  products  Product[]
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Offer {
  id        String     @id @default(cuid())
  title     String
  description String?
  discount  Int        // Porcentaje
  
  product   Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  
  validUntil DateTime
  activa    Boolean    @default(true)
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Address {
  id        String     @id @default(cuid())
  calle     String
  numero    String
  apartamento String?
  ciudad    String
  departamento String
  codigoPostal String
  pais      String     @default("Colombia")
  
  usuario   User       @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  usuarioId String
  
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### Diagrama Relacional

```
User ─────┬─────── Order ─────── OrderItem ─── Product
          │                                        ├── Category
          └─────── Address                        └── ProductImage
                                                     └── Offer
```

### Migraciones

```bash
# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar en producción
npx prisma migrate deploy

# Reset local (cuidado!)
npx prisma migrate reset
```

---

## Flujo de Datos

### 1️⃣ Compra de Producto (Happy Path)

```
USUARIO FRONTEND
    ↓
1. Hace clic en "Agregar al Carrito"
    ↓
    CartContext.addToCart(product, quantity)
    ↓
    Notificación de éxito (Sonner)
    ↓
2. Va a Checkout
    ↓
    Carga datos del usuario (si existe cuenta)
    ↓
    Selecciona dirección de entrega
    ↓
    Elige método pago
    ↓
3. Hace clic en "Confirmar Orden"
    ↓ HTTP POST /api/v1/orders
    ↓
BACKEND
    ↓
    OrdersController.create(dto)
    ↓
    OrdersService.create()
    ↓
    Valida stock de productos
    ↓
    Crea registro Order en DB
    ↓
    Crea OrderItems para cada producto
    ↓
    Decrementa stock de productos
    ↓
    Retorna { orderId, numero, total }
    ↓
FRONTEND
    ↓
    CartContext.clearCart()
    ↓
    Redirige a /confirmacion/:orderId
    ↓
    Carga datos orden
    ↓
    Muestra confirmación con número orden
```

### 2️⃣ Login de Admin

```
USUARIO FRONTEND
    ↓
1. Va a /admin-login
2. Ingresa email y password
3. Hace clic "Iniciar Sesión"
    ↓ HTTP POST /api/v1/auth/login
    ↓
BACKEND
    ↓
    AuthController.login(dto)
    ↓
    AuthService.login(email, password)
    ↓
    Busca user en DB
    ↓
    Compara password con bcrypt
    ↓
    Genera JWT token
    ↓
    Retorna { access_token, user }
    ↓
FRONTEND
    ↓
    authService.saveToken(token)
    ↓
    localStorage.setItem('authToken', token)
    ↓
    localStorage.setItem('user', user)
    ↓
    Redirige a /admin
    ↓
    Header ahora muestra datos admin
```

### 3️⃣ Obtener Productos (Admin)

```
USUARIO ADMIN FRONTEND
    ↓
1. Va a /admin/products
2. Componente AdminProducts se monta
    ↓
    useEffect(() => {
      adminApiService.getProducts()
    })
    ↓ HTTP GET /api/v1/admin/products
    ↓
BACKEND
    ↓
    ProductsController.findAll()
    ↓
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('admin')
    ↓
    ProductsService.findAll()
    ↓
    Prisma: SELECT * FROM products
    ↓
    Retorna [{ id, nombre, precio, stock, ... }]
    ↓
FRONTEND
    ↓
    setProducts(data)
    ↓
    Renderiza tabla con productos
```

---

## Patrones de Diseño

### 1. **Module Pattern** (NestJS)
Cada feature es un módulo independiente con su propio controller, service, y DTO.

### 2. **Service Layer**
- Controllers: Manejan HTTP
- Services: Lógica de negocio
- Prisma: Acceso datos

### 3. **Context API** (React)
CartContext para estado global sin props drilling.

### 4. **Custom Hooks** (React)
```typescript
const { cart, addToCart } = useCart();
const user = useAuth();
```

### 5. **Guard Pattern** (NestJS)
Para proteger rutas y autorizar acceso.

### 6. **DTO Pattern** (NestJS)
Separación entre entrada (DTO) y salida (Entity).

```typescript
// Entrada
@Body() createProductDto: CreateProductDto

// Salida
return product as ProductEntity
```

### 7. **Strategy Pattern** (JWT)
Passport.js maneja múltiples estrategias de auth.

---

## Seguridad

### Frontend

```typescript
// ✅ Almacenar token seguro (HttpOnly en servidor real)
localStorage.setItem('authToken', token);

// ✅ Pasar token en headers
const headers = {
  'Authorization': `Bearer ${token}`
};

// ✅ Permitir solo usuarios autenticados
<Route 
  path="/checkout" 
  element={<ProtectedRoute component={<Checkout />} />}
/>

// ✅ Validar con tipos TypeScript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'cliente';
}
```

### Backend

```typescript
// ✅ Hash contraseñas con bcrypt
const hashedPassword = bcrypt.hashSync(password, 10);

// ✅ Validar entrada con DTOs
@Post('login')
@Body() loginDto: LoginDto
// DTO valida email, password formato

// ✅ Proteger rutas públicas
@UseGuards(JwtGuard)
@Delete(':id')
deleteProduct(@Param('id') id: string) { }

// ✅ Autorización por roles
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
@Post()
createProduct(@Body() dto: CreateProductDto) { }

// ✅ Validar CORS
app.enableCors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
});

// ✅ Variables de entorno
JWT_SECRET=proceso_seguro_generado
DATABASE_URL=sin_credenciales_en_codigo
```

---

## Deploy

### Render.com Auto-Deploy

**Configuración en `render.yaml`**:

```yaml
services:
  # Frontend
  - type: web
    name: inventory-2-frontend
    runtime: node
    rootDir: frontend
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: VITE_API_URL
        value: https://inventory-1-jkh2.onrender.com
      - key: NODE_ENV
        value: production

  # Backend
  - type: web
    name: inventory-1-backend
    runtime: docker
    dockerfilePath: Dockerfile
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: inventory-db
          property: connectionString
      - key: CORS_ORIGIN
        value: https://inventory-2-sewi.onrender.com
```

### Proceso Deploy

```
1. Push a GitHub (main branch)
         ↓
2. Render webhook se activa
         ↓
3. Frontend build: npm run build → dist/
         ↓
4. Express server sirve dist/ + SPA routing
         ↓
5. Backend build: Docker image
         ↓
6. Backend run: npm run start:prod
         ↓
7. Prisma: Aplica migraciones
         ↓
8. Servicios online en producción
```

### Monitoreo

```
FRONTEND: https://inventory-2-sewi.onrender.com
BACKEND:  https://inventory-1-jkh2.onrender.com/api/v1/health

Health Check: GET /api/v1/health → { status: 'ok' }
```

---

## Performance & Optimization

### Frontend

```typescript
// Lazy loading componentes
const AdminPanel = lazy(() => import('./pages/admin/AdminLayout'));

// Suspense
<Suspense fallback={<Loading />}>
  <AdminPanel />
</Suspense>

// Optimizar re-renders
const MemoizedComponent = memo(ProductCard);

// Vite optimize
vite.config.ts: optimizeDepe1ndencies
```

### Backend

```typescript
// Pagination
@Get()
findAll(@Query('skip') skip = 0, @Query('take') take = 20) {
  return this.prisma.product.findMany({ skip, take });
}

// Select solo campos necesarios
prisma.product.findMany({
  select: { id: true, nombre: true, precio: true }
});

// Índices en DB
model Product {
  id String @id @default(cuid())
  nombre String @db.VarChar(255) @db.Index()
}
```

---

## Conclusión

StoreHub mantiene una **arquitectura limpia, modular y escalable**:

✅ **Frontend**: Componentes reusables, Context API, typed servicios  
✅ **Backend**: Módulos feature, JWT auth, Prisma ORM  
✅ **Base Datos**: Schema normalizado con relaciones claras  
✅ **Deploy**: Auto-deploy en Render con CI/CD implícita  
✅ **Seguridad**: JWT, bcrypt, CORS, validaciones  

**Para crecer**: Agregar caching (Redis), testing (Jest), y monitoreo (Sentry).

---

**Documento de Arquitectura | Marzo 2026**
