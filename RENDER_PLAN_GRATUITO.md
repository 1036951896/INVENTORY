# ⚠️ Plan Gratuito de Render - Limitaciones y Soluciones

**Fecha:** 6 de marzo de 2026  
**Plan Actual:** Gratis (512MB RAM, 0.1CPU)

---

## 🔍 Problema Principal: "Backend Caído"

### ✅ **NO está realmente caído - está DORMIDO**

El plan gratuito de Render **suspende automáticamente** los servicios después de **15 minutos de inactividad**. Esto es normal y esperado.

### Síntomas:

- ❌ Al intentar login, parece que el backend no responde
- ⏱️ La primera solicitud tarda **30-60 segundos** en responder
- 🔄 Después de eso, funciona normal por 15 minutos
- 😴 Si no hay actividad por 15 min, vuelve a dormirse

---

## 🚀 Solución: "Despertar" el Backend

### Opción 1: Esperar Pacientemente (RECOMENDADO)

1. **Ir a tu frontend:** https://inventory-frontend-a8da.onrender.com
2. **Intentar iniciar sesión** con:
   ```
   Email: admin@inventory.com
   Password: admin123
   ```
3. **ESPERAR 30-60 SEGUNDOS** sin cerrar ni refrescar
4. ✅ El backend despertará y la sesión iniciará

### Opción 2: Despertar Manualmente el Backend

**Antes de intentar login:**

```bash
# Abrir en el navegador o en terminal:
curl https://inventory-api-74yl.onrender.com/api/v1/health
```

**O visitar directamente:**

- https://inventory-api-74yl.onrender.com/api/v1/health

**Esperar a que responda:**

```json
{
  "status": "ok",
  "timestamp": "2026-03-06T..."
}
```

**Ahora sí, intentar el login** - será inmediato.

---

## 📊 Configuración Actual en Render

### Backend (inventory-api):

```yaml
Plan: Gratis
RAM: 512MB
CPU: 0.1 CPU
Auto-suspend: ✅ Sí (después de 15 min)
Cold Start: 30-60s
```

### Frontend (inventory-frontend):

```yaml
Plan: Gratis
RAM: 512MB
CPU: 0.1 CPU
Auto-suspend: ✅ Sí (después de 15 min)
Cold Start: 10-20s
```

### Base de Datos (inventory-db):

```yaml
Plan: Free PostgreSQL
Storage: 1GB
Auto-suspend: ❌ NO (siempre activa)
```

---

## 🔧 Cómo Minimizar el Problema

### 1. **Keep-Alive Script** (Mantener Despierto)

Crear un servicio que haga ping cada 14 minutos:

**Opción A: Usar cron-job.org (GRATIS)**

1. Ir a: https://cron-job.org
2. Crear cuenta gratis
3. Crear nuevo cron job:
   ```
   URL: https://inventory-api-74yl.onrender.com/api/v1/health
   Schedule: */14 * * * * (cada 14 minutos)
   ```
4. ✅ Activar

**Opción B: Usar UptimeRobot (GRATIS)**

1. Ir a: https://uptimerobot.com
2. Crear cuenta gratis
3. Add New Monitor:
   ```
   Monitor Type: HTTP(s)
   URL: https://inventory-api-74yl.onrender.com/api/v1/health
   Monitoring Interval: 5 minutes
   ```
4. ✅ Crear

**Resultado:** El backend se mantendrá despierto mientras el cron esté activo.

### 2. **Página de "Cargando"** en Frontend

Modificar el frontend para mostrar un mensaje amigable durante el cold start.

**Ver archivo:** `MEJORA_COLD_START.md` (próximamente)

---

## 💰 Actualizar a Plan Pagado (Opcional)

### Ventajas de Motor de Arranque ($7/mes):

```diff
Plan Gratuito:
- ❌ Se suspende tras 15 min inactividad
- ❌ Cold start de 30-60s
- ❌ 512MB RAM, 0.1 CPU
- ❌ Sin SSH
- ❌ Sin discos persistentes

Motor de Arranque ($7/mes):
+ ✅ NUNCA se suspende
+ ✅ Respuesta instantánea 24/7
+ ✅ 512MB RAM, 0.5 CPU (5x más rápido)
+ ✅ Acceso SSH
+ ✅ Escalado automático
+ ✅ Trabajos puntuales (cron jobs)
```

**Para actualizar:**

1. Ir a: https://dashboard.render.com
2. Click en `inventory-api` → Settings
3. Click en "Upgrade Instance Type"
4. Seleccionar "Motor de arranque" ($7/mes)
5. Confirmar

**Nota:** También puedes actualizar solo el backend y dejar el frontend gratis.

---

## 🎯 Estado Actual del Deployment

### ✅ Cambios Enviados a GitHub

```bash
✅ Commit: 2abd2c6
✅ Push completado
✅ Render detectará los cambios automáticamente
```

### ⏱️ Tiempo de Deployment Estimado:

- **Backend (inventory-api):** 3-5 minutos
- **Frontend (inventory-frontend):** Necesitas crearlo manualmente

---

## 📋 Checklist de Pasos en Render Dashboard

### Paso 1: Eliminar Servicio Antiguo

