# 🎨 Guía Visual del Admin Panel

## Acceso al Panel

- **URL**: `http://localhost:5173/admin`
- **Credenciales**: admin@inventory.com / admin123
- **Rol requerido**: ADMIN
- **Redirección**: Si no es admin, redirige a login automáticamente

---

## 1️⃣ ADMIN LAYOUT (Estructura General)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ┌──────────┐  LOGO              [Menú Hamburguesa] ADMIN       │
│  │ 📦 Store │  StoreHub Admin     (Mostrar/Ocultar)             │
│  │   HUB    │                                                     │
│  └──────────┘                                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐   │
│  │  📊 Dashboard   │  │                                     │   │
│  │  📋 Pedidos     │  │  CONTENIDO PRINCIPAL              │   │
│  │  🛍️  Productos  │  │  (Componente dinámico)            │   │
│  │  📂 Categorías  │  │                                     │   │
│  │  👥 Usuarios    │  │                                     │   │
│  │                 │  │                                     │   │
│  │  ───────────    │  │  ✓ Filtros avanzados              │   │
│  │  🚪 Salir       │  │  ✓ Búsqueda en tiempo real        │   │
│  │                 │  │  ✓ Botones de acción              │   │
│  │  Bienvenido:    │  │  ✓ Exportar CSV                   │   │
│  │  👤 Administrador│  │                                     │   │
│  │                 │  │                                     │   │
│  └─────────────────┘  └─────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Características del Sidebar:

- ✅ Logo con nombre "StoreHub Admin"
- ✅ Navegación con 5 opciones principales
- ✅ Iconos representativos por sección
- ✅ Efecto hover con cambio de color
- ✅ Indicador de página activa (resaltado)
- ✅ Botón de Salir (Logout)
- ✅ Información del usuario (nombre y rol)
- ✅ Responsive: Colapsa en mobile

---

## 2️⃣ ADMIN DASHBOARD

```
┌────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Gestión de Pedidos                                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ 📊 Total     │  │ 📦 Productos │  │ 💰 Ingresos  │         │
│  │   Pendientes │  │ 64 productos │  │ $1,245,320   │         │
│  │   3          │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ ⏳ En proceso │                                               │
│  │    2         │                                               │
│  └──────────────┘                                               │
│                                                                  │
└────────────────────────────────────────────────────────────────┘

Cards con:
✅ Gradientes de colores
✅ Iconos grandes y claros
✅ Números prominentes
✅ Descripción de metrica
✅ Animaciones suaves
✅ Hover effect (sombra aumenta)
```

---

## 3️⃣ ADMIN PEDIDOS (Órdenes)

### Panel de Filtros Superior:

```
┌─────────────────────────────────────────────────────────────────┐
│  FILTROS AVANZADOS                                              │
│                                                                  │
│  ┌─────────────────────┐  ┌──────────────────┐                │
│  │ 🔍 Buscar:          │  │ Estado:          │                │
│  │ [Número, cliente, ..] │ [PENDIENTE ▼]    │                │
│  └─────────────────────┘  └──────────────────┘                │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐               │
│  │ 📅 Desde:        │  │ 📅 Hasta:            │               │
│  │ [2026-03-01 ✕]  │  │ [2026-03-31 ✕]      │               │
│  └──────────────────┘  └──────────────────────┘               │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────────┐               │
│  │ 💵 Precio desde: │  │ 💵 Precio hasta:     │               │
│  │ [0 ✕]            │  │ [999999 ✕]          │               │
│  └──────────────────┘  └──────────────────────┘               │
│                                                                  │
│  [🔄 Limpiar filtros]  [📥 Exportar CSV]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tabla de Órdenes:

```
┌─────────────────────────────────────────────────────────────────┐
│ Número      │ Cliente       │ Fecha      │ Total   │ Estado      │
├─────────────────────────────────────────────────────────────────┤
│ PED-123456  │ Juan García   │ 2026-03-05 │ $45,000 │ PENDIENTE   │
│ PED-123457  │ María López   │ 2026-03-04 │ $87,500 │ EN PREP.    │
│ PED-123458  │ Carlos Ruiz   │ 2026-03-03 │ $32,000 │ ENTREGADO   │
│ PED-123459  │ Ana Martínez  │ 2026-03-01 │ $125,900│ EN PREP.    │
│ PED-123460  │ Pedro Sánchez │ 2026-02-28 │ $56,750 │ ENTREGADO   │
└─────────────────────────────────────────────────────────────────┘

