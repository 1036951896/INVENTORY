# 📚 DOCUMENTACIÓN TÉCNICA - INVENTORY APP

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Flujo de Comunicación](#flujo-de-comunicación)
3. [Autenticación](#autenticación)
4. [Funcionalidades](#funcionalidades)
5. [Base de Datos](#base-de-datos)
6. [Ejemplos de Requests](#ejemplos-de-requests)
7. [Flujos de Negocio](#flujos-de-negocio)

---

# ARQUITECTURA GENERAL

## Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (navegador)                  │
│  http://localhost:8000  - Python HTTP Server            │
│  - HTML5 (5 módulos)                                    │
│  - CSS3 (grid, flexbox, responsive)                     │
│  - JavaScript vanilla (módulos: app.js, admin.js, etc) │
└────────────────────┬────────────────────────────────────┘
                     │ CORS habilitado
                     │ HTTP/REST
         ┌───────────▼────────────┐
         │   PETICIONES HTTPS     │
         │   Con Bearer Token     │
         └───────────┬────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 BACKEND (servidor)                       │
│    http://localhost:3000 - NestJS + Express            │
│ ┌──────────────────────────────────────────────────┐    │
│ │ Módulos:                                         │    │
│ │ - Auth (JWT, login)                             │    │
│ │ - Products (CRUD)                               │    │
│ │ - Categories (gestión)                          │    │
│ │ - Orders (pedidos)                              │    │
│ │ - Users (usuarios)                              │    │
│ │ - Offers (ofertas/descuentos)                   │    │
│ │ - Notifications (eventos)                       │    │
│ └──────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────▼────────────┐
         │  ORM Prisma + SQL      │
         └───────────┬────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              BASE DE DATOS PostgreSQL                    │
│  - users, products, categories                          │
│  - orders, order_items                                  │
│  - offers, notifications                               │
└─────────────────────────────────────────────────────────┘
```

---

# FLUJO DE COMUNICACIÓN

## 1. FLUJO GENERAL DE PETICIÓN HTTP

```
CLIENTE (Navegador)
    │
    ├─> Construye fetch() con URL y opciones
    │   const peticion = {
    │     method: 'GET/POST/PATCH/DELETE',
    │     headers: {
    │       'Content-Type': 'application/json',
    │       'Authorization': 'Bearer ' + token
    │     },
    │     body: JSON.stringify(datos)
    │   }
    │
    ├─> Envía al Backend
    │   fetch('/api/v1/endpoint', peticion)
    │
SERVIDOR (NestJS)
    │
    ├─> Recibe en controlador
    │   @Controller('endpoint')
    │   @Post()
    │   async crear(@Body() dto) { ... }
    │
    ├─> Valida DTOs (Data Transfer Objects)
    │   - Validación de tipos
    │   - Validación de requeridos
    │   - Transformación de datos
    │
    ├─> Verifica autenticación
    │   - Guard JWT valida token
    │   - Extrae usuario del token
    │
    ├─> Ejecuta lógica en servicio
    │   UserService.crear(datos)
    │   │
    │   ├─> Consulta base de datos con Prisma
    │   │   this.prisma.users.create({...})
    │   │
    │   └─> Retorna resultado o error
    │
    ├─> Controlador devuelve JSON
    │   { data: {...}, status: 200 }
    │
CLIENTE (Navegador)
    │
    ├─> Recibe respuesta
    │   const response = await fetch()
    │
    ├─> Valida respuesta
    │   if (response.ok) { ... }
    │
    ├─> Parsea JSON
    │   const datos = await response.json()
    │
    ├─> Actualiza estado local
    │   - localStorage
    │   - variables globales
    │   - DOM elements
    │
    └─> Actualiza interfaz (UI)
        document.getElementById().textContent = valor
```

---

# AUTENTICACIÓN

## Flujo de Login

### 1. Usuario envía credenciales

```javascript
// Cliente: public/html/login-admin.html
const email = "admin@inventory.com";
const password = "admin123";

const response = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// RESPUESTA:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@inventory.com",
    "nombre": "Administrador",
    "rol": "ADMIN",
    "activo": true
  }
}
```

### 2. Token se guarda en localStorage

```javascript
// backend/src/modules/auth/auth.service.ts
async login(email: string, password: string) {
  // 1. Busca usuario en BD
  const usuario = await this.prisma.users.findUnique({
    where: { email }
  });

  // 2. Valida contraseña (hash con bcrypt)
  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida) throw new UnauthorizedException();

  // 3. Genera JWT token
  const payload = {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol
  };

  const token = this.jwtService.sign(payload);

  // 4. Retorna token
  return {
    access_token: token,
    user: usuario
  };
}
```

### 3. Cliente almacena token

```javascript
// Cliente: login-admin.html
localStorage.setItem("admin-token", data.access_token);
localStorage.setItem("admin-usuario", JSON.stringify(usuarioAdmin));

// Redirige a admin.html
window.location.href = "admin.html";
```

### 4. Peticiones posteriores incluyen token

```javascript
// Cliente: admin.js - Cada fetch incluye token
const token = localStorage.getItem("admin-token");
const response = await fetch(`${BACKEND_URL}/api/v1/products`, {
  headers: {
    Authorization: "Bearer " + token,
  },
});
```

### 5. Backend valida token

```javascript
// backend/src/modules/auth/guards/jwt.guard.ts
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Extrae token de "Bearer TOKEN"
    const token = authHeader?.split(' ')[1];

    // Valida y decodifica
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Almacena en request
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

// Controlador usa @UseGuards(JwtGuard)
@Controller('productos')
@UseGuards(JwtGuard)
export class ProductosController {
  @Get()
  async listar(@Request() req) {
    console.log('Usuario autenticado:', req.user.id);
    // Ahora req.user tiene los datos del JWT
  }
}
```

---

# FUNCIONALIDADES

## 1. GESTIÓN DE PRODUCTOS

### Flujo de Lectura (GET)

```
┌─ Cliente Clic en Categoría ─┐
│     category = "Electrónica"│
└──────────────┬──────────────┘
               │ app.js: filtrarPorCategoria()
               ▼
    ┌─ Filtra array productos ─┐
    │ const filtrados = todos   │
    │   .filter(p => p.cat ==   │
    │   selectedCat)            │
    └──────────────┬────────────┘
                   │
        ┌──────────▼───────────┐
        │ Actualiza DOM        │
        │ insertHTMLProductos()│
        │ Redibuja grid        │
        └──────────────────────┘
```

**NOTA:** Este filtrado es LOCAL. La data ya está en el navegador (cargarProductosFromJSON)

### Flujo de Admin (Backend fetch)

```
┌─ Admin abre admin.html ─┐
└──────────┬──────────────┘
           │ DOMContentLoaded
           ▼
    ┌──────────────────┐
    │ cargarDatosAdmin()
    │ - Valida token   │
    │ - Si no hay token:
    │   redirige a     │
    │   login-admin    │
    └────────┬─────────┘
             │
    ┌────────▼─────────────────────────┐
    │ fetch(API_URL + '/products')     │
    │ headers: {                       │
    │   Authorization: Bearer + token  │
    │ }                                │
    └────────┬─────────────────────────┘
             │ HTTP GET http://localhost:3000/api/v1/products
             ▼
    ┌─ Backend: ProductsController ─┐
    │ @Get()                        │
    │ async findAll() {             │
    │   return this.prisma.         │
    │   products.findMany();        │
    │ }                             │
    └────────┬──────────────────────┘
             │
    ┌────────▼─────────────────────┐
    │ Prisma Query:                │
    │ SELECT * FROM products       │
    │ WHERE activo = true          │
    │ ORDER BY nombre              │
    └────────┬─────────────────────┘
             │ PostgreSQL devuelve datos
             ▼
    ┌─ Backend retorna JSON ─┐
    │ {                      │
    │   data: [            │
    │     {                │
    │       id: "33",      │
    │       nombre: "...", │
    │       stock: 10,     │
    │       ...            │
    │     }                │
    │   ]                  │
    │ }                    │
    └────────┬─────────────┘
             │
    ┌────────▼─────────────────────────┐
    │ Cliente recibe JSON              │
    │ let productos = await resp.json()│
    │                                  │
    │ Valida estructura:               │
    │ productos = Array.isArray(...)   │
    │   ? productos                    │
    │   : productos.data || []         │
    └────────┬─────────────────────────┘
             │
    ┌────────▼──────────────────┐
    │ Dibuja tabla en HTML      │
    │ cargarTablaProductos()    │
    │ tbody.innerHTML = ...     │
    └──────────────────────────┘
```

### Flujo CRUD de Productos en Admin

#### CREATE (Crear)

```javascript
// Cliente: admin.js guardarProducto()
function guardarProducto() {
  const datos = {
    nombre: document.getElementById('prod-nombre').value,
    precio: parseFloat(document.getElementById('prod-precio').value),
    stock: parseInt(document.getElementById('prod-stock').value),
    descripcion: document.getElementById('prod-desc').value,
    categoriaId: document.getElementById('prod-categoria').value,
    imagen: document.getElementById('prod-imagen').value
  };

  fetch(`${BACKEND_URL}/api/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(datos)
  });
}

// Backend: products.controller.ts
@Post()
async create(@Body() createProductDto: CreateProductDto) {
  // Valida DTO
  // - nombre es requerido (string)
  // - precio es positivo (number)
  // - stock >= 0 (number)

  return this.prisma.products.create({
    data: {
      nombre: createProductDto.nombre,
      precio: createProductDto.precio,
      stock: createProductDto.stock,
      descripcion: createProductDto.descripcion,
      categoriaId: createProductDto.categoriaId,
      imagen: createProductDto.imagen,
      activo: true,
      createdAt: new Date()
    }
  });
}

// SQL generado por Prisma:
// INSERT INTO products
// (nombre, precio, stock, descripcion, categoria_id, imagen, activo, created_at)
// VALUES ('ALUMINIO 100 MTS', 23000, 10, '...', '1', null, true, NOW())
// RETURNING *;
```

#### UPDATE (Editar)

```javascript
// Cliente: admin.js editarProducto()
fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
  method: 'PATCH',
  headers: { 'Authorization': 'Bearer ' + token },
  body: JSON.stringify(datosActualizados)
});

// Backend: products.controller.ts
@Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto
) {
  return this.prisma.products.update({
    where: { id },
    data: updateProductDto
  });
}

// SQL:
// UPDATE products
// SET nombre = '...', precio = 25000, updated_at = NOW()
// WHERE id = '33'
// RETURNING *;
```

#### DELETE (Borrar)

```javascript
// Cliente: admin.js borrarProducto()
fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
});

// Backend: products.controller.ts
@Delete(':id')
async remove(@Param('id') id: string) {
  return this.prisma.products.delete({
    where: { id }
  });
}

// SQL:
// DELETE FROM products WHERE id = '33' RETURNING *;
```

---

## 2. GESTIÓN DE PEDIDOS

### Crear Pedido (Checkout)

```javascript
// Cliente: app.js confirmarCompra()
function confirmarCompra() {
  const items = carritoItems.map(item => ({
    productoId: item.id,
    cantidad: item.cantidad,
    precio: item.precio
  }));

  const total = carritoItems.reduce((sum, item) =>
    sum + (item.cantidad * item.precio), 0);

  const datosPedido = {
    usuarioNombre: document.getElementById('nombre-cliente').value,
    usuarioEmail: document.getElementById('email-cliente').value,
    usuarioTelefono: document.getElementById('telefono-cliente').value,
    direccion: document.getElementById('direccion').value,
    items: items,
    total: total,
    estado: 'PENDIENTE'
  };

  // Guardar pedido en backend
  fetch('http://localhost:3000/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosPedido)
  });
}

// Backend: orders.controller.ts
@Post()
async create(@Body() createOrderDto: CreateOrderDto) {
  // 1. Valida stock disponible
  for (const item of createOrderDto.items) {
    const producto = await this.prisma.products.findUnique({
      where: { id: item.productoId }
    });

    if (!producto || producto.stock < item.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para ${producto.nombre}`
      );
    }
  }

  // 2. Crea orden en BD
  const orderData = {
    numero: await this.generarNumeroRadicado(),
    usuario: {
      create: {
        nombre: createOrderDto.usuarioNombre,
        email: createOrderDto.usuarioEmail,
        telefono: createOrderDto.usuarioTelefono,
        direccion: createOrderDto.direccion
      }
    },
    items: {
      createMany: {
        data: createOrderDto.items.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotal: item.cantidad * item.precio
        }))
      }
    },
    total: createOrderDto.total,
    estado: 'PENDIENTE',
    notasEntrega: '',
    createdAt: new Date()
  };

  // 3. Actualiza stock
  for (const item of createOrderDto.items) {
    await this.prisma.products.update({
      where: { id: item.productoId },
      data: {
        stock: {
          decrement: item.cantidad
        }
      }
    });
  }

  // 4. Crea notificación
  await this.notificationsService.crear({
    titulo: 'Nuevo pedido recibido',
    mensaje: `Pedido #${orderData.numero}`,
    tipo: 'PEDIDO_NUEVO'
  });

  return orderData;
}

