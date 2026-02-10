# 🏪 INVENTORY - Sistema de Inventario y E-commerce

Sistema completo de inventario y e-commerce para una distribuidora de productos de hogar y abarrotes.

## 🎨 Características Visuales

- **Paleta de Colores Corporativa:**
  - Azul Claro: #B6E1F2
  - Azul Oscuro: #386273
- **Tipografía:** Poppins, Roboto, Inter (sans-serif)
- **Diseño:** Minimalista, limpio, responsivo (Desktop y Tablet)
- **Íconos:** Planos y consistentes

---

## 📦 MÓDULO 1 - E-COMMERCE (CLIENTES)

### 🏠 Página Principal

- Encabezado con logo, barra de búsqueda, categorías y carrito
- Sección de banners promocionales
- Grid de productos con imagen, nombre, precio
- Pie de página con contacto y redes sociales

**URL:** `public/html/index.html`

### 🔍 Funciones

#### Barra de Búsqueda

- Buscar por nombre o categoría
- Validación: mostrar mensaje si busca vacío

#### Categorías

- Bebidas
- Snacks
- Limpieza
- Higiene

#### 🛒 Carrito de Compras

- Panel lateral con productos seleccionados
- Cantidades editables
- Botón "Finalizar Pedido" (solo habilitado con productos)
- Validaciones de carrito vacío

#### 👤 Autenticación

**Registro (registro.html)**

- Campos: Nombre, Apellido, Email, Teléfono, Contraseña, Confirmar Contraseña
- Validaciones: campos obligatorios, contraseñas coinciden
- Redirige a login después del registro

**Iniciar Sesión (login.html)**

- Campos: Email, Contraseña
- Validaciones: formato correcto, campos obligatorios
- Redirige al e-commerce después del login

#### 💳 Confirmación de Pedido (confirmacion.html)

- Resumen del pedido con datos del cliente
- Lista de productos y total
- Mensaje de confirmación con número de pedido

---

## 🧩 MÓDULO 2 - PANEL DE ADMINISTRADOR

### 🔐 Login Administrador (login-admin.html)

**Credenciales por defecto:**

- Email: `admin@inventory.com`
- Contraseña: `admin123`

### 🖥️ Dashboard (admin.html)

#### Menú Lateral

- 📊 Inicio
- 📦 Productos
- 🏷️ Categorías
- 🚚 Pedidos
- 👥 Usuarios
- 📈 Reportes
- ⚙️ Configuración
- 🔴 Cerrar Sesión

#### 📊 Dashboard Principal

**Tarjetas de Estadísticas:**

- Total de Ventas ($)
- Total de Productos
- Pedidos Pendientes
- Clientes Registrados

**Gráficos:**

- Productos Más Vendidos (Gráfico de barras)
- Nivel de Inventario (Gráfico de dona)

#### 📦 Gestión de Productos

**Tabla con:**

- Imagen, Nombre, Categoría, Precio, Stock

**Acciones:**

- ✏️ Editar Producto
- 🗑️ Eliminar Producto
- ➕ Agregar Nuevo Producto (Modal)

**Modal de Producto:**

- Nombre
- Categoría
- Precio
- Stock
- URL de Imagen
- Descripción

#### 🚚 Gestión de Pedidos

**Tabla con:**

- ID Pedido, Cliente, Fecha, Total, Estado

**Estados:**

- ⏳ Pendiente
- 🔄 En Preparación
- ✓ Entregado

**Funciones:**

- Filtrar por estado
- Cambiar estado del pedido

#### 👥 Gestión de Usuarios

**Tabla con:**

- Nombre, Email, Teléfono, Tipo de Rol

**Acciones:**

- Cambiar permisos
- Eliminar usuario

#### 📈 Reportes

**Gráficos:**

- Ventas por Mes (Gráfico de línea)
- Productos por Categoría (Gráfico de pastel)

#### ⚙️ Configuración

- Nombre de la Tienda
- Email de Contacto
- Teléfono
- Dirección

---

