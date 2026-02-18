# 👨‍💼 MANUAL DEL ADMINISTRADOR

**Última Actualización:** 18 Febrero 2026  
**Versión:** 1.0  
**Para:** Administradores y Personal de Gestión

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso a Panel Admin](#acceso-a-panel-admin)
3. [Dashboard Principal](#dashboard-principal)
4. [Gestión de Productos](#gestión-de-productos)
5. [Gestión de Órdenes](#gestión-de-órdenes)
6. [Gestión de Usuarios](#gestión-de-usuarios)
7. [Gestión de Categorías](#gestión-de-categorías)
8. [Reportes y Análisis](#reportes-y-análisis)
9. [Configuración de Sistema](#configuración-de-sistema)
10. [Mejores Prácticas](#mejores-prácticas)

---

## Introducción

El Panel de Administrador es la herramienta central para gestionar todos los aspectos de la tienda e-commerce. Desde aquí puedes:

- ✅ Administrar inventario de productos
- ✅ Procesar y seguimiento de órdenes
- ✅ Gestionar usuarios y roles
- ✅ Organizar categorías
- ✅ Generar reportes
- ✅ Monitorear métricas del negocio

### Requisitos de Acceso

Para acceder al panel necesitas:

1. ✅ Tener credenciales de administrador
2. ✅ Rol asignado como "ADMIN"
3. ✅ Contraseña cambiadda en primer acceso
4. ✅ 2FA (autenticación de dos factores) si configurado

---

## Acceso a Panel Admin

### Paso 1: Ir a Login Admin

```
URL: https://tutienda.com/admin/login
O desde página inicio: hacer clic en "Panel Admin" (pie de página)
```

### Paso 2: Ingresar Credenciales

```
┌─────────────────────────────────────────┐
│         PANEL ADMINISTRATIVO             │
├─────────────────────────────────────────┤
│                                         │
│ Email:        [________________]       │
│                                         │
│ Contraseña:   [________________]       │
│                                         │
│ □ Recuérdame en esta computadora       │
│                                         │
│               [ENTRAR]                 │
│                                         │
│ ¿Olvidaste contraseña? [Link]         │
│                                         │
└─────────────────────────────────────────┘
```

### Paso 3: Autenticación Requerida (Opcional)

Si tu cuenta tiene 2FA habilitado:

```
1. Después de email/contraseña correcta
2. Sistema pedirá código 2FA (desde email o app)
3. Ingresa código de 6 dígitos
4. Accedido al panel
```

### Seguridad de Acceso

⚠️ **IMPORTANTE:**

- 🔐 Nunca compartas tus credenciales admin
- 🔐 Cierra sesión siempre al salir
- 🔐 No dejes panel abierto sin vigilancia
- 🔐 Usa contraseña fuerte (mayús, números, símbolos)
- 🔐 Cambia contraseña regularmente (30 días)
- 🔐 Reporta accesos sospechosos inmediatamente

---

## Dashboard Principal

### Layout del Dashboard

```
┌────────────────────────────────────────────────────┐
│  LOGO     Menu Principal              [Perfil][Exit]│
├────────────────────────────────────────────────────┤
│ SIDEBAR             │ CONTENIDO PRINCIPAL         │
│                    │                              │
│ ├─ Dashboard       │  ╔══════════════════════╗   │
│ ├─ Productos      │  ║   DASHBOARD           ║   │
│ ├─ Órdenes        │  ║ ┌──────────────────┐║   │
│ ├─ Usuarios       │  ║ │ 📦 Productos: 234  ║   │
│ ├─ Categorías     │  ║ │ 🛒 Órdenes Hoy: 12 ║   │
│ ├─ Reportes       │  ║ │ 💰 Venta Hoy:    ║   │
│ ├─ Stock          │  ║ │    $1,250.00       ║   │
│ ├─ Configuración  │  ║ │ 👥 Usuarios: 456   ║   │
│ └─ Ayuda          │  ║ └──────────────────┘║   │
│                    │  │                      │   │
│                    │  │ [Gráficos/Charts]   │   │
│                    │  │                      │   │
│                    │  ╚══════════════════════╝   │
└────────────────────────────────────────────────────┘
```

### Información Mostrada

```
TARJETAS DE RESUMEN (KPIs)

📦 Productos
├─ Total productos: 234
├─ Stock bajo: 12 (menos de 5 unidades)
├─ Productos sin imagen: 3
└─ Últimos agregados: Hoy

🛒 Órdenes
├─ Total órdenes: 1,234
├─ Órdenes pendientes: 23
├─ Órdenes en proceso: 45
├─ Hoy: 12 órdenes
└─ Ventas hoy: $1,250.00

💰 Ventas
├─ Este mes: $25,000.00
├─ Promedio diario: $833.33
├─ Mejor día: Viernes último
└─ Crecimiento: +15% vs mes anterior

👥 Usuarios
├─ Total: 456
├─ Nuevos esta semana: 23
├─ Activos último mes: 234
└─ Clientes vs Admins: 450:6

📊 Stock
├─ Artículos con stock bajo: 12
├─ Agotados (stock=0): 3
├─ Movimientos hoy: 45
└─ Entradas/Salidas ratio: 1:2
```

### Gráficos Disponibles

```
1. GRÁFICO DE VENTAS DIARIAS
   └─ Barras/líneas de 30 últimos días

2. GRÁFICO DE TOP 5 PRODUCTOS
   └─ Productos más vendidos

3. GRÁFICO DE ÓRDENES POR ESTADO
   └─ Pie chart: PENDING|PROCESSING|SHIPPED|DELIVERED

4. GRÁFICO DE USUARIOS NUEVOS
   └─ Línea de registros por día

5. GRÁFICO DE CATEGORÍAS POPULARES
   └─ Barras de productos vendidos por categoría
```

---

## Gestión de Productos

### Acceder a Productos

```
En Sidebar: clic en "Productos" → Se abre Gestión de Productos
```

### Vista de Lista de Productos

```
┌─────────────────────────────────────────────────────────┐
│ PRODUCTOS                          [+ NUEVO PRODUCTO]   │
├─────────────────────────────────────────────────────────┤
│ Buscar: [________________]  Categoría: [Todas ▼]        │
│ Stock: [Todos ▼]  Precio: [Todos ▼]  Orden: [Nuevo ▼] │
├─────────────────────────────────────────────────────────┤
│ ID │ Nombre     │ Cat   │ Precio │ Stock │ Acc │ [...] │
├────┼────────────┼───────┼────────┼───────┼──✎──┤────── │
│ 1  │ Laptop HP  │ Electrónica │ $599 │ 5  │ ✎ 🗑        │
│ 2  │ Mouse Lóg. │ Electrónica │ $29  │ 45 │ ✎ 🗑        │
│ 3  │ Teclado... │ Electrónica │ $79  │ 0  │ ✎ 🗑        │
│ 4  │ Monitor... │ Electrónica │ $199 │ 8  │ ✎ 🗑        │
└────┴────────────┴───────┴────────┴───────┴──✎──┴────── ┘
  Página 1 de 5 [< > ]  Mostrando 1-20 de 234 productos
```

**Columnas:**

- **ID:** Identificador único
- **Nombre:** Nombre del producto
- **Categoría:** Familia del producto
- **Precio:** Precio de venta
- **Stock:** Cantidad disponible
  - 🟢 Verde: Stock adecuado (>10)
  - 🟡 Amarillo: Stock bajo (5-10)
  - 🔴 Rojo: Sin stock (0)
- **Acciones:** Editar o Eliminar

### Crear Nuevo Producto

```
1. Haz clic en [+ NUEVO PRODUCTO]
2. Se abre formulario detallado:

┌─────────────────────────────────────────┐
│ CREAR NUEVO PRODUCTO                   │
├─────────────────────────────────────────┤
│                                         │
│ INFORMACIÓN BÁSICA                      │
│ Nombre:        [________________]       │
│ Descripción:   [________        ]       │
│ Categoría:     [Electrónica    ▼]      │
│ SKU:           [________________]       │
│                                         │
│ PRECIOS Y STOCK                         │
│ Precio:        [______]  (USD)         │
│ Precio Descto: [______]  (opcional)    │
│ Stock:         [______]  (unidades)    │
│ Stock Mín:     [______]  (alertas)     │
│                                         │
│ IMÁGENES                                │
│ Imagen Principal: [Subir imagen]        │
│ Otras imágenes:   [+ Agregar]           │
│                                         │
│ SECCIÓN AVANZADA                        │
│ □ Producto destacado                   │
│ □ Producto en oferta                   │
│ %-descuento: [____] (si en oferta)     │
│                                         │
│         [GUARDAR] [CANCELAR]           │
│                                         │
└─────────────────────────────────────────┘
```

**Campos Requeridos:**

- ✅ Nombre (mínimo 5 caracteres)
- ✅ Descripción (mínimo 20 caracteres)
- ✅ Categoría (seleccionar de lista)
- ✅ Precio (número positivo)
- ✅ Stock (número >= 0)
- ✅ Imagen principal

**Campos Opcionales:**

- ❌ SKU (código de producto)
- ❌ Precio con descuento
- ❌ Imágenes adicionales
- ❌ Destacado/Oferta

### Editar Producto

```
1. En lista de productos, haz clic en ícono [✎ Editar]
2. Se abre formulario con datos actuales
3. Modifica campos deseados
4. Haz clic en [GUARDAR]
5. Verás confirmación: "✓ Producto actualizado"
```

### Cambios Comunes en Editar

```
CAMBIAR PRECIO
├─ Especialmente antes de promociones
├─ Registro histórico de cambios
└─ Notifica a clientes si baja más del 20%

ACTUALIZAR STOCK
├─ Al recibir mercadería
├─ Se registra movimiento automaticamente
├─ Alerta si cae bajo mínimo

CAMBIAR FOTO
├─ Si hay producto defectuoso o mejora
├─ Carga imagen en proyección correcta
└─ Máximo 5MB por imagen

MARCAR EN OFERTA
├─ Descuento temporal
├─ Especificar % y duración
└─ Se muestra badge en tienda
```

### Eliminar Producto

```
1. Haz clic en ícono [🗑 Eliminar]
2. Confirmación: "¿Eliminar este producto?"
3. Verás opción:
   ├─ [ELIMINAR] - Elimina completamente
   └─ [ARCHIVAR] - Oculta pero mantiene datos
4. Producto desaparece del catálogo
```

⚠️ **Nota:** Mejor archivar que eliminar para mantener historial de órdenes.

### Búsqueda y Filtrado

```
BÚSQUEDA POR NOMBRE
├─ Campo: [Buscar productos...]
├─ Inténto en tiempo real
├─ Busca en nombre y descripción
└─ Click [X] para limpiar

FILTRO POR CATEGORÍA
├─ Dropdown: [Todas ▼]
├─ Selecciona una categoría
├─ Muestra solo productos esa categoría
└─ Combo con búsqueda

FILTRO POR STOCK
├─ [Todos ▼]
├─ Opciones:
│  ├─ En stock
│  ├─ Stock bajo (< 5)
│  └─ Sin stock (= 0)
└─ Útil para alertas de reorden

ORDEN DE LISTADO
├─ [Más nuevo ▼]
├─ Opciones:
│  ├─ Más nuevo
│  ├─ Más antiguo
│  ├─ Precio: menor
│  ├─ Precio: mayor
│  ├─ Stock: mayor
│  └─ Más vendido
```

---

## Gestión de Órdenes

### Acceder a Órdenes

```
En Sidebar: clic en "Órdenes" → Se abre Gestión de Órdenes
```

### Vista de Lista de Órdenes

```
┌──────────────────────────────────────────────────────┐
│ ÓRDENES                                             │
├──────────────────────────────────────────────────────┤
│ Estado: [Todas ▼] Sortear: [Más reciente ▼]         │
│ Buscar por: [Número orden / Email cliente]          │
├──────────────────────────────────────────────────────┤
│ # Orden │ Cliente │ Estado │ Fecha │ Total │ Acción│
├─────────┼─────────┼────────┼──────┼───────┼──────┤
│ ORD-001 │ Juan    │ 🟡 PROC│2/18  │ $70   │ ✎ 👁  │
│ ORD-002 │ María   │ 🟢 SHIP│2/17  │ $150  │ ✎ 👁  │
│ ORD-003 │ Carlos  │ 🔴 PEND│2/18  │ $45   │ ✎ 👁  │
│ ORD-004 │ Ana     │ 🟦 DELI│2/15  │ $200  │ ✎ 👁  │
│ ORD-005 │ Luis    │ ⚪ CANC│2/10  │ $80   │  👁   │
└─────────┴─────────┴────────┴──────┴───────┴────── ┘
```

**Estados Visuales:**

- 🔴 PENDING (Pendiente) - Rojo
- 🟡 PROCESSING (Procesando) - Amarillo
- 🟢 SHIPPED (Enviada) - Verde
- 🟦 DELIVERED (Entregada) - Azul
- ⚪ CANCELLED (Cancelada) - Gris

### Ver Detalles de Orden

```
1. Haz clic en ícono [👁 Ver] o número de orden
2. Se abre vista detallada:

┌───────────────────────────────────────────────┐
│ ORDEN #ORD-001                                │
├───────────────────────────────────────────────┤
│                                               │
│ INFORMACIÓN GENERAL                           │
│ Estado: 🟡 PROCESSING  [Cambiar ▼]          │
│ Fecha creación: 18 Feb 2025 10:30 AM        │
│ Última actualización: 18 Feb 2025 11:15 AM │
│                                               │
│ CLIENTE                                       │
│ Nombre: Juan Pérez                           │
│ Email: juan@email.com                        │
│ Teléfono: +34 612 345 678                   │
│                                               │
│ DIRECCIÓN DE ENVÍO                           │
│ Villa del Mar 123, Apt 4B                    │
│ Madrid, España 28001                         │
│                                               │
│ PRODUCTOS                                     │
│ 1. Laptop HP                    x1: $599.00  │
│ 2. Mouse Logitech               x2: $ 58.00 │
│                                               │
│ TOTALES                                       │
│ Subtotal:........................ $657.00   │
│ Envío:........................... $ 15.00   │
│ Impuesto:........................ $ 98.56   │
│ TOTAL:........................... $770.56   │
│                                               │
│ HISTORIAL                                     │
│ 2/18 10:30 - Orden creada por cliente        │
│ 2/18 10:45 - Cambio a PROCESSING por admin   │
│ 2/18 11:15 - Confirmado envío                │
│                                               │
│ [CAMBIAR ESTADO] [ENVIAR EMAIL] [VOLVER]   │
│                                               │
└───────────────────────────────────────────────┘
```

### Cambiar Estado de Orden

```
1. En detalles de orden, haz clic [CAMBIAR ESTADO]
2. Dropdown muestra estados válidos:

Desde PENDING puedes cambiar a:
└─ PROCESSING (orden confirmada)
└─ CANCELLED (cliente canceló)

Desde PROCESSING puedes cambiar a:
└─ SHIPPED (enviada a repartidor)
└─ CANCELLED

Desde SHIPPED puedes cambiar a:
└─ DELIVERED (entregada)
└─ PROCESSING (regresó por error)

Desde DELIVERED: no cambio automático
         (solo admin puede forzar)

Desde CANCELLED: no cambio
```

**Pasos para cambiar:**

```
1. Haz clic en [CAMBIAR ESTADO]
2. Selecciona nuevo estado del dropdown
3. Agrega nota (opcional): "motivo del cambio"
4. Haz clic en [CONFIRMAR]
5. Sistema registra cambio con timestamp
6. Se envía email automático al cliente
```

### Enviar Email al Cliente

```
1. En detalles de orden, haz clic [ENVIAR EMAIL]
2. Abre redactor:

   Asunto: [______________________________]

   Plantillas disponibles:
   [Confirmación] [Enviado] [Entregado]
   [Retraso] [Personalizado]

   Cuerpo:
   [_________________________________]
   [_________________________________]

   CC: [__________________]

   [ENVIAR] [CANCELAR]

3. Email se envía a cliente
4. Se registra en historial
```

### Buscar Órdenes

```
BÚSQUEDA
├─ Por número: ORD-001
├─ Por email: juan@email.com
├─ Por nombre cliente: Juan
└─ Inténto parcial OK

FILTRO POR ESTADO
├─ [Todas ▼]
├─ Opciones:
│  ├─ Pendientes
│  ├─ En procesamiento
│  ├─ Enviadas
│  ├─ Entregadas
│  └─ Canceladas
└─ Múltiples selecciones permitidas

ORDENAMIENTO
├─ Más reciente (default)
├─ Más antigua
├─ Mayor total
├─ Menor total
└─ Cliente A-Z
```

---

## Gestión de Usuarios

### Acceder a Usuarios

```
En Sidebar: clic en "Usuarios" → Se abre Gestión de Usuarios
```

### Vista de Lista de Usuarios

```
┌───────────────────────────────────────────────────┐
│ USUARIOS                                          │
├───────────────────────────────────────────────────┤
│ Rol: [Todos ▼]  Buscar: [___________]            │
│ Orden: [Más reciente ▼]                           │
├───────────────────────────────────────────────────┤
│ID│ Nombre │ Email │ Teléfono│ Rol    │ Acción   │
├──┼────────┼───────┼─────────┼────────┼─────── │
│1 │ Juan   │ j@... │ +34...  │ CLIENTE│ ✎ 🗑    │
│2 │ María  │ m@... │ +34...  │ CLIENTE│ ✎ 🗑    │
│3 │ Admin1 │ a@... │ +34...  │ ADMIN  │ ✎ 🗑    │
│4 │ Carlos │ c@... │ +34...  │ CLIENTE│ ✎ 🗑    │
└──┴────────┴───────┴─────────┴────────┴────── ┘
```

### Ver/Editar Perfil Usuario

```
1. Haz clic en ícono [✎ Editar] o nombre usuario
2. Se abre perfil:

┌─────────────────────────────────────────┐
│ EDITAR USUARIO: Juan Pérez             │
├─────────────────────────────────────────┤
│                                         │
│ INFORMACIÓN PERSONAL                   │
│ Nombre:      [Juan Pérez_________]     │
│ Email:       [juan@email.com_____]     │
│ Teléfono:    [+34 612 345 678___]     │
│                                         │
│ SEGURIDAD Y ROL                        │
│ Rol:         [CLIENTE ▼]              │
│              [□ Cambiar a ADMIN]      │
│                                         │
│ Última actividad: 2/18 2025 3:45 PM   │
│ Cuenta creada: 1/15 2025               │
│                                         │
│ ESTADÍSTICAS                            │
│ Total órdenes: 5                       │
│ Gasto total: $350.50                   │
│ Órdenes entregadas: 4                  │
│                                         │
│ [GUARDAR CAMBIOS] [CAMBIAR CONTRASEÑA]│
│ [RESETEAR CUENTA] [VOLVER]            │
│                                         │
└─────────────────────────────────────────┘
```

### Cambiar Rol de Usuario

```
1. En perfil del usuario, busca sección "Rol"
2. Actual: [CLIENTE ▼]
3. Haz clic en dropdown
4. Opciones:
   ├─ CLIENTE (usuario normal)
   └─ ADMIN (acceso completo panel)
5. Confirma cambio
6. Usuario obtiene acceso según novo rol

⚠️ IMPORTANTE:
- Cuidado al promover a ADMIN
- Pueden modificar productos, órdenes, usuarios
- Registra quién hizo cambios de rol
```

### Eliminar Usuario

```
1. Haz clic en ícono [🗑 Eliminar]
2. Confirmación: "¿Eliminar usuario?"
3. Advertencia:
   ├─ Se eliminarán datos personales
   ├─ Se conservarán órdenes históricas
   ├─ No se puede deshacer
   └─ Confirmas con: [SÍ, ELIMINAR]
4. Usuario se elimina del sistema
```

### Filtrado y Búsqueda de Usuarios

```
BÚSQUEDA
├─ Por nombre: Juan
├─ Por email: juan@
├─ Búsqueda parcial OK
└─ Real-time

FILTRO POR ROL
├─ [Todos ▼]
├─ Opciones:
│  ├─ ADMIN
│  └─ CLIENTE
└─ Muestra solo ese rol

ORDEN
├─ Más reciente (default)
├─ Más antiguo
├─ Nombre A-Z
├─ Nombre Z-A
└─ Más órdenes
```

---

## Gestión de Categorías

### Acceder a Categorías

```
En Sidebar: clic en "Categorías" → Se abre Gestión de Categorías
```

### Vista de Categorías

```
┌──────────────────────────────────────────────┐
│ CATEGORÍAS                   [+ NUEVA CATEG] │
├──────────────────────────────────────────────┤
│                                              │
│ [📱] Electrónica         234 productos       │
│      Dispositivos y accesorios electrónicos  │
│      [✎ Editar] [🗑 Eliminar]                │
│                                              │
│ [👕] Ropa               156 productos       │
│      Prendas de vestir para hombre y mujer  │
│      [✎ Editar] [🗑 Eliminar]                │
│                                              │
│ [🏠] Hogar              89 productos        │
│      Artículos para decoración y limpieza   │
│      [✎ Editar] [🗑 Eliminar]                │
│                                              │
│ [⚽] Deportes            45 productos       │
│      Equipos y accesorios deportivos         │
│      [✎ Editar] [🗑 Eliminar]                │
│                                              │
└──────────────────────────────────────────────┘
```

### Crear Nueva Categoría

```
1. Haz clic en [+ NUEVA CATEGORÍA]
2. Formulario:

┌─────────────────────────────────────────┐
│ CREAR NUEVA CATEGORÍA                  │
├─────────────────────────────────────────┤
│                                         │
│ Nombre:       [________________]       │
│               Min 3 caracteres         │
│                                         │
│ Descripción:  [________      ]         │
│               Max 200 caracteres       │
│                                         │
│ Ícono:        [📦]  [Seleccionar]      │
│               Visual para tienda       │
│                                         │
│         [GUARDAR] [CANCELAR]           │
│                                         │
└─────────────────────────────────────────┘
```

**Campos:**

- ✅ Nombre (3-50 caracteres, único)
- ✅ Descripción (opcional, 0-200)
- ✅ Ícono (seleccionar de lista)

### Editar Categoría

```
1. Haz clic en [✎ Editar]
2. Modifica campos
3. Haz clic en [GUARDAR]
4. Cambios aplican a todos productos en categoría
```

### Eliminar Categoría

```
⚠️ RESTRICCIONES:
├─ Solo si NO tiene productos
├─ Si tiene productos, primero:
│  └─ Reasigna a otra categoría
│  └─ O elimina productos
└─ Entonces elimina categoría

PASOS:
1. Si tiene productos, no se puede eliminar
2. Mensaje: "Esta categoría tiene 234 productos"
3. Reasigna primero:
   └─ Bulk edit: "Mover a categoría..."
   └─ O edita cada producto
4. Una vez vacía, entonces elimina
5. [SÍ, ELIMINAR]
```

---

## Reportes y Análisis

### Acceder a Reportes

```
En Sidebar: clic en "Reportes" → Se abre Reportes
```

### Dashboard de Reportes

```
┌──────────────────────────────────────────────────┐
│ REPORTES Y ANÁLISIS                             │
├──────────────────────────────────────────────────┤
│ Período: [Feb 2025 ▼]  [Exportar] [Imprimir]   │
├──────────────────────────────────────────────────┤
│                                                  │
│ VENTAS                                           │
│ Período: Feb 1-18, 2025                         │
│ Total: $25,500.00                               │
│ Promedio diario: $1,417                         │
│ Mejor día: Feb 15 ($2,300)                      │
│ Peor día: Feb 2 ($450)                          │
│                                                  │
│ [Gráfico de línea - 18 días]                   │
│                                                  │
│ TOP 5 PRODUCTOS MÁS VENDIDOS                    │
│ 1. Laptop HP ................. 23 unidades      │
│ 2. Mouse Logitech ............. 56 unidades      │
│ 3. Teclado Mecánico ........... 34 unidades      │
│ 4. Monitor 27" ................ 12 unidades      │
│ 5. Cable USB-C ................. 89 unidades     │
│                                                  │
│ ÓRDENES                                          │
│ Total: 145 órdenes                              │
│ Completadas: 132 (91%)                          │
│ Canceladas: 8 (5.5%)                            │
│ Pendientes: 5 (3.5%)                            │
│                                                  │
│ [Gráfico de barras]                             │
│                                                  │
│ CLIENTES                                         │
│ Nuevos: 34 clientes                             │
│ Retorno: 45 clientes (31% de órdenes)           │
│ Valor promedio orden: $175.86                   │
│                                                  │
│ CATEGORÍAS                                       │
│ Electrónica: $12,500 (49%)                      │
│ Ropa: $8,200 (32%)                              │
│ Hogar: $4,800 (19%)                             │
│                                                  │
│ [Gráfico de pie]                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Generar Reportes Personalizados

```
1. Selecciona período: [Enero 2025 ▼]
2. Elige reporte:
   ├─ Ventas por período
   ├─ Productos más vendidos
   ├─ Clientes más activos
   ├─ Órdenes por estado
   ├─ Ingresos por categoría
   └─ Rentabilidad
3. Haz clic en [GENERAR REPORTE]
4. Se muestra gráfico y tabla
5. Opciones de exportación:
   ├─ [PDF]
   ├─ [Excel]
   └─ [CSV]
```

### Exportar Datos

```
FORMATO PDF
├─ Incluye gráficos
├─ Listo para imprimir
└─ Perfecto para presentaciones

FORMATO EXCEL
├─ Datos en tablas
├─ Permite manipular
├─ Fórmulas disponibles

FORMATO CSV
├─ Compatible con cualquier software
├─ Para análisis avanzado
└─ Importar en base de datos
```

---

## Configuración de Sistema

### Acceder a Configuración

```
En Sidebar: clic en "Configuración" → Se abre Ajustes
```

### Configuración General

```
┌────────────────────────────────────────┐
│ CONFIGURACIÓN SISTEMA                  │
├────────────────────────────────────────┤
│                                        │
│ INFORMACIÓN TIENDA                    │
│ Nombre tienda: [Mi Tienda E-commerce] │
│ Email soporte: [soporte@tienda.com]   │
│ Teléfono: [+34 123 456 789]          │
│                                        │
│ DIRECCIÓN                              │
│ Calle: [________________]              │
│ Ciudad: [________________]              │
│ País: [España       ▼]                │
│                                        │
│ HORARIO ATENCIÓN                       │
│ Lunes-Viernes: [09:00] - [18:00]      │
│ Sábado: [10:00] - [14:00]             │
│ Domingo: [CERRADO]                    │
│                                        │
│ CONFIGURACIÓN DE ÓRDENES               │
│ □ Requerir confirmación manual email  │
│ □ Enviar notificación estado cambio   │
│ Stock mínimo para alerta: [5]         │
│ Días para cancelación automática: [3] │
│                                        │
│ CONFIGURACIÓN DE ENVÍOS                │
│ Costo envío standar: [$5.00]          │
│ Costo envío express: [$15.00]         │
│ Tiempo entrega: [2-3] días            │
│                                        │
│          [GUARDAR]                    │
│                                        │
└────────────────────────────────────────┘
```

### Administración de Cuenta Admin

```
CAMBIAR CONTRASEÑA
├─ Contraseña actual: [______]
├─ Contraseña nueva: [______]
├─ Confirmar: [______]
├─ Requisitos:
│  ├─ 8+ caracteres
│  ├─ Mayúsculas
│  ├─ Números
│  └─ Caracteres especiales
└─ [CAMBIAR]

AUTENTICACIÓN 2FA
├─ Estado: [□ Deshabilitado]
├─ [HABILITAR 2FA]
├─ Mejora seguridad:
│  ├─ Email
│  ├─ Aplicación (Google Authenticator)
│  └─ SMS
└─ [CONFIGURAR]

SESIONES ACTIVAS
├─ Navegador Chrome: hace 5 min
├─ Safari: hace 2 horas
├─ [CERRAR SESIÓN]
├─ Cierra sesiones remotas
└─ Mejora seguridad
```

---

## Mejores Prácticas

### 📋 Checklist Diario

```
☐ Revisar Dashboard
  └─ Órdenes pendientes
  └─ Stock en alerta
  └─ Nuevos usuarios

☐ Procesar Órdenes
  └─ Cambiar estado PROCESSING
  └─ Confirmar disponibilidad stock
  └─ Notificar al cliente

☐ Revisar Stock
  └─ Alert: stock bajo (<5)
  └─ Alert: sin stock (=0)
  └─ Hacer reorden si es necesario

☐ Gestión de Productos
  └─ Revisar descripciones
  └─ Actualizar fotos si es necesario
  └─ Verificar precios correctos

☐ Revisar Mensajes
  └─ Email de clientes
  └─ Solicitudes de soporte
  └─ Responder en <24h
```

### 🔒 Seguridad

```
✅ BUEN PROCEDIMIENTO
├─ Contraseña fuerte y única
├─ Cambiar cada 30 días
├─ Usar 2FA siempre
├─ Cierra sesión al salir
├─ No compartas credenciales
└─ Reporta accesos sospechosos

❌ NUNCA HAGAS
├─ Dejar sesión abierta
├─ Usar contraseña simple
├─ Compartir credenciales
├─ Acceso desde WiFi público
├─ Clickear links sospechosos
└─ Descuidar notificaciones seguridad
```

### 📊 Análisis Regular

```
SEMANAL
├─ Revisar ventas totales
├─ Top 5 productos vendidos
├─ Órdenes completadas vs canceladas
└─ Nuevos clientes

MENSUAL
├─ Análisis de tendencias
├─ ROI por promoción
├─ Satisfacción cliente
├─ Rentabilidad por categoría
└─ Comparación vs mes anterior

TRIMESTRALMENTE
├─ Plan estratégico
├─ Análisis competencia
├─ Mejoras necesarias
└─ Objetivos próximos
```

### 💡 Optimización

```
INVENTARIO
├─ Mantén stock óptimo
├─ Evita sobrestock
├─ Evita quiebre stock
├─ Monitorea rotación
└─ Realiza reorden a tiempo

PRECIOS
├─ Revisa competencia
├─ Ajusta según demanda
├─ Considera promotions
├─ Maximiza margen
└─ Comunica cambios

PRODUCTOS
├─ Mejora descripciones
├─ Fotos de calidad
├─ Especificaciones claras
├─ Reseñas/ratings
└─ SEO optimizado
```

---

## 📞 Soporte para Administradores

**Si necesitas ayuda:**

- 📧 Email: admin-support@tienda.com
- 📞 Teléfono: +34 987 654 321
- 💬 Chat admin: En panel (lunes-viernes)
- 📚 Documentación: [ARQUITECTURA_FUNCIONALIDAD.md](ARQUITECTURA_FUNCIONALIDAD.md)

---

## ✅ Resumen de Responsabilidades

| Tarea                  | Frecuencia      | Responsable      |
| ---------------------- | --------------- | ---------------- |
| Revisar órdenes nuevas | Diaria          | Cualquier Admin  |
| Procesar envíos        | Diaria          | Almacén/LogIs    |
| Actualizar stock       | Según necesidad | Almacén          |
| Agregar productos      | Según necesidad | Producto Manager |
| Generar reportes       | Semanal/Mensual | Gerencia         |
| Backups BD             | Diaria          | Tech             |
| Monitoreo seguridad    | Real-time       | Tech             |

---

**¡Bienvenido al equipo administrativo!**

Para preguntas, contacta soporte o revisa ARQUITECTURA_FUNCIONALIDAD.md