// SQL generado:
// BEGIN TRANSACTION;
// INSERT INTO orders (numero, total, estado, created_at)
// VALUES ('ORD-20260210-001', 92000, 'PENDIENTE', NOW())
// RETURNING id;
//
// INSERT INTO order_items (order_id, producto_id, cantidad, precio_unitario)
// VALUES (1, '33', 2, 23000), (1, '35', 1, 46000);
//
// UPDATE products SET stock = stock - 2 WHERE id = '33';
// UPDATE products SET stock = stock - 1 WHERE id = '35';
//
// COMMIT;
```

### Flujo de Estados de Pedidos

```
                    ┌──────────────────┐
                    │ PEDIDO CREADO     │
                    │ estado: PENDIENTE │
                    └────────┬──────────┘
                             │
                    Admin clic "Confirmar"
                             │
                    ┌────────▼──────────────┐
                    │ EN_PREPARACION       │
                    │ (siendo procesado)   │
                    └────────┬──────────────┘
                             │
                    Admin clic "Marcar Entregado"
                             │
                    ┌────────▼──────────────┐
                    │ ENTREGADO           │
                    │ (finalizado)         │
                    └─────────────────────┘

// Cambiar estado en admin.js
function cambiarEstadoPedido(idPedido, nuevoEstado) {
  fetch(`${BACKEND_URL}/api/v1/orders/${idPedido}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ estado: nuevoEstado })
  });
}

// Backend: orders.controller.ts
@Patch(':id/status')
async cambiarEstado(
  @Param('id') id: string,
  @Body() updateStatusDto: UpdateStatusDto
) {
  // Valida transición permitida
  const estadosPermitidos = {
    'PENDIENTE': ['EN_PREPARACION'],
    'EN_PREPARACION': ['ENTREGADO', 'PENDIENTE'],
    'ENTREGADO': []
  };

  const pedidoActual = await this.prisma.orders.findUnique({
    where: { id }
  });

  if (!estadosPermitidos[pedidoActual.estado]
      .includes(updateStatusDto.estado)) {
    throw new BadRequestException('Transición no permitida');
  }

  return this.prisma.orders.update({
    where: { id },
    data: {
      estado: updateStatusDto.estado,
      updatedAt: new Date()
    }
  });
}

// SQL:
// UPDATE orders
// SET estado = 'EN_PREPARACION', updated_at = NOW()
// WHERE id = '1'
// RETURNING *;
```

---

## 3. SISTEMA DE OFERTAS

### Crear Oferta (Admin)

```javascript
// Cliente: admin.js agregarOferta()
function agregarOferta() {
  const ofertaData = {
    nombre: document.getElementById('oferta-nombre').value,
    productoId: document.getElementById('oferta-producto').value,
    descuento: parseFloat(document.getElementById('oferta-descuento').value),
    descuentoTipo: 'PORCENTAJE' // o 'MONTO'
  };

  fetch(`${BACKEND_URL}/api/v1/offers`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: JSON.stringify(ofertaData)
  });
}

// Backend: offers.controller.ts
@Post()
async create(@Body() createOfferDto: CreateOfferDto) {
  // Valida que el producto existe
  const producto = await this.prisma.products.findUnique({
    where: { id: createOfferDto.productoId }
  });

  if (!producto) {
    throw new NotFoundException('Producto no encontrado');
  }

  // Crea oferta
  return this.prisma.offers.create({
    data: {
      nombre: createOfferDto.nombre,
      productoId: createOfferDto.productoId,
      descuento: createOfferDto.descuento,
      descuentoTipo: createOfferDto.descuentoTipo,
      activa: true,
      createdAt: new Date()
    }
  });
}

// SQL:
// INSERT INTO offers (nombre, producto_id, descuento, descuento_tipo, activa)
// VALUES ('Oferta Especial', '33', 15, 'PORCENTAJE', true)
// RETURNING *;
```

### Mostrar Ofertas en Frontend

```javascript
// Cliente: ofertas.js cargarOfertasFromAPI()
async function cargarOfertasFromAPI() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/offers`);
    let ofertas = await response.json();

    // Maneja respuesta (array o { data: [...] })
    ofertas = Array.isArray(ofertas)
      ? ofertas
      : Array.isArray(ofertas.data)
        ? ofertas.data
        : [];

    // Enriquece con info del producto
    const ofertasConProducto = await Promise.all(
      ofertas.map(async (oferta) => {
        const prodResponse = await fetch(
          `${BACKEND_URL}/api/v1/products/${oferta.productoId}`,
        );
        const producto = await prodResponse.json();

        return {
          ...oferta,
          producto: producto.data || producto,
          precioOriginal: producto.precio,
          precioConDescuento:
            oferta.descuentoTipo === "PORCENTAJE"
              ? producto.precio * (1 - oferta.descuento / 100)
              : producto.precio - oferta.descuento,
        };
      }),
    );

    // Dibuja grid de ofertas
    insertarHTMLOfertas(ofertasConProducto);
  } catch (e) {
    console.error("Error cargando ofertas:", e);
  }
}

