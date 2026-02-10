# 🔧 Solución del Error 404 en POST /api/v1/orders

## Resumen del Problema
```
POST http://localhost:3000/api/v1/orders 404 (Not Found)
```

El servidor devuelve 404 cuando intentas procesar un pedido desde el carrito.

---

## ✅ Cambios Realizados

### 1. **API URL Base Corregida** ✓
- **Archivo**: `frontend/src/services/api.ts`  
- **Cambio**: `http://localhost:3000/api/v1` (corregido de `/api`)
- **Impacto**: Todos los llamados del frontend React ahora usan la URL correcta

### 2. **Debug Mejorado** ✓
- Script de diagnósticos agregado: `public/test-diagnostics.js`
- Logs mejorados en `public/js/app.js` (líneas 274+)
- Logs mejorados en `public/js/auth.js` (login exitoso)

---

## 🔍 Cómo Diagnosticar el Problema

### Paso 1: Abre la Aplicación
1. Asegúrate que el Backend esté corriendo: `npm run start:dev` en `/backend`
2. Accede a: `http://localhost/public/html/index.html` (o tu URL local)

### Paso 2: Inicia Sesión
1. Haz clic en "Iniciar Sesión"
2. Usa credenciales de un cliente (rol: CLIENTE)
3. En la consola del navegador (F12), deberías ver:
   ```
   ✅ Login cliente exitoso
   Token: eyJhbGciOiJIUzI1N...
   Usuario: { id: "...", nombre: "...", email: "...", access_token: "..." }
   ```

### Paso 3: Prueba el Carrito y Checkout
1. Agrega

 un producto al carrito
2. Abre la consola (F12 → Pestaña Console)
3. Copia y pega el contenido de `public/test-diagnostics.js`
4. Presiona Enter
5. **Lee los logs completamente** - mostrarán:
   - ✅ Conexión al backend
   - ✅ Datos del usuario y token
   - ✅ Órdenes existentes
   - ✅ Resultado del intento de crear orden

### Paso 4: Intenta Checkout
1. Haz clic en "Finalizar Pedido"
2. **Abre la Consola del Navegador (F12)**
3. Deberías ver logs como:
   ```
   📤 Enviando orden al backend...
   URL: http://localhost:3000/api/v1/orders
   Token presente: true
   Items: [...]
   
   📥 Respuesta del servidor:
   Status: 201 Created  (o el error si hay)
   ```

---

## 🛠️ Solución de Problemas

### Si ves: "Status: 404"
**Causas posibles:**
1. ❌ Backend no está corriendo → Ejecuta `npm run start:dev` en `/backend`
2. ❌ Middleware no registra rutas correctamente → Verifica `backend/src/main.ts`
3. ❌ Módulo Orders no está importado → Verifica `backend/src/app.module.ts`

**Solución:**
```bash
# En Windows PowerShell
cd backend
npm install
npm run prisma:migrate:dev  #(ejecuta migraciones)
npm run start:dev           # Inicia backend
```

### Si ves: "Status: 401" 
**Causa:** Token JWT inválido o expirado
**Solución:**
1. Cierra sesión
2. Limpia localStorage: En console escribe: `localStorage.clear()`
3. Inicia sesión nuevamente
4. Vuelve a intentar checkout

### Si ves: "Status: 400"
**Causa:** Datos del pedido mal formados
**Solución:**
En console, ejecuta:
```javascript
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
console.log('Carrito:', carrito);
console.log('Formato esperado:', carrito.map(item => ({
  productoId: String(item.id),
  cantidad: item.cantidad,
  precioUnitario: item.precio
})));
```

### Si ves: "Error de red /conexión rechazada"
**Causa:** Backend no está escuchando en puerto 3000
**Solución:**
```bash
# Verifica el puerto
netstat -ano | findstr :3000  # PowerShell

# O inicia el backend correctamente
cd backend && npm run start:dev
```

---

## 📋 Checklist de Confirmación

Antes de reportar que funciona, verifica:

- [ ] Accedes a `http://localhost/public/html/index.html`
- [ ] Puedes iniciar sesión con cuenta cliente
- [ ] Console muestra "✅ Login cliente exitoso"
- [ ] Ejecutar `test-diagnostics.js` muestra "✅ Backend está en línea"
- [ ] El carrito tiene al menos 1 producto
- [ ] Console muestra "📤 Enviando orden al backend..." sin errores
- [ ] La respuesta es "Status: 201 Created" (éxito)
- [ ] Se genera la confirmación de pedido

---

## 📊 Información Técnica

### Rutas del API Configuradas:

| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| `/api/v1/auth/login` | POST | No | Iniciar sesión |
| `/api/v1/auth/register` | POST | No | Registrarse |
| `/api/v1/orders` | GET | JWT | Obtener mis órdenes |
| `/api/v1/orders` | POST | JWT | Crear orden |
| `/api/v1/products` | GET | No | Listar productos |
| `/api/v1/orders/test/ping` | GET | No | Test de conexión |

### Estructura del Pedido Esperada (POST):
```json
{
  "items": [
    {
      "productoId": "123",
      "cantidad": 2,
      "precioUnitario": 45000
    }
  ],
  "notasEntrega": "Entregar en el segundo piso"  // Opcional
}
```

### Respuesta Exitosa (201):
```json
{
  "id": "order-123",
  "usuarioId": "user-456",
  "estado": "PENDIENTE",
  "total": 90000,
  "items": [...],
  "createdAt": "2026-02-09T..."
}
```

---

## 🚀 Próximos Pasos

1. Ejecuta los diagnósticos arriba
2. Comparte los logs de la consola del navegador
3. Si ves "Status: 404", verifica:
   - Backend está corriendo: `netstat -ano | findstr :3000`
   - Migraciones están aplicadas: `npm run prisma:migrate:dev`
   - Módulos están importados en app.module.ts

---

## 📞 Información de Debug

Para más detalles, abre DevTools (F12) y ejecuta:

```javascript
// Ver usuario actual
console.log(JSON.parse(localStorage.getItem('usuario')));

// Ver carrito
console.log(JSON.parse(localStorage.getItem('carrito')));

// Probar conexión al backend
fetch('http://localhost:3000/api/v1/orders/test/ping')
  .then(r => r.json())
  .then(d => console.log('Backend responde:', d));
```

---

**Estado Actual**: ✅ API URL corregida, ⏳ Esperando diagnósticos del usuario
