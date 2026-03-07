# ⚡ QUICK START - 5 MINUTOS PARA VER EL ADMIN PANEL

## 🎯 Objetivo

Hacerte login al admin panel y ver todos los filtros, botones y funcionalidades en 5 minutos.

---

## ✅ PRE-REQUISITOS (Verifica que tengas)

```bash
# Terminal 1 - Backend corriendo
http://localhost:3000 ✅

# Terminal 2 - Frontend corriendo
http://localhost:5173 ✅

# Base de datos con datos
admin@inventory.com / admin123 ✅
```

---

## 🚀 PASO A PASO (5 MINUTOS)

### ⏱️ MINUTO 1: Ir al Login

```
1. Abre en navegador: http://localhost:5173/login
2. Deberías ver:
   - Lado izquierdo: Logo StoreHub azul
   - Lado derecho: Formulario blanco
```

### ⏱️ MINUTO 2: Ingresa Credenciales

```
Email:    admin@inventory.com
Password: admin123

3. Click en [Entrar]
4. Notificación verde: "👋 Bienvenido, Administrador!"
```

### ⏱️ MINUTO 3: Admin Dashboard

```
5. URL cambia a: http://localhost:5173/admin
6. Ves el sidebar a la izquierda con:
   - 📊 Dashboard (seleccionado)
   - 📋 Pedidos
   - 🛍️  Productos
   - 📂 Categorías
   - 👥 Usuarios

7. En el contenido principal ves 4 tarjetas:
   - Total Pedidos: 3
   - Productos: 64
   - Ingresos: $1,245,320
   - Pendientes: 2
```

### ⏱️ MINUTO 4: Prueba Pedidos

```
8. Click en "📋 Pedidos" en el sidebar

9. Ves la tabla con filtros arriba:
   - 🔍 Buscar: [campo de texto]
   - Estado: [dropdown]
   - Fecha desde: [date picker]
   - Fecha hasta: [date picker]
   - Precio desde: [número]
   - Precio hasta: [número]

10. Prueba algo:
    - Busca "Juan" en el campo Buscar
    - La tabla se filtra en tiempo real
    - Click [🔄 Limpiar] para resetear

11. Click [📥 Exportar CSV] para descargar datos
```

### ⏱️ MINUTO 5: Prueba Productos

```
12. Click en "🛍️ Productos"

13. Ves un GRID (no tabla) con tarjetas:
    - Imagen del producto
    - Nombre
    - Precio
    - Stock con color (rojo = bajo)
    - Botones [✏️ Editar] [🗑️ Eliminar]

14. Arriba ves filtros:
    - Búsqueda: [campo]
    - Categoría: [dropdown]
    - Precio desde/hasta: [números]
    - Stock desde/hasta: [números]
    - Contador: "Mostrando X de Y productos"

15. Prueba filtros:
    - Selecciona categoría "Snacks"
    - Stock desde: 10 (solo muestra con > 10 stock)
    - Click [📥 Exportar] para descargar

BONUS (si queda tiempo):
- Click en "👥 Usuarios" para ver tabla de usuarios con filtros
- Abre DevTools (F12) → Go to http://localhost:5173/admin/usuarios
```

---

## 🎬 LO QUE DEBERÍAS VER

### Screen 1: Login

```
┌─────────────────────────────────┐
│ 📦 STOREHUB      Iniciar sesión │
│ Gestiona pedidos │ [email box]  │
│ sin problemas    │ [pass box]   │
│ ✅✅✅            │ [Entrar btn] │
└─────────────────────────────────┘
```

### Screen 2: Dashboard

