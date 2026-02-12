# 🎯 QUICK START - DEPLOY EN PRODUCCIÓN

**Última actualización**: 11 de Febrero de 2026  
**Versión**: 2.0

---

## ⚡ Quick Deploy (3 comandos)

### 1️⃣ Clonar y preparar

```bash
git clone <your-repo>
cd inventory-app
cp backend/.env.example backend/.env
```

### 2️⃣ Editar variables (crítico ⚠️)

```bash
# Editar backend/.env con tus credenciales
nano backend/.env

# Variables mínimas requeridas:
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<32-char-random-string>
SMTP_PASSWORD=<your-sendgrid-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
```

### 3️⃣ Iniciar con Docker

```bash
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f api
```

✅ **API corriendo en**: `https://api.tudominio.com`

---

## 📋 Opción A: Docker Compose (Recomendado)

### Requisitos

- ✅ Docker instalado
- ✅ Docker Compose v2.0+
- ✅ 4GB RAM disponible

### 1. Configurar variables

```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env

# Editar con tus valores
nano backend/.env
```

### 2. Iniciar servicios

```bash
docker-compose up -d

# Esperar a que reduzcan los logs
# (~20 segundos para inicializar)
```

### 3. Verificar servicios

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f api

# Probar API
curl https://api.tudominio.com/api/v1/health
```

### 4. Ejecutar migraciones (primera vez)

```bash
docker-compose exec api npx prisma migrate deploy
```

### 5. Crear usuario admin (primera vez)

```bash
docker-compose exec api npm run seed
```

---

## 📋 Opción B: Ubuntu/Linux VPS

### Requisitos

- ✅ Ubuntu 22.04 LTS
- ✅ 2GB RAM mínimo
- ✅ 20GB disco

### 1. Ejecutar script de setup

```bash
# Descargar script
curl -O https://raw.githubusercontent.com/tu-repo/backend/setup-production.sh

# Ejecutar
chmod +x setup-production.sh
./setup-production.sh
```

### 2. Editar credenciales

```bash
nano /opt/inventory-app/backend/.env
```

### 3. SSL con Let's Encrypt

```bash
# Generar certificados (automático después de DNS)
sudo certbot certonly --nginx -d api.tudominio.com

# Renovación automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 4. Verificar estado

```bash
# Ver procesos
pm2 status

# Ver logs
pm2 logs inventory-api

# Monitoreo en tiempo real
pm2 monit
```

---

## 📋 Opción C: Heroku (Más fácil)

### Requisitos

- ✅ Cuenta Heroku
- ✅ Heroku CLI instalado

### 1. Crear app

```bash
heroku login
heroku create inventory-api-prod
```

### 2. Agregar PostgreSQL

```bash
heroku addons:create heroku-postgresql:standard-0
```

### 3. Configurar variables

```bash
# Generar JWT_SECRET seguro
JWT_SECRET=$(openssl rand -base64 32)

# Agregar variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$JWT_SECRET
heroku config:set POSTGRES_SSL=true
heroku config:set SMTP_PASSWORD=your-sendgrid-key
```

### 4. Deploy

```bash
git push heroku main
```

### 5. Verificar

```bash
heroku logs --tail

# Crear admin
heroku run npm run seed
```

---

## 🔍 Verificación Post-Deploy

### Checklist de salud

```bash
# 1. API responde
curl https://api.tudominio.com/api/v1/health

# 2. Base de datos conecta
curl https://api.tudominio.com/api/v1/users \
  -H "Authorization: Bearer your-token"

# 3. CORS configurado
curl https://api.tudominio.com/api/v1/health \
  -H "Origin: https://app.tudominio.com"

# 4. Certificado SSL válido
curl -I https://api.tudominio.com

# 5. Rate limiting activo
for i in {1..150}; do curl https://api.tudominio.com/api/v1/health; done
```

---

## 🔐 Variables Críticas (SEGURIDAD)

### Generar valores seguros

```bash
# JWT_SECRET (32 caracteres mínimo)
openssl rand -base64 32

# Ejemplo generado:
# +c3/YxK8q9Z1p2mL4vW5nJ6bX7sO8tU9=

# DATABASE_PASSWORD (contraseña fuerte)
openssl rand -base64 20

# SMTP_PASSWORD (de tu proveedor de email)
# - SendGrid: Obtener de https://app.sendgrid.com/settings/api_keys
# - Gmail: Obtener App Password de https://myaccount.google.com/apppasswords
```

### Archivo .env de ejemplo

