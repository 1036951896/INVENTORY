# 📱 Guía para Acceder desde el Celular

**Fecha:** 6 de marzo de 2026

---

## 🎯 Problema Actual

El **backend está funcionando** ✅ pero cuando intentas acceder desde el celular te da error porque:

- El frontend en tu PC apunta a `localhost:3000`
- Tu celular NO puede ver el `localhost` de tu PC
- Necesitas el **frontend deployado en Render**

---

## ✅ Solución: Crear el Frontend en Render

### Paso 1: Hacer Push de los Cambios

Los archivos `.env.production` y `.env.development` ya están creados. Ahora súbelos a GitHub:

```bash
git add frontend/.env.production frontend/.env.development
git commit -m "feat: agregar configuracion de entorno para produccion"
git push origin main
```

### Paso 2: Crear Servicio de Frontend en Render

**Ve a:** https://dashboard.render.com

1. **Click en "New +"** → **"Web Service"**

2. **Conectar Repositorio:**
   - Repository: `https://github.com/1036951896/INVENTORY`
   - Click "Connect"

3. **Configurar el Servicio:**

   ```
   Name: inventory-frontend
   Region: Ohio (US East)
   Branch: main
   Root Directory: frontend
   Runtime: Node
   Build Command: npm install --legacy-peer-deps && npm run build
   Start Command: npm start
   ```

4. **Plan:**
   - Seleccionar: **"Free"** (0$/mes)

5. **Variables de Entorno:**

   Click en "Advanced" → "Add Environment Variable"

   ```
   VITE_API_URL=https://inventory-api-74yl.onrender.com
   NODE_ENV=production
   ```

6. **Crear Servicio:**
   - Click **"Create Web Service"**
   - Esperar 2-3 minutos mientras se deploya

### Paso 3: Obtener la URL del Frontend

Una vez deployado, Render te dará una URL como:

```
https://inventory-frontend-XXXX.onrender.com
```

**Esta es la URL que usarás desde tu celular** 📱

---

## 📱 Cómo Acceder desde el Celular

### Una Vez Creado el Frontend en Render:

1. **En tu celular**, abre el navegador
2. **Ir a:** `https://inventory-frontend-XXXX.onrender.com`  
   (Reemplaza XXXX con tu URL de Render)
3. **Esperar 30-60 segundos** la primera vez (el servicio está despertando)
4. **Iniciar sesión:**
   ```
   Email: admin@inventory.com
   Password: admin123
   ```
5. **Esperar otros 30 segundos** (el backend también está despertando)
6. ✅ **Listo!** Ahora puedes usar la app desde tu celular

---

## 🔧 Solución Temporal: Acceder al Backend Directamente

**Mientras creas el frontend en Render**, puedes probar el backend desde tu celular:

### Opción A: Probar el Health Endpoint

En el navegador de tu celular:

```
https://inventory-api-74yl.onrender.com/api/v1/health
```

Deberías ver:

```json
{
  "estado": "ok",
  "marca de tiempo": "2026-03-06T...",
  "tiempo de actividad": 176.156027721
}
```

### Opción B: Probar Login con cURL (si tienes app de terminal)

```bash
curl -X POST https://inventory-api-74yl.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inventory.com","password":"admin123"}'
```

---

## 🚀 Script Rápido para Deploy

He creado un script que hace todo automáticamente. Ejecútalo:

**En tu PC:**

```powershell
.\deploy-frontend-render.ps1
```

Esto hará:

1. ✅ Add y commit de los archivos .env
2. ✅ Push a GitHub
3. 📋 Te dará las instrucciones paso a paso para crear el servicio en Render

---

## 💡 Alternativa: Acceder Localmente desde el Celular (Red Local)

**Si tu celular y PC están en la misma WiFi:**

### Paso 1: Obtener la IP de tu PC

En tu PC, abre PowerShell:

```powershell
ipconfig
```

Busca algo como:

```
IPv4 Address: 192.168.1.XXX
```

### Paso 2: Iniciar el Frontend con Host 0.0.0.0

```powershell
cd frontend
npm run dev -- --host 0.0.0.0
```

### Paso 3: Acceder desde el Celular

En el navegador de tu celular:

```
http://192.168.1.XXX:5173
```

**PROBLEMA:** Seguirá intentando conectar a `localhost:3000` para el backend. Necesitas también ejecutar el backend con tu IP.

**No lo recomiendo - mejor usa Render** ✅

---

## ⚠️ Recordatorio: Plan Gratuito de Render

Con el plan gratuito:

- ⏱️ **Primera carga:** 30-60 segundos (cold start)
- 😴 **Se suspende:** Después de 15 min sin actividad
- 🔄 **Solución:** Usar cron-job.org para mantenerlo despierto

**Ver:** [RENDER_PLAN_GRATUITO.md](RENDER_PLAN_GRATUITO.md)

---

## 📊 Checklist Completo

- [x] Backend deployado y funcionando en Render
- [ ] Hacer push de archivos .env a GitHub
- [ ] Crear servicio de frontend en Render
- [ ] Obtener URL del frontend
- [ ] Probar acceso desde celular
- [ ] (Opcional) Configurar cron-job para keep-alive

---

## 🆘 Si Sigue Sin Funcionar

### Error 1: "Cannot connect to server"

**Causa:** El servicio está dormido  
**Solución:** Esperar 60 segundos

### Error 2: "CORS Error"

**Causa:** El backend no permite tu origen  
**Solución:** Verificar que la URL del frontend esté en CORS_ORIGIN

### Error 3: "404 Not Found"

**Causa:** El frontend no está deployado  
**Solución:** Crear el servicio de frontend en Render primero

---

## 📚 Documentos Relacionados

- [SOLUCION_RENDER.md](SOLUCION_RENDER.md) - Guía completa de deployment
- [RENDER_PLAN_GRATUITO.md](RENDER_PLAN_GRATUITO.md) - Limitaciones del plan gratuito
- [MANUAL_TECNICO_SOFTWARE.md](MANUAL_TECNICO_SOFTWARE.md) - Manual técnico completo

---

**Próximo Paso:** Crear el servicio de frontend en Render siguiendo el Paso 2 arriba ⬆️