// HTML generado:
const html = ofertasConProducto
  .map(
    (oferta) => `
  <div class="producto-card oferta">
    <div class="oferta-badge">OFERTA ${oferta.descuento}%</div>
    <img src="${oferta.producto.imagen}" alt="${oferta.producto.nombre}">
    
    <h3>${oferta.producto.nombre}</h3>
    <p class="precio-original">
      $${oferta.precioOriginal.toLocaleString("es-CO")}
    </p>
    <p class="precio-descuento">
      $${oferta.precioConDescuento.toFixed(0).toLocaleString("es-CO")}
    </p>
    
    <button class="btn-agregar" 
            onclick="agregarAlCarrito('${oferta.productoId}')">
      Agregar al Carrito
    </button>
  </div>
`,
  )
  .join("");
```

---

## 4. CARRITO DE COMPRAS

### Agregar Producto

```javascript
// Cliente: app.js
function agregarAlCarrito(productoId) {
  // 1. Busca el producto
  const producto = productosActuales.find((p) => p.id === productoId);

  if (!producto) {
    console.error("Producto no encontrado");
    return;
  }

  // 2. Verifica si ya está en carrito
  const itemExistente = carritoItems.find((c) => c.id === productoId);

  if (itemExistente) {
    // Aumenta cantidad
    itemExistente.cantidad++;
  } else {
    // Agrega nuevo item
    carritoItems.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen,
    });
  }

  // 3. Guarda en localStorage
  localStorage.setItem("carrito", JSON.stringify(carritoItems));

  // 4. Actualiza UI
  actualizarCarrito();
}

