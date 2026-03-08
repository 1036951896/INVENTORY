# ✅ Verificaciones para render.yaml

## Pre-despliegue - Estructura YAML

- [ ] El archivo `render.yaml` está en la raíz del repositorio
- [ ] Sintaxis YAML válida (sin tabs, indentación con espacios)
- [ ] Sección `databases` está fuera de `services`
- [ ] Base de datos definida en `databases`, no en `services`

## Rutas y Contextos

- [ ] `dockerfilePath: backend/Dockerfile` existe en el repositorio
- [ ] `dockerContext: backend` apunta a la carpeta correcta
- [ ] `rootDir: frontend` apunta a la carpeta del frontend
- [ ] Los paths son relativos a la raíz del repositorio

## Variables de Entorno

- [ ] `DATABASE_URL` usa `fromDatabase` correctamente
- [ ] Variables `generateValue: true` para JWT_SECRET y JWT_REFRESH_SECRET (se generan en deploy)
- [ ] SMTP_PASSWORD está como `generateValue: true` (asegúrate de actualizarlo después en Render)
- [ ] CORS_ORIGIN coincide con el dominio del frontend en Render
- [ ] VITE_API_URL coincide con el dominio del backend en Render

## Base de Datos

- [ ] Plan `free` seleccionado (base de datos se pausa tras 15 min inactividad)
- [ ] Region `oregon` consistente en todos los servicios
- [ ] PostgreSQL por defecto (no especificar tipo)
- [ ] Conexión desde backend a DB verificada en código

## Backend (NestJS + Docker)

- [ ] `Dockerfile` en `backend/` construye correctamente
- [ ] `runtime: docker` configurado
- [ ] `PORT` 3000 coincide con lo que espera la app
- [ ] `NODE_ENV: production` correcto
- [ ] `healthCheckPath: /api/v1/health` existe en la aplicación

## Frontend (React + Vite)

- [ ] `type: static` para aplicación estática
- [ ] `buildCommand` genera carpeta `dist/`
- [ ] `staticPublishPath: dist` apunta a la carpeta de salida
- [ ] `VITE_API_URL` apunta al backend correcto
- [ ] No hay `startCommand` (Render maneja archivos estáticos automáticamente)

## Despliegue en Render

- [ ] Conectar repositorio GitHub a Render
- [ ] Blueprint `render.yaml` se detecta automáticamente
- [ ] Todas las variables `generateValue: true` se crean en deploy
- [ ] Base de datos se provisiona antes que los servicios
- [ ] Backend se inicia después de la BD (dependencias automáticas)
- [ ] Frontend se sirve desde CDN de Render

## Post-despliegue

- [ ] Backend API responde en `https://inventory-api.onrender.com`
- [ ] Frontend accessible en `https://inventory-frontend.onrender.com`
- [ ] Requests CORS desde frontend al backend funcionan
- [ ] Base de datos conectada y migrada
- [ ] Logs sin errores de conexión

---

**Notas importantes:**

1. **Plan Free**: La BD se pausa si no hay actividad en 15 min. La primera solicitud después de pausa tarda más.
2. **Variables Generadas**: JWT_SECRET y JWT_REFRESH_SECRET se crean aleatoriamente. Guárdalas después en Render si las necesitas para debugging.
3. **SMTP_PASSWORD**: Actualiza con tu contraseña real después del despliegue en Render (en Environment Variables).
4. **Migraciones**: Asegúrate de que Prisma corra migrations automáticamente o agrega un hook en el backend.