## 🚀 Cómo Ejecutar

### Opción 1: Con Servidor Local (Recomendado)

```bash
# Ir al directorio del proyecto
cd "inventory app"

# Iniciar un servidor local (Python)
python -m http.server 8000

# O con Node.js
npx http-server
```

Luego abre en tu navegador: `http://localhost:8000`

### Opción 2: Abrir Directamente

Abre el archivo `index.html` en tu navegador (ten en cuenta que algunas funciones pueden estar limitadas).

---

## 📁 Estructura de Archivos

```
inventory app/
│
├── index.html (Redirección al e-commerce)
│
├── public/
│   ├── html/
│   │   ├── index.html (E-commerce - Página Principal)
│   │   ├── login.html (Login Cliente)
│   │   ├── registro.html (Registro Cliente)
│   │   ├── confirmacion.html (Confirmación de Pedido)
│   │   ├── admin.html (Dashboard Administrador)
│   │   └── login-admin.html (Login Administrador)
│   │
│   ├── css/
│   │   ├── global.css (Estilos globales)
│   │   ├── ecommerce.css (Estilos E-commerce)
│   │   └── admin.css (Estilos Panel Admin)
│   │
│   ├── js/
│   │   ├── app.js (Lógica E-commerce)
│   │   ├── carrito.js (Gestión de Carrito)
│   │   ├── auth.js (Autenticación)
│   │   └── admin.js (Lógica Panel Admin)
│   │
│   └── assets/
│       ├── logo.png (Logo de la aplicación)
│       └── images/ (Carpeta para imágenes de productos)
```

---

## 🔐 Seguridad

⚠️ **Nota Importante:**

- Los datos se almacenan en `localStorage` (navegador)
- En producción, usar un backend seguro (Node.js, PHP, Python, etc.)
- Las contraseñas deben ser hasheadas
- Implementar autenticación JWT o similares

---

## 💾 Almacenamiento de Datos

Los datos se guardan localmente en el navegador usando `localStorage`:

- `usuario` - Datos del usuario logueado
- `usuarios` - Base de datos de usuarios
- `carrito` - Productos en el carrito
- `pedidos` - Historial de pedidos
- `productos-admin` - Productos del catálogo
- `admin-token` - Token de sesión admin
- `admin-usuario` - Datos del admin logueado

---

## 📋 Validaciones Implementadas

### Cliente

- ✓ Email válido (formato correcto)
- ✓ Contraseñas coinciden (registro)
- ✓ Campos obligatorios
- ✓ Carrito no vacío para pedidos
- ✓ Stock disponible

### Administrador

- ✓ Acceso restringido (login requerido)
- ✓ Campos obligatorios en formularios
- ✓ Validación de datos de producto

---

## 🎯 Flujos Principales

### 👤 Flujo Cliente

1. Inicio → 2. Registro/Login → 3. Explorar Productos → 4. Agregar al Carrito → 5. Finalizar Pedido → 6. Confirmación

### 🔧 Flujo Administrador

1. Login Admin → 2. Dashboard → 3. Gestión (Productos/Pedidos/Usuarios) → 4. Reportes

---

## 🎨 Personalización

### Cambiar Colores

Edita `public/css/global.css`:

```css
:root {
  --azul-claro: #b6e1f2;
  --azul-oscuro: #386273;
  /* ... más colores ... */
}
```

### Cambiar Logo

Reemplaza `public/assets/logo.png` con tu logo.

### Agregar Productos

Los productos están en `public/js/app.js` en el array `productos`.

---

## 📞 Contacto

- 📧 Email: info@inventory.com
- 📱 Teléfono: +506 2345-6789
- 📍 Ubicación: San José, Costa Rica

---

## 📝 Notas

- El sistema usa Chart.js para gráficos en el panel admin
- Las imágenes de productos usan placeholders (reemplazar con URLs reales)
- El sistema es completamente responsivo
- Todos los precios están en Pesos Colombianos ($)

---

**Versión:** 1.0
**Última Actualización:** Enero 2026