```
┌────────────────┬──────────────────────────────────┐
│ 📦 HUB      │ ☰  Gesión de Pedidos              │
│ 📊Dashboard │                                    │
│ 📋Pedidos   │  ┌─────────┐ ┌─────────┐         │
│ 🛍️Productos │  │ Pedidos │ │Productos│         │
│ 📂Categ.    │  │   3     │ │    64   │         │
│ 👥Usuarios  │  └─────────┘ └─────────┘         │
│             │  ┌─────────┐ ┌─────────┐         │
│ 🚪 Salir    │  │Ingresos │ │Pendientes         │
│ Bienvenido  │  │$1.2M    │ │   2     │         │
│ 👤 Admin    │  └─────────┘ └─────────┘         │
└────────────────┴──────────────────────────────────┘
```

### Screen 3: Pedidos (Vista de filtros)

```
┌──────────────────────────────────────────────┐
│ 🔍 Buscar  │ Estado  │ Fecha │ Precio       │
│ [______]   │ [____▼] │[____] │ [___] [___]  │
│ [Limpiar] [Exportar CSV]                    │
├──────────────────────────────────────────────┤
│ Número │ Cliente │ Email │ Total  │ Estado  │
│─────────────────────────────────────────────│
│ PED-1  │ Juan    │...    │$45,000│ ✓ Entreg│
│ PED-2  │ María   │...    │$87,500│ ⏳ Prep │
│ PED-3  │ Carlos  │...    │$32,000│ ⚠️Pend. │
└──────────────────────────────────────────────┘
```

### Screen 4: Productos (Vista de Grid)

```
┌──────────────────────────────────────────────┐
│ Filtros arriba...                            │
├──────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │ 🥔 Papas │ │ 🍕 Pizza │ │ 🥤 Gasea │     │
│ │ $5,500   │ │ $18,000  │ │ $4,500   │     │
│ │ Stock:45 │ │ Stock:12 │ │ Stock:2  │     │
│ │[✏️][🗑️]  │ │[✏️][🗑️]  │ │[✏️][🗑️]  │     │
│ └──────────┘ └──────────┘ └──────────┘     │
│                                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│ │🍔 Hambur.│ │ 🥗 Ensala│ │ 🍖 Carne │     │
│ │ $12,000  │ │ $8,500   │ │ $22,000  │     │
│ │ Stock:28 │ │ Stock:15 │ │ Stock:8  │     │
│ │[✏️][🗑️]  │ │[✏️][🗑️]  │ │[✏️][🗑️]  │     │
│ └──────────┘ └──────────┘ └──────────┘     │
└──────────────────────────────────────────────┘
```

---

## 🎥 QUÉ HACER EN CADA SECCIÓN

### 📊 Dashboard

- Observa los números
- Haz click en las tarjetas (no hace nada, es informativo)
- Nota los colores y gradientes

### 📋 Pedidos

1. **Búsqueda**: Escribe "Juan" en buscar → Se filtra en tiempo real
2. **Estado**: Selecciona "PENDIENTE" → Solo muestra pendientes
3. **Fechas**: Selecciona un rango → Se filtra por dates
4. **Precios**: Ingresa min 30000, max 50000 → Solo esos precios
5. **CSV**: Click [📥 Exportar] → Descarga archivo.csv

### 🛍️ Productos

1. **Búsqueda**: Escribe "papa" → Busca en nombre y descripción
2. **Categoría**: Selecciona "Snacks" → Solo snacks
3. **Precio**: Establece rango 5000-15000 → Solo ese rango
4. **Stock**: Establece stock mínimo 10 → Solo > 10 stock
5. **Grid**: Nota los 3 colores de stock (rojo/naranja/verde)

### 📂 Categorías

1. Click en "Nueva Categoría" para crear
2. Click en [✏️] para editar categoría
3. Click en [🗑️] para eliminar (pide confirmación)

### 👥 Usuarios

1. **Búsqueda**: Busca por nombre o email
2. **Rol**: Filtra por ADMIN o CLIENTE
3. **Estado**: Filtra por Activo o Inactivo (✨ NUEVA)
4. **CSV**: Exporta datos de usuarios

---

## ✅ CHECKLIST DE VERIFICACIÓN

Mientras pruebas, marca lo que ves:

- [ ] Login page carga
- [ ] Puedo ingresar email y password
- [ ] Click Entrar redirige a /admin (¡NO a /)
- [ ] Sidebar aparece con 5 opciones
- [ ] 4 tarjetas de stats en dashboard
- [ ] Pendidos: puedo buscar
- [ ] Pedidos: puedo seleccionar estado
- [ ] Pedidos: puedo buscar por fecha
- [ ] Pedidos: puedo exportar CSV
- [ ] Productos: veo grid 3x2
- [ ] Productos: puedo filtrar por categoría
- [ ] Productos: puedo filtrar por precio
- [ ] Productos: el contador dice "Mostrando X de Y"
- [ ] Productos: puedo exportar CSV
- [ ] Usuarios: veo tabla con filtros
- [ ] Usuarios: estado Activo/Inactivo funciona
- [ ] Sidebar es responsive (puede colapsar)

Si todo está ✅, ¡el admin panel está funcionando perfectamente!

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Problema: Login no funciona

```
Solución:
1. Verifica backend corriendo: http://localhost:3000
2. CTRL+SHIFT+DEL para limpiar cache del navegador
3. Recarga la página (F5)
```

### Problema: No redirecciona a /admin

```
Solución:
1. Abre DevTools (F12)
2. Console → paste: localStorage.getItem('admin-usuario')
3. Debería mostrar: {"id":"...", "rol":"ADMIN"}
4. Si no, logout y login de nuevo
```

### Problema: Los filtros no funcionan

```
Solución:
1. Verifica que los datos estén en la BD
2. Abre Console (F12), busca erores rojos
3. Recarga la página
```

### Problema: CSV no descarga

```
Solución:
1. Comprueba que los filtros estén aplicados
2. Revisa que tengas al menos 1 resultado
3. Si sigue sin funcionar, abre Console para ver errores
```

---

## 🎓 NOTAS TÉCNICAS

**Si quieres entender el código:**

Archivos clave en `frontend/src/pages/admin/`:

- `AdminLayout.tsx` - Estructura sidebar + topbar
- `AdminDashboard.tsx` - Las 4 tarjetas
- `AdminOrders.tsx` - Tabla con 6 filtros + CSV
- `AdminProducts.tsx` - Grid con 5 filtros + CSV
- `AdminUsers.tsx` - Tabla con 3 filtros + CSV

Archivos CSS correspondientes en `frontend/src/styles/`:

- `admin-layout.css`
- `admin-dashboard.css`
- `admin-orders.css`
- `admin-products.css`
- `admin-users.css`

**Backend endpoints usados:**

- POST /api/v1/auth/login
- GET /api/v1/users (requiere JWT)
- GET /api/v1/orders (requiere JWT)
- GET /api/v1/products (requiere JWT)
- GET /api/v1/categories (requiere JWT)

---

## 📊 ESTADÍSTICAS DE DATOS

Cuando hagas login como admin, verás:

| Sección    | Cantidad | Detalles             |
| ---------- | -------- | -------------------- |
| Usuarios   | 2        | 1 admin + 1 cliente  |
| Órdenes    | 3        | Estados variados     |
| Productos  | 64       | 6 categorías         |
| Categorías | 6        | Snacks, Bebidas, etc |

---

## 🎉 FELICIDADES

Si completaste todo el checklist, ¡tu admin panel está **100% funcional**!

**Próximos pasos:**

1. Implementar notificaciones WhatsApp
2. Agregar gráficos al dashboard
3. Deploy a producción

Cualquier cosa, revisa los archivos de documentación:

- `ADMIN_PANEL_VISUAL_GUIDE.md` → Guía visual completa
- `ADMIN_PANEL_COMPLETO.md` → Descripción detallada
- `RESUMEN_SOLUCION_COMPLETA.md` → Resumen de correcciones
- `FLUJO_LOGIN_ADMIN.md` → Flujo de login paso a paso

¡Buena suerte! 🚀