- [ ] Ir a: https://dashboard.render.com
- [ ] Buscar servicio: `inventory-app` (si existe)
- [ ] Click → Settings → Delete Service
- [ ] Confirmar eliminación

### Paso 2: Verificar Backend

- [ ] Ir a servicio: `inventory-api`
- [ ] Verificar que esté "Deploying" o "Live"
- [ ] Esperar a que termine el deployment (~3-5 min)
- [ ] Click en la URL del servicio
- [ ] Agregar `/api/v1/health` a la URL
- [ ] Verificar respuesta JSON con status "ok"

### Paso 3: Crear Servicio de Frontend

- [ ] Click "New +" → Web Service
- [ ] Conectar repo: `https://github.com/1036951896/INVENTORY`
- [ ] Configurar:
  ```
  Name: inventory-frontend
  Root Directory: frontend
  Environment: Node
  Branch: main
  Build Command: npm install --legacy-peer-deps && npm run build
  Start Command: npm start
  ```
- [ ] Variables de entorno:
  ```
  VITE_API_URL=https://inventory-api-74yl.onrender.com
  NODE_ENV=production
  ```
- [ ] Click "Create Web Service"
- [ ] Esperar deployment (~2-3 min)

### Paso 4: PRIMER Acceso al Frontend

**IMPORTANTE:** El primer acceso tomará tiempo:

1. Abrir: https://inventory-frontend-a8da.onrender.com
2. **ESPERAR 30-60 SEGUNDOS** (está despertando)
3. Aparecerá la página de login
4. Intentar login:
   ```
   Email: admin@inventory.com
   Password: admin123
   ```
5. **ESPERAR OTROS 30-60 SEGUNDOS** (backend está despertando)
6. ✅ Deberías entrar al dashboard

**Después de esto, todo será rápido por 15 minutos.**

---

## 🚨 Troubleshooting

### Problema: "Render dice que el backend está Live pero no responde"

**Solución:**

1. Esperar 60 segundos (puede estar iniciando)
2. Probar: `https://inventory-api-74yl.onrender.com/api/v1/health`
3. Si no responde, hacer "Manual Deploy" en Render

### Problema: "Frontend carga pero login da error 500"

**Solución:**

1. Verificar que backend esté Live
2. Despertar el backend manualmente (ver Opción 2 arriba)
3. Verificar variables de entorno del frontend

### Problema: "Database connection failed"

**Solución:**

1. Ir a servicio `inventory-db` en Render
2. Verificar que esté "Available"
3. Verificar que `DATABASE_URL` esté configurada en backend
4. Hacer "Manual Deploy" del backend

### Problema: "CORS Error en el navegador"

**Solución:**

1. Verificar que `CORS_ORIGIN` en backend incluya la URL del frontend
2. Limpiar caché del navegador (Ctrl+Shift+Del)
3. Hacer hard refresh (Ctrl+Shift+R)

---

## 📈 Monitoreo del Sistema

### Ver Logs en Tiempo Real:

1. **Backend:**
   - Ir a: https://dashboard.render.com → `inventory-api`
   - Click en "Logs"
   - Buscar errores

2. **Frontend:**
   - Ir a: https://dashboard.render.com → `inventory-frontend`
   - Click en "Logs"
   - Buscar errores

### Métricas Importantes:

- **Response Time:** < 2000ms (después de cold start)
- **Error Rate:** < 1%
- **Uptime:** 100% (cuando está despierto)

---

## 🎓 Buenas Prácticas con Plan Gratuito

### ✅ DO (Hacer):

- ✅ Usar para proyectos personales y prototipos
- ✅ Configurar keep-alive (cron-job.org)
- ✅ Avisar a usuarios sobre el cold start
- ✅ Mostrar loading spinner durante cold start
- ✅ Hacer pruebas en horarios específicos

### ❌ DON'T (No Hacer):

- ❌ Usar para producción con clientes reales
- ❌ Esperar respuesta instantánea 24/7
- ❌ Guardar archivos (no hay discos persistentes)
- ❌ Procesos en background (sin cron jobs)
- ❌ Alto tráfico (optimización limitada)

---

## 💡 Resumen

**El plan gratuito de Render funciona perfectamente para:**

- ✅ Desarrollo y pruebas
- ✅ Demos y portfolios
- ✅ Proyectos escolares
- ✅ Prototipos para validar ideas

**Limitación principal:**

- ⏱️ Cold start de 30-60s después de inactividad

**Solución:**

- 🔄 Usar keep-alive con cron-job.org (gratis)
- 💰 O actualizar a plan de $7/mes para respuesta instantánea

---

## 📚 Documentos Relacionados

- [SOLUCION_RENDER.md](SOLUCION_RENDER.md) - Guía de deployment
- [MANUAL_TECNICO_SOFTWARE.md](MANUAL_TECNICO_SOFTWARE.md) - Manual técnico
- [ARQUITECTURA_FUNCIONALIDAD.md](ARQUITECTURA_FUNCIONALIDAD.md) - Arquitectura

---

**Estado:** ✅ **DEPLOYMENT EN PROGRESO**

Los cambios ya están en GitHub. Render está deployando automáticamente el backend. Solo falta crear el servicio de frontend en el dashboard.
