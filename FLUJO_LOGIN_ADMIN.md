# ✅ Flujo Completo de Login Admin

## 🔐 Paso 1: Pantalla de Login

**URL:** `http://localhost:5173/login`

### Credenciales Admin:

```
Email:    admin@inventory.com
Password: admin123
```

### Lo que deberías ver:

- Lado izquierdo: Logo StoreHub + "Gestiona pedidos sin complicaciones"
- Lado derecho: Formulario blanco con campos de entrada
- Botón "Entrar" verde

### Acciones:

1. ✏️ Ingresa: `admin@inventory.com`
2. ✏️ Ingresa: `admin123`
3. 🔘 Click en "Entrar"
4. ⏳ Espera 1.5 segundos

---

## 🎯 Paso 2: Redirección Automática

**Lo que ocurre después del login exitoso:**

```javascript
// Backend devuelve:
{
  "access_token": "eyJhbGciOiJs...",
  "user": {
    "id": "cmmftnazu00006ezwmhhwq0wr",
    "nombre": "Administrador",
    "email": "admin@inventory.com",
    "rol": "ADMIN"  // ← Key para el redirect
  }
}

// Frontend verifica:
if (data.user.rol === 'ADMIN') {
  navigate('/admin');  // ✅ Redirige aquí
}
```

### ✅ Notificación esperada:

```
👋 Bienvenido, Administrador!
```

---

## 📊 Paso 3: Admin Dashboard

**URL:** `http://localhost:5173/admin` ← Deberías llegar aquí automáticamente

### Layout esperado:

```
┌─────────────────────────────────────────────────────┐
│ ☰                          Administrador  [Avatar]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📦 StoreHub Admin  │  ┌──────────────────────────┐ │
│  ─────────────────  │  │ Gestión de Pedidos       │ │
│  📊 Dashboard       │  │                          │ │
│  📋 Pedidos         │  │ ┌──────────────────────┐ │ │
│  🛍️  Productos      │  │ │ 📊 Total Pedidos     │ │ │
│  📂 Categorías      │  │ │    3                 │ │ │
│  👥 Usuarios        │  │ └──────────────────────┘ │ │
│  ─────────────────  │  │                          │ │
│  🚪 Salir           │  │ ┌──────────────────────┐ │ │
│                     │  │ │ 💰 Ingresos Totales  │ │ │
│ Bienvenido:         │  │ │ $1,245,320           │ │ │
│ 👤 Administrador    │  │ └──────────────────────┘ │ │
│                     │  │                          │ │
│                     │  └──────────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Elementos visibles:

- ✅ Sidebar con navegación
- ✅ Avatar en esquina superior derecha
- ✅ 4 tarjetas de estadísticas con colores
- ✅ Números activos (órdenes, productos, ingresos, pendientes)

---

## 🧪 Test Automatizado

Si quieres verificar que todo funciona correctamente, ejecuta:

```bash
# En la carpeta del proyecto
python test-admin-flow.py
```

### Verificación del flujo:

```python
import requests
import time

print("🔐 Test 1: Login como Admin")
resp = requests.post('http://localhost:3000/api/v1/auth/login',
    json={'email': 'admin@inventory.com', 'password': 'admin123'})

if resp.status_code == 201:
    data = resp.json()
    print(f"✅ Login exitoso")
    print(f"   - Nombre: {data['user']['nombre']}")
    print(f"   - Rol: {data['user']['rol']}")
    print(f"   - Email: {data['user']['email']}")

    # Verificar que rol es "ADMIN" (mayúsculas)
    if data['user']['rol'] == 'ADMIN':
        print("✅ Rol es correctamente 'ADMIN'")
    else:
        print(f"❌ Rol es '{data['user']['rol']}' (esperaba 'ADMIN')")
else:
    print(f"❌ Login fallido: {resp.status_code}")
```

---

## 🔍 Solución de problemas

### Si no redirige a `/admin`:

1. ✅ Verifica que `admin@inventory.com` exista en la BD
2. ✅ Verifica que su `rol` en la BD sea `'ADMIN'`
3. ✅ Abre DevTools (F12) → Console → Revisa localStorage
   - `localStorage.getItem('admin-usuario')`
   - Debería tener `"rol":"ADMIN"`

### Si dice "Acceso denegado":

- El rol no es 'ADMIN' → ✏️ Edita la BD
- El localStorage no tiene el usuario → Recarga la página

### Si no ve el sidebar:

- Browser cache → Limpia con Ctrl+Shift+Del
- CSS no cargó → Espera a que Vite recompile (mira la terminal)

---

## 📋 Checklist de Verificación

- [ ] Login con admin@inventory.com / admin123 exitoso
- [ ] Notificación "👋 Bienvenido, Administrador!" aparece
- [ ] Redirecciona a `http://localhost:5173/admin` (¡NO ecommerce!)
- [ ] Sidebar visible con 5 opciones
- [ ] Avatar con inicial "A" aparece
- [ ] 4 tarjetas de estadísticas cargadas
- [ ] Números correctos (3 pedidos, 64 productos, etc)
- [ ] Click en "Pedidos" muestra tabla con filtros
- [ ] Click en "Productos" muestra grid con filtros
- [ ] Click en "Usuarios" muestra tabla con filtros
- [ ] Click en "Salir" redirige a /login

---

## 🚀 Próximos pasos:

1. ✅ Login como admin → /admin ✓
2. ⏭️ Explorar cada sección con filtros
3. ⏭️ Probar exportar a CSV
4. ⏭️ Cambiar estados de órdenes
5. ⏭️ Crear/Editar categorías