// localStorage["carrito"] contendrá:
// [
//   { id: "33", nombre: "ALUMINIO 100 MTS", precio: 23000, cantidad: 2, imagen: "..." },
//   { id: "35", nombre: "COBRE 50 MTS", precio: 46000, cantidad: 1, imagen: "..." }
// ]
```

### Cambiar Cantidad

```javascript
// Cliente: app.js
function cambiarCantidadDirecta(inputElement, indexItem) {
  const nuevaCantidad = parseInt(inputElement.value);

  // Valida rango
  if (nuevaCantidad < 1 || nuevaCantidad > 100) {
    inputElement.value = carritoItems[indexItem].cantidad;
    return;
  }

  // Actualiza
  carritoItems[indexItem].cantidad = nuevaCantidad;

  // Guarda
  localStorage.setItem('carrito', JSON.stringify(carritoItems));

  // Redibuja
  actualizarCarrito();
}

// HTML del input:
<input type="number"
       value="${item.cantidad}"
       min="1"
       max="100"
       onchange="cambiarCantidadDirecta(this, ${index})">
```

### Calcular Total

```javascript
// Cliente: app.js
function calcularTotal() {
  return carritoItems.reduce(
    (total, item) => total + item.cantidad * item.precio,
    0,
  );
}

// Ejemplo:
// Item 1: 2 × 23000 = 46000
// Item 2: 1 × 46000 = 46000
// TOTAL = 92000
```

---

## 5. PANEL DASHBOARD (ADMIN)

### Cargar Datos Dashboard

```javascript
// Cliente: admin.js actualizarDashboard()
async function actualizarDashboard() {
  const token = localStorage.getItem("admin-token");

  try {
    // Paralelo: obtener todas las métricas
    const [respPedidos, respProductos, respUsuarios] = await Promise.all([
      fetch(`${BACKEND_URL}/api/v1/orders`, {
        headers: { Authorization: "Bearer " + token },
      }),
      fetch(`${BACKEND_URL}/api/v1/products`, {
        headers: { Authorization: "Bearer " + token },
      }),
      fetch(`${BACKEND_URL}/api/v1/users`, {
        headers: { Authorization: "Bearer " + token },
      }),
    ]);

    const pedidos = await respPedidos.json();
    const productos = await respProductos.json();
    const usuarios = await respUsuarios.json();

    // Calcula métricas
    const totalPedidos = pedidos.length;
    const totalIngresos = pedidos.reduce((sum, p) => sum + p.total, 0);
    const productosActivos = productos.data.filter((p) => p.activo).length;
    const productosAgotados = productos.data.filter(
      (p) => p.stock === 0,
    ).length;

    // Actualiza tabla de estadísticas
    document.getElementById("total-pedidos").textContent = totalPedidos;
    document.getElementById("total-ingresos").textContent =
      totalIngresos.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
      });
    document.getElementById("productos-activos").textContent = productosActivos;
    document.getElementById("productos-agotados").textContent =
      productosAgotados;

    // Datos para gráficos
    dibujarGraficos(pedidos, productos);
  } catch (error) {
    console.error("Error actualizando dashboard:", error);
  }
}
```

### Gráficos (Chart.js)

```javascript
// Cliente: admin.js dibujarGraficos()
function dibujarGraficos(pedidos, productos) {
  // 1. Gráfico de Ventas por Mes
  const ventasPorMes = agruparPedidosPorMes(pedidos);

  new Chart(document.getElementById("chart-ventas"), {
    type: "line",
    data: {
      labels: ventasPorMes.meses,
      datasets: [
        {
          label: "Ventas ($)",
          data: ventasPorMes.totales,
          borderColor: "#386273",
          backgroundColor: "rgba(56, 98, 115, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });

  // 2. Gráfico de Stock Disponible
  const stockDisponible = productos.data.filter((p) => p.stock > 0).length;
  const stockAgotado = productos.data.filter((p) => p.stock === 0).length;

  new Chart(document.getElementById("chart-stock"), {
    type: "doughnut",
    data: {
      labels: ["Disponible", "Agotado"],
      datasets: [
        {
          data: [stockDisponible, stockAgotado],
          backgroundColor: ["#4CAF50", "#FF6B6B"],
        },
      ],
    },
  });
}
```

---

## 6. REPORTES DE INVENTARIO

### Generar Reporte

```javascript
// Cliente: admin.js generarReporteInventario()
async function generarReporteInventario() {
  try {
    const token = localStorage.getItem("admin-token");

    // Obtiene productos
    const prodRes = await fetch(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let productos = await prodRes.json();
    productos = Array.isArray(productos)
      ? productos
      : Array.isArray(productos.data)
        ? productos.data
        : [];

    // Clasifica por stock
    const bajoStock = productos.filter((p) => p.stock > 0 && p.stock < 5);
    const agotados = productos.filter((p) => p.stock === 0);
    const criticos = productos.filter((p) => p.stock > 0 && p.stock < 3);

    // Actualiza estadísticas
    document.getElementById("stat-bajo-stock").textContent = bajoStock.length;
    document.getElementById("stat-agotados").textContent = agotados.length;
    document.getElementById("stat-critico").textContent = criticos.length;

    // Dibuja tabla
    const todosBajoStock = [...bajoStock, ...agotados].sort(
      (a, b) => a.stock - b.stock,
    );

    const html = todosBajoStock
      .map(
        (prod) => `
      <tr>
        <td>${prod.nombre}</td>
        <td>${prod.categoria || "Sin categoría"}</td>
        <td><strong>${prod.stock}</strong></td>
        <td>
          <span style="background: ${prod.stock === 0 ? "#ffccbc" : "#ffe0b2"}">
            ${prod.stock === 0 ? "AGOTADO" : "CRÍTICO"}
          </span>
        </td>
      </tr>
    `,
      )
      .join("");

    document.getElementById("tabla-inventario").innerHTML = html;
  } catch (error) {
    console.error("Error generando reporte:", error);
  }
}
```

---

# BASE DE DATOS

## Esquema PostgreSQL (Prisma)

```prisma
// backend/prisma/schema.prisma

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  password  String
  nombre    String
  rol       String    @default("USER")
  activo    Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  orders    Order[]
}

model Product {
  id          String    @id @default(cuid())
  nombre      String
  descripcion String?
  precio      Float
  stock       Int
  imagen      String?
  categoriaId String
  activo      Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  categoria   Category  @relation(fields: [categoriaId], references: [id])
  orderItems  OrderItem[]
}

model Category {
  id        String    @id @default(cuid())
  nombre    String    @unique
  createdAt DateTime  @default(now())

  products  Product[]
}

model Order {
  id            String    @id @default(cuid())
  numero        String    @unique
  usuarioId     String
  items         OrderItem[]
  total         Float
  estado        String    @default("PENDIENTE")
  notasEntrega  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  usuario       User      @relation(fields: [usuarioId], references: [id])
}

model OrderItem {
  id                String    @id @default(cuid())
  orderId           String
  productoId        String
  cantidad          Int
  precioUnitario    Float
  subtotal          Float
  createdAt         DateTime  @default(now())

  order             Order     @relation(fields: [orderId], references: [id])
  producto          Product   @relation(fields: [productoId], references: [id])
}

model Offer {
  id            String    @id @default(cuid())
  nombre        String
  productoId    String
  descuento     Float
  descuentoTipo String    // "PORCENTAJE" o "MONTO"
  activa        Boolean   @default(true)
  createdAt     DateTime  @default(now())
}

model Notification {
  id        String    @id @default(cuid())
  titulo    String
  mensaje   String
  tipo      String    // "PEDIDO_NUEVO", "STOCK_BAJO", etc
  leida     Boolean   @default(false)
  createdAt DateTime  @default(now())
}
```

## Relaciones Principales

```
┌─────────┐
│  User   │ (Administrador)
└────┬────┘
     │ (1:N)
     │
     ▼
┌─────────┐
│  Order  │ (Pedido)
└────┬────┘
     │ (1:N)
     │
     ▼
┌──────────┐
│OrderItem │ (Líneas del pedido)
└────┬─────┘
     │ (N:1)
     │
     ▼
┌─────────┐
│ Product │ (Producto)
└────┬────┘
  (N:1)│
     │
     ▼
┌──────────┐
│Category  │ (Categoría)
└──────────┘

Ofertas:
┌─────────┐
│  Offer  │ → referencias a Product (descuento)
└─────────┘
```

---

# EJEMPLOS DE REQUESTS

## Login

**REQUEST:**

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@inventory.com",
  "password": "admin123"
}
```

**RESPONSE:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clvz1234abcd",
    "email": "admin@inventory.com",
    "nombre": "Administrador",
    "rol": "ADMIN",
    "activo": true
  }
}
```

## Listar Productos

**REQUEST:**

```http
GET http://localhost:3000/api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**RESPONSE:**

```json
{
  "data": [
    {
      "id": "33",
      "nombre": "ALUMINIO 100 MTS",
      "descripcion": "Aluminio de calidad superior",
      "precio": 23000,
      "stock": 10,
      "imagen": "url-imagen",
      "categoriaId": "1",
      "activo": true,
      "createdAt": "2026-02-03T02:54:04.693Z"
    },
    ...
  ]
}
```

## Crear Pedido

**REQUEST:**

```http
POST http://localhost:3000/api/v1/orders
Content-Type: application/json

{
  "usuarioNombre": "Juan Pérez",
  "usuarioEmail": "juan@example.com",
  "usuarioTelefono": "+573001234567",
  "direccion": "Calle 10 #20-30 Apt 5",
  "items": [
    {
      "productoId": "33",
      "cantidad": 2,
      "precio": 23000
    },
    {
      "productoId": "35",
      "cantidad": 1,
      "precio": 46000
    }
  ],
  "total": 92000
}
```

**RESPONSE:**

```json
{
  "id": "ord-001",
  "numero": "ORD-20260210-001",
  "usuarioId": "usr-123",
  "items": [...],
  "total": 92000,
  "estado": "PENDIENTE",
  "createdAt": "2026-02-10T14:30:00Z"
}
```

## Cambiar Estado Pedido

**REQUEST:**

```http
PATCH http://localhost:3000/api/v1/orders/ord-001/status
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "estado": "EN_PREPARACION"
}
```

**RESPONSE:**

```json
{
  "id": "ord-001",
  "numero": "ORD-20260210-001",
  "estado": "EN_PREPARACION",
  "updatedAt": "2026-02-10T14:35:00Z"
}
```

---

# FLUJOS DE NEGOCIO

## Flujo Completo: Cliente Compra

```
1. NAVEGACIÓN
   └─ Cliente accede http://localhost:8000/html/index.html
      └─ index.html se carga
         └─ app.js se ejecuta
            ├─ Carga carrito de localStorage
            ├─ Carga productos de JSON local
            └─ Dibuja grid de productos

2. FILTRADO
   └─ Cliente selecciona categoría
      └─ app.js: filtrarPorCategoria()
         ├─ Filtra array local
         └─ Redibuja solo productos de esa categoría

3. BÚSQUEDA
   └─ Cliente escribe en campo búsqueda
      └─ app.js: buscarProductos() (evento input)
         ├─ Filtra productos por nombre
         └─ Redibuja dinámicamente

4. VER DETALLE
   └─ Cliente clic en producto
      └─ Abre detalle-producto.html
         ├─ Carga producto específico (ID en URL)
         ├─ Muestra imagen, descripción, precio, stock
         └─ Input editable para cantidad

5. AGREGAR A CARRITO
   └─ Cliente clic "Agregar al Carrito"
      └─ app.js: agregarAlCarrito()
         ├─ Valida producto existe
         ├─ Si ya está: aumenta cantidad
         ├─ Si no está: agrega nuevo item
         ├─ Guarda en localStorage
         └─ Actualiza UI (badge contador)

6. ABRIR CARRITO
   └─ Cliente clic en carrito (badge)
      └─ Panel carrito se abre
         ├─ Muestra items con cantidades
         ├─ Permite editar cantidades (inputs)
         ├─ Calcula total dinámico
         └─ Botón "CONFIRMAR COMPRA"

7. EDITAR CARRITO
   └─ Cliente cambia cantidad en input
      └─ app.js: cambiarCantidadDirecta()
         ├─ Valida rango (1-100)
         ├─ Actualiza item
         ├─ Guarda en localStorage
         └─ Recalcula total

8. VACIAR CARRITO
   └─ Cliente clic "Vaciar"
      └─ app.js: vaciarCarrito()
         ├─ Limpia array carritoItems
         ├─ Limpia localStorage
         └─ Cierra panel y redibuja

9. CONFIRMAR COMPRA
   └─ Cliente clic "CONFIRMAR COMPRA"
      └─ app.js: confirmarCompra()
         ├─ Valida que carrito no esté vacío
         ├─ Pide datos: nombre, email, teléfono, dirección
         ├─ Construye objeto pedido
         └─ ENVÍA A BACKEND ────────┐
                                    │
         ┌──────────────────────────┘
         │
         ▼ Backend: orders.controller.ts
         ├─ Valida autenticación
         ├─ Valida stock disponible para c/item
         ├─ Crea orden en BD (INSERT)
         ├─ Crea order_items (INSERT)
         ├─ Actualiza stock productos (UPDATE)
         ├─ Crea notificación (INSERT)
         └─ Retorna ID orden y número radicado
                     │
         ┌──────────┘
         │
         ▼ Cliente recibe respuesta
         ├─ Muestra mensaje: "Pedido confirmado!"
         ├─ Número de radicado
         ├─ Vacía automáticamente carrito
         └─ Opción: "Ver seguimiento" o "Volver a tienda"

10. VER OFERTAS
    └─ Cliente clic en "OFERTAS" (navbar)
       └─ Abre ofertas.html
          ├─ Carga productos con descuento
          ├─ Calcula precioConDescuento
          ├─ Muestra badge % descuento
          └─ "Agregar al Carrito" normal
```

## Flujo Admin

```
1. ACCESO PANEL
   └─ Admin accede http://localhost:8000/html/login-admin.html
      ├─ Completa email: admin@inventory.com
      ├─ Contraseña: admin123
      └─ Clic "ENTRAR" ─────────────┐
                                    │
         ┌──────────────────────────┘
         │
         ▼ Frontend login-admin.js
         ├─ fetch POST /api/v1/auth/login
         └─ ENVÍA CREDENCIALES ────┐
                                  │
         ┌─────────────────────────┘
         │
         ▼ Backend auth.controller.ts
         ├─ Busca usuario por email
         ├─ Valida contraseña (bcrypt)
         ├─ Genera JWT token
         └─ Retorna { access_token, user }
                     │
         ┌───────────┘
         │
         ▼ Frontend recibe token
         ├─ Guarda en localStorage
         ├─ Redirige a admin.html
         └─ Envía token en headers ────┐

2. CARGA DASHBOARD
   └─ admin.html DOMContentLoaded
      ├─ Valida token existe
      ├─ Si no → redirige a login
      ├─ Si sí → cargarDatosAdmin() ────┐
                                        │
         ┌───────────────────────────────┘
         │
         ▼ Peticiones paralelas:
         ├─ GET /api/v1/products (con Bearer token)
         ├─ GET /api/v1/orders (con Bearer token)
         ├─ GET /api/v1/users (con Bearer token)
         └─ TODAS PARALELO →────────────┐
                                        │
         ┌───────────────────────────────┘
         │
         ▼ Backend valida headers
         ├─ Extrae token de "Bearer XXX"
         ├─ Valida JWT
         ├─ Si inválido → 401 Unauthorized
         ├─ Si válido → Procesa request
         └─ Retorna datos ────┐
                              │
         ┌────────────────────┘
         │
         ▼ Frontend recibe data paralela
         ├─ Mapea arrays
         ├─ Calcula estadísticas
         ├─ Dibuja dashboard con gráficos
         ├─ CargatablaProductos()
         ├─ cargarTablaPedidos()
         ├─ cargarTablaUsuarios()
         └─ setInterval: agualiza cada 10s

3. GESTIONAR PRODUCTOS
   └─ Admin clic en PRODUCTOS (menú)
      └─ Muestra tablaProductos() con:
         ├─ Nombre, Categoría, Stock, Estado (Badge)
         ├─ Botones: Ver, Editar, Eliminar
         └─ Admin clic "AGREGAR PRODUCTO" ─────────┐
                                                  │
            ┌─────────────────────────────────────┘
            │
            ▼ Modal con form
            ├─ Nombre, Descripción, Precio, Stock, Categoría
            ├─ Admin completa datos
            └─ Clic "GUARDAR" ──────────┐
                                        │
            ┌───────────────────────────┘
            │
            ▼ admin.js guardarProducto()
            ├─ Valida datos
            ├─ fetch POST /api/v1/products
            ├─ Envía objeto { nombre, precio, stock, ... }
            │
            ├─ BACKEND: ─────────┐
            │                    │
            ├─ ProductsController.create()
            ├─ Valida DTO
            ├─ prisma.products.create({...})
            ├─ INSERT INTO products VALUES(...)
            ├─ Retorna producto creado
            │
            └─ FRONTEND recibe respuesta
                ├─ Cierra modal
                ├─ Recarga tabla
                ├─ Muestra "✓ Producto creado"
                └─ Inicia actualizacion auto

4. GESTIONAR PEDIDOS
   └─ Admin clic en PEDIDOS (menú)
      └─ Muestra tablaPedidos() con:
         ├─ #Radicado, Cliente, Teléfono, Items, Total, Estado
         ├─ Estado con badge (PENDIENTE/EN_PREP/ENTREGADO)
         ├─ Botones: Ver detalles, Confirmar, WhatsApp
         └─ Admin clic "✓ CONFIRMAR" ─────────┐
                                              │
            ┌─────────────────────────────────┘
            │
            ▼ admin.js confirmarPedido()
            ├─ fetch PATCH /api/v1/orders/{id}/status
            ├─ Envía { estado: "EN_PREPARACION" }
            │
            ├─ BACKEND: ─────────┐
            │                    │
            ├─ OrdersController.cambiarEstado()
            ├─ Valida transición permitida
            ├─ prisma.orders.update()
            ├─ UPDATE orders SET estado = ...
            ├─ Retorna orden actualizada
            │
            └─ FRONTEND recibe respuesta
                ├─ Tabla se actualiza
                ├─ Badge cambia de estado
                ├─ Mostrar "✓ Estado actualizado"
                └─ Siguiente actualización auto: 10s

5. VER REPORTES
   └─ Admin clic en REPORTES
      └─ generarReporteInventario() ──────┐
                                          │
         ┌────────────────────────────────┘
         │
         ▼ fetch GET /api/v1/products (con token)
         ├─ Backend devuelve todos productos
         └─ Recibe respuesta
            │
            ├─ Frontend procesa:
            ├─ Filtra bajoStock (stock < 5)
            ├─ Filtra agotados (stock = 0)
            ├─ Filtra críticos (stock < 3)
            ├─ Actualiza estadísticas counters
            ├─ Dibuja tabla ordenada por stock
            └─ Muestra badges de alerta

6. GESTIONAR OFERTAS
   └─ Admin clic en OFERTAS
      └─ Muestra tabla ofertas
         ├─ Nombre, Producto, Descuento, Estado
         └─ Admin clic "CREAR OFERTA" ──────┐
                                            │
            ┌──────────────────────────────┘
            │
            ▼ Modal con form
            ├─ Nombre oferta
            ├─ Selecciona producto (dropdown)
            ├─ % descuento o monto
            └─ Clic "GUARDAR" ──────┐
                                    │
            ┌─────────────────────────┘
            │
            ▼ admin.js crearOferta()
            ├─ fetch POST /api/v1/offers
            ├─ Envía datos
            │
            ├─ BACKEND: ──────┐
            │                 │
            ├─ OffersController.create()
            ├─ Valida producto existe
            ├─ prisma.offers.create()
            ├─ Retorna oferta
            │
            └─ FRONTEND recibe respuesta
                ├─ Cierra modal
                ├─ Agrega fila nueva en tabla
                ├─ Mostrar "✓ Oferta creada"
                └─ Oferta ahora visible en ofertas.html
```

---

## Actualización Automática (cada 10s)

```javascript
// admin.js setInterval
setInterval(() => {
  const now = Date.now();

  // Evita actualización muy frecuente
  if (now - lastUpdateTime < 8000) return;
  lastUpdateTime = now;

  // 1. Carga datos nuevamente
  cargarDatosAdmin();

  // 2. Si la sección PEDIDOS está visible
  if (seccionPedidos visible) {
    cargarTablaPedidos();
  }

  // 3. Si la sección DASHBOARD está visible
  if (seccionDashboard visible) {
    actualizarDashboard();
  }
}, 10000); // cada 10 segundos
```

Esto permite que el admin vea cambios en tiempo real:

- Nuevo pedido → aparece en tabla autom.
- Stock actualizado → se recalcula auto
- Estado cambiado → se refleja inmediatamente

---

# RESUMEN ARQUITECTURA

```
┌──────────────────────────────────────────────────────────────┐
│                    CAPAS DE LA APLICACIÓN                    │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PRESENTACIÓN (Frontend)                                    │
│  - 5 páginas HTML                                           │
│  - CSS responsive                                           │
│  - JavaScript vanilla (manipulación DOM)                    │
│  - localStorage para estado cliente                         │
└─────────────────────────────────────────────────────────────┘
         │ HTTP REST + JSON
         │ Bearer Token en headers
         ▼
┌─────────────────────────────────────────────────────────────┐
│  API (Backend - NestJS)                                     │
│  Controllers → reciben requests                             │
│  Services → lógica de negocio                               │
│  Guards → validan JWT                                       │
│  DTOs → validan datos                                       │
│  Pipes → transforman datos                                  │
└─────────────────────────────────────────────────────────────┘
         │ ORM Prisma
         │ SQL generado automático
         ▼
┌─────────────────────────────────────────────────────────────┐
│  PERSISTENCIA (Base de Datos)                               │
│  PostgreSQL                                                 │
│  - Tables: users, products, orders, etc                     │
│  - Relaciones: FK, índices                                  │
│  - Transacciones ACID                                       │
└─────────────────────────────────────────────────────────────┘

FLUJO DATOS:
User Input (navegador)
  ↓
JavaScript Event Listener
  ↓
Validación Frontend
  ↓
fetch() con JSON
  ↓
HTTP Request al servidor
  ↓
NestJS Controller recibe
  ↓
Guard valida JWT
  ↓
DTO valida estructura
  ↓
Service ejecuta lógica
  ↓
Prisma
  ↓
PostgreSQL query
  ↓
Resultado devuelto al service
  ↓
Controller retorna JSON
  ↓
HTTP Response
  ↓
Frontend recibe JSON
  ↓
Valida y procesa
  ↓
Actualiza DOM
  ↓
User ve cambio en pantalla
```

Este documento es una referencia completa de cómo funciona tu aplicación. Cada consulta pasadatos por HTTP, es validada, procesada en el backend, ejecuta en BD y retorna. Todo integrado y funcional. 🚀