```env
# ==============================================================
# 🔴 CRÍTICO - CAMBIAR ESTOS VALORES
# ==============================================================

DATABASE_URL=postgresql://prod_user:CHANGE_ME_SECURE_PASSWORD@db:5432/inventory_prod
JWT_SECRET=CHANGE_ME_GENERATE_WITH_openssl
JWT_REFRESH_SECRET=CHANGE_ME_GENERATE_NEW_SECRET
SMTP_PASSWORD=CHANGE_ME_GET_FROM_SENDGRID

# ==============================================================
# Opcionales pero recomendados
# ==============================================================

AWS_SECRET_ACCESS_KEY=CHANGE_ME_IF_USING_S3
STRIPE_SECRET_KEY=CHANGE_ME_IF_ACCEPTING_PAYMENTS
TWILIO_AUTH_TOKEN=CHANGE_ME_IF_USING_WHATSAPP

# ==============================================================
# Puedes dejar como está (tienen valores por defecto)
# ==============================================================

API_PORT=3000
NODE_ENV=production
API_URL=https://api.tudominio.com
CORS_ORIGIN=https://app.tudominio.com
```

---

## 🐛 Troubleshooting

### Error: "CONNECTION REFUSED"

```bash
# Verificar que PostgreSQL está corriendo
docker ps | grep postgres

# Si está abajo, iniciar
docker-compose up -d db

# Esperar 10 segundos y ver logs
docker-compose logs db
```

### Error: "JWT_SECRET is not set"

```bash
# Verificar variable edefenida
echo $JWT_SECRET

# Si está vacía, definir
export JWT_SECRET=$(openssl rand -base64 32)

# En Docker: actualizar .env y reiniciar
docker-compose down
docker-compose up -d
```

### Error: "Port 443 already in use"

```bash
# Encontrar proceso en puerto 443
sudo lsof -i :443

# Matar proceso (PID)
sudo kill -9 <PID>

# O cambiar puerto en docker-compose
# (No recomendado para producción)
```

### Error: "CORS blocked"

```bash
# Verificar CORS_ORIGIN en .env
grep CORS_ORIGIN backend/.env

# Debe incluir tu dominio frontend
CORS_ORIGIN=https://app.tudominio.com,https://www.tudominio.com
```

### Error: "SSL certificate not found"

```bash
# Generar con Let's Encrypt (Linux/Mac)
sudo certbot certonly --standalone -d api.tudominio.com

# Archivos se crean en:
# /etc/letsencrypt/live/api.tudominio.com/

# Renovación automática
sudo certbot renew
```

---

## 📊 Monitoreo en Producción

### Ver estado en tiempo real

```bash
# Docker
docker-compose ps

# PM2 (VPS)
pm2 status
pm2 monit

# Heroku
heroku logs --tail
```

### Ver logs específicos

```bash
# Docker - últimas 100 líneas
docker-compose logs --tail=100 api

# Docker - en tiempo real
docker-compose logs -f api

# PM2 - últimas 100 líneas
pm2 logs inventory-api --lines 100

# Heroku
heroku logs --tail
```

### Health check

```bash
# Endpoint de salud
GET /api/v1/health

# Response esperada
{
  "status": "ok",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-02-11T15:30:00.000Z"
}
```

---

## 🔄 Actualizar en Producción

### Docker (Zero-downtime)

```bash
# 1. Hacer cambios, commit y push
git commit -m "Feature: nueva funcionalidad"
git push origin main

# 2. Descargar cambios
git pull origin main

# 3. Reconstruir imagen (en background)
docker-compose up -d --build

# 4. Verificar estado
docker-compose ps
docker-compose logs -f api
```

### VPS + PM2

```bash
# 1. Pull cambios
git pull origin main

# 2. Instalar dependencias (si hay)
npm install --production

# 3. Compilar
npm run build

# 4. Ejecutar migraciones (si hay)
npx prisma migrate deploy

# 5. Reiniciar
pm2 restart inventory-api
pm2 save
```

### Heroku

```bash
# Simplemente hacer push
git push heroku main

# Heroku redeploya automáticamente
# Ver progreso
heroku logs --tail
```

---

## 🛠️ Mantenimiento

### Backups automáticos

```bash
# Docker - backup diario
# Agregar cron job (Linux/Mac)
0 2 * * * docker-compose exec -T db pg_dump -U inventory_user inventory_prod > /backups/backup-$(date +\%Y\%m\%d).sql

# RDS (AWS) - funciona automáticamente
# Ir a AWS Console → RDS → Backups
```

### Limpieza de logs

```bash
# Docker
docker-compose logs --tail=0 -f

# PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
```

### Actualizar dependencias

```bash
# Verificar vulnerabilidades
npm audit

# Instalar parches
npm audit fix

# Actualizar
npm update

# Recompilar
npm run build

# Redeplegar
git add .
git commit -m "deps: update packages"
git push
```

---

## 📞 Soporte & Documentación

- **API Docs**: `/api/v1/docs` (Swagger)
- **Health Check**: `/api/v1/health`
- **Errores**: Ver `docker-compose logs api`

---

**🚀 ¡Todo listo para producción!**

Para preguntas o problemas:

1. Revisar logs (`docker-compose logs -f api`)
2. Verificar variables de entorno (`docker-compose config`)
3. Hacer rollback si es necesario (`git revert && docker-compose up -d --build`)