Funcionalidades:
✅ Búsqueda en tiempo real
✅ Filtros combinables
✅ Estados con colores:
   - Rojo (CANCELADO)
   - Naranja (EN_PREPARACION)
   - Verde (ENTREGADO)
   - Gris (PENDIENTE)
✅ Botón 👁️ para ver detalles
✅ Modal para cambiar estado
✅ Exportar a CSV
```

---

## 4️⃣ ADMIN PRODUCTOS

### Panel de Filtros:

```
┌─────────────────────────────────────────────────────────────────┐
│  FILTROS DE PRODUCTOS                                           │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────┐               │
│  │ 🔍 Buscar:           │  │ Categoría:       │               │
│  │ [Nombre, descrip...] │  │ [Papas Fritas ▼] │               │
│  └──────────────────────┘  └──────────────────┘               │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │ 💵 Precio desde: │  │ 💵 Precio hasta: │                  │
│  │ [0 ✕]            │  │ [999999 ✕]      │                  │
│  └──────────────────┘  └──────────────────┘                  │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │ 📦 Stock desde:  │  │ 📦 Stock hasta:  │                  │
│  │ [0 ✕]            │  │ [9999 ✕]        │                  │
│  └──────────────────┘  └──────────────────┘                  │
│                                                                  │
│  [🔄 Limpiar] [📥 Exportar]  Mostrando 32 de 64 productos    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Grid de Productos:

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 🥔 Papas       │  │ 🍕 Pizza con   │  │ 🥤 Gaseosa    │
│ Fritas         │  │ Peperoni       │  │ Coca Cola 2L   │
│                │  │                │  │                │
│ $5,500         │  │ $18,000        │  │ $4,500         │
│ Stock: 45      │  │ Stock: 12      │  │ Stock: 3       │
│                │  │                │  │                │
│ [✏️] [🗑️]     │  │ [✏️] [🗑️]     │  │ [✏️] [🗑️]     │
└────────────────┘  └────────────────┘  └────────────────┘

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 🍔 Hamburguesa │  │ 🥗 Ensalada    │  │ 🍟 Carne      │
│ Clásica        │  │ Mixta          │  │ Asada          │
│                │  │                │  │                │
│ $12,000        │  │ $8,500         │  │ $22,000        │
│ Stock: 28      │  │ Stock: 15      │  │ Stock: 8       │
│                │  │                │  │                │
│ [✏️] [🗑️]     │  │ [✏️] [🗑️]     │  │ [✏️] [🗑️]     │
└────────────────┘  └────────────────┘  └────────────────┘

Características:
✅ Grid responsive 3 columnas
✅ Tarjetas con sombra hover
✅ Iconos de categoría
✅ Precio destacado
✅ Stock con color (verde/rojo)
✅ Botones editar/eliminar
```

---

## 5️⃣ ADMIN CATEGORÍAS

### Tabla de Categorías:

```
┌─────────────────────────────────────────┐
│ Nombre         │ Descripción    │ Icono │
├─────────────────────────────────────────┤
│ Snacks         │ Alimentos Rápid│ 🥔   │
│ Bebidas        │ Bebidas Frías  │ 🥤   │
│ Carnes         │ Carnes Proces. │ 🍖   │
│ Verduras       │ Productos Org. │ 🥬   │
│ Lácteos        │ Quesos y Láct. │ 🧀   │
│ Postres        │ Dulces y Dese. │ 🍰   │
└─────────────────────────────────────────┘

Acciones:
✅ Crear nueva categoría [+ Nuevo]
✅ Editar categoría [🔄]
✅ Eliminar categoría [🗑️]
✅ Modal para formulario
```

---

## 6️⃣ ADMIN USUARIOS

### Panel de Filtros:

```
┌──────────────────────────────────────────────────┐
│ FILTROS DE USUARIOS                              │
│                                                   │
│ ┌────────────────────┐  ┌──────────────────┐    │
│ │ 🔍 Buscar:         │  │ Rol:             │    │
│ │ [Nombre o email..] │  │ [Todos ▼]        │    │
│ └────────────────────┘  └──────────────────┘    │
│                                                   │
│ ┌──────────────────────────────────────────┐    │
│ │ Estado:                                    │    │
│ │ [Todos ▼]                                │    │
│ └──────────────────────────────────────────┘    │
│                                                   │
│ [🔄 Limpiar] [📥 Exportar]                     │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Tabla de Usuarios:

```
┌──────────────────────────────────────────────────────┐
│ Nombre      │ Email           │ Rol    │ Estado     │
├──────────────────────────────────────────────────────┤
│ Admin User  │ admin@inv.com   │ 👤Admin│ ✓ Activo   │
│ Juan García │ juan@email.com  │ 👥 Cli │ ✓ Activo   │
│ María López │ maria@email.com │ 👥 Cli │ ✓ Activo   │
│ Pedro Inact │ pedro@email.com │ 👥 Cli │ ✗ Inactivo │
└──────────────────────────────────────────────────────┘

Acciones:
✅ Cambiar rol [🔄]
✅ Activar/desactivar [🔒/🔓]
✅ Modal para cambio de rol
✅ Confirmación de cambios
```

---

## 🎨 ESTILOS Y COLORES

### Paleta de Colores:

```
📊 Verde Principal     #34d399  (Botones primarios, activos)
🔵 Azul Secundario     #3b82f6  (Exportar, enlaces)
⚪ Gris Fondo          #f3f4f6  (Fondos claros)
⚫ Texto Primary       #1f2937  (Textos principales)
🐦 Texto Secondary     #6b7280  (Textos secundarios)
🔴 Error               #ef4444  (Cancelado, advertencias)
🟠 Warning             #f59e0b  (En preparación)
🟢 Success             #10b981  (Entregado)
```

### Tipografía:

```
H1: 28px, bold (Títulos de página)
H2: 20px, semibold (Subtítulos)
Body: 15px, regular (Contenido)
Small: 13px, regular (Etiquetas, ayuda)
```

### Espaciado:

```
Margin Container:     2rem
Padding Sección:      1.5rem
Gap entre elementos:  1rem
Border Radius:        6-12px
```

---

## 📱 RESPONSIVE DESIGN

### Desktop (1200px+)

```
Sidebar: 200px ancho
Contenido: Tabla completa
Filtros: Grid 4 columnas
```

### Tablet (768px - 1199px)

```
Sidebar: 160px ancho (reducido)
Contenido: Tabla adaptada
Filtros: Grid 2 columnas
```

### Mobile (< 768px)

```
Sidebar: Colapsable/Hamburguesa
Contenido: Full width
Filtros: Grid 1 columna
Tabla: Scroll horizontal
Cards: Stack vertical
```

---

## ✨ ANIMACIONES

```
✅ Hover en botones: translateY(-2px) + sombra
✅ Hover en filas tabla: background-color cambio
✅ Hover en cards: sombra creciente
✅ Focus en inputs: border-color + background
✅ Loading spinner: rotate 360deg
✅ Modal entrada: fade + scale
✅ Transiciones: 0.3s ease
```

---

## 🔐 FUNCIONALIDADES CLAVE

### Búsqueda y Filtros

- ✅ En tiempo real (sin recargar)
- ✅ Case-insensitive
- ✅ Combinables (múltiples filtros activos)
- ✅ Reset en un clic

### Exportar CSV

- ✅ Formatos: Órdenes, Productos, Usuarios
- ✅ Incluye solo datos filtrados
- ✅ Nombre archivo con fecha
- ✅ Descarga automática

### Acciones CRUD

- ✅ Crear (Modal con validación)
- ✅ Leer (Tabla/Cards)
- ✅ Actualizar (Modal de edición)
- ✅ Eliminar (Confirmación)

### Seguridad

- ✅ Solo accesible con rol ADMIN
- ✅ Redirección automática si no es admin
- ✅ Validación en cliente y servidor
- ✅ Token JWT requerido

---

## 📊 ESTADÍSTICAS EN VIVO

El dashboard muestra:

- **Total de Pedidos**: Suma de todas las órdenes
- **Total Productos**: Cantidad de ítems en catálogo
- **Ingresos Totales**: Suma de valores de órdenes completadas
- **Pedidos Pendientes**: Órdenes con estado PENDIENTE

---

## 🚀 PRÓXIMAS MEJORAS

- Notificaciones WhatsApp en tiempo real
- Gráficos interactivos (Recharts)
- Dashboards personalizables
- Reportes avanzados
- Multi-idioma
- Dark mode
