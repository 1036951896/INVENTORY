# 🚀 GUÍA DE CONFIGURACIÓN - SERVIDORES DE PRODUCCIÓN

**Última actualización**: 11 de Febrero de 2026  
**Versión**: 2.0 - E-commerce Completo

---

## 📋 Tabla de Contenidos

1. [Configuración Local (Desarrollo)](#1-configuración-local-desarrollo)
2. [Configuración Producción](#2-configuración-producción)
3. [Servidores Soportados](#3-servidores-soportados)
4. [Variables Críticas de Seguridad](#4-variables-críticas-de-seguridad)
5. [Checklist de Deployment](#5-checklist-de-deployment)

---

## 1️⃣ Configuración Local (Desarrollo)

### Paso 1: Copiar archivo de ejemplo

```bash
cd backend
cp .env.example .env.development
```

### Paso 2: Configurar base de datos local

```bash
# Instalar PostgreSQL si no lo tienes
# En Windows: descargar desde postgresql.org
# En Mac: brew install postgresql
# En Linux: sudo apt-get install postgresql postgresql-contrib

# Crear base de datos
createdb inventory_dev
```

### Paso 3: Actualizar .env.development

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/inventory_dev
API_URL=http://localhost:3000
NODE_ENV=development
```

### Paso 4: Ejecutar migración

```bash
npx prisma migrate dev
npm run start:dev
```

✅ **Backend corriendo en**: `http://localhost:3000`

---

## 2️⃣ Configuración Producción

### ⭐ Pre-requisitos de Producción

Antes de hacer deploy, necesitas:

- ✅ **Dominio propio** (ej: `api.tudominio.com`)
- ✅ **Certificado SSL/TLS** (HTTPS obligatorio)
- ✅ **Base de datos PostgreSQL remota**
- ✅ **Servidor o PaaS** (AWS, Heroku, DigitalOcean, etc)
- ✅ **Variables de entorno seguras**
- ✅ **Backups automatizados**

---

### 📍 Opción 1: Heroku (Recomendado para MVP)

#### Instalación

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create inventory-api-prod
```

#### Configurar Variables de Entorno

```bash
# Desde el archivo .env.production
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set DATABASE_URL=postgresql://...

# O desde archivo
heroku config:set $(cat .env.production | grep -v '^#' | tr '\n' ' ')
```

#### Agregar PostgreSQL

```bash
# Add Heroku Postgres
heroku addons:create heroku-postgresql:standard-0

# Migrations se ejecutan automáticamente
```

#### Deploy

```bash
git push heroku main
```

✅ **API corriendo en**: `https://inventory-api-prod.herokuapp.com`

---

### 📍 Opción 2: AWS (Más control)

#### 1. EC2 + RDS (Recomendado)

**Crear instancia EC2:**

```bash
# Ubuntu 22.04 LTS t3.medium

# SSH a instancia
ssh -i key.pem ubuntu@instance-ip

# Instalar Node y PM2
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
npm install -g pm2

# Instalar Git
sudo apt-get install git
```

**Crear RDS PostgreSQL:**

```
- Engine: PostgreSQL 14+
- Multi-AZ: Enabled (producción)
- Backup retention: 30 days
- Allocate storage: 100 GB
- Instance class: db.t3.small (mínimo)
```

**Subir código:**

```bash
git clone <repo-url>
cd inventory-app/backend
npm install --production
npx prisma migrate deploy
```

**Crear archivo .env**

```bash
# Copiar .env.production y customizar
cp .env.production .env
nano .env  # editar
```

**Iniciar con PM2**

```bash
pm2 start npm --name "inventory-api" -- run start:prod
pm2 startup
pm2 save
```

✅ **API corriendo en**: `https://api.tudominio.com`

---

### 📍 Opción 3: DigitalOcean App Platform

#### Conectar repositorio

1. Ir a DigitalOcean Console
2. Apps → Create App
3. Conectar GitHub repository
4. Seleccionar rama `main`

#### Agregar variables de entorno

```
NODE_ENV=production
JWT_SECRET=tu_secret_aqui
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://app.tudominio.com
```

#### Agregar PostgreSQL Database

```
Managed Database → Create New → PostgreSQL
- Version: 14+
- Plan: $12/mes (producción)
```

#### Deploy automático

Push a `main` y se deploya automáticamente

✅ **API corriendo en**: `https://inventory-api-xxxxx.ondigitalocean.app`

---

### 📍 Opción 4: Docker + VPS (Control Total)

#### 1. Crear Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

#### 2. Docker Compose

```yaml
version: "3.8"

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: $DB_USER
      POSTGRES_PASSWORD: $DB_PASSWORD
      POSTGRES_DB: inventory_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://$DB_USER:$DB_PASSWORD@db:5432/inventory_prod
      NODE_ENV: production
      JWT_SECRET: $JWT_SECRET
      API_PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - db

volumes:
  postgres_data:
```

#### 3. Deploy en VPS

```bash
# En tu VPS (Ubuntu 22.04)
docker-compose up -d

# Ver logs
docker-compose logs -f api
```

✅ **API corriendo en**: `https://api.tudominio.com`

---

## 3️⃣ Servidores Soportados

### Comparativa de Opciones

| Servidor         | Costo       | Facilidad | Escalabilidad | Recomendado |
| ---------------- | ----------- | --------- | ------------- | ----------- |
| **Heroku**       | $7-50/mes   | ⭐⭐⭐    | ⭐⭐          | MVP         |
| **AWS**          | $20-200/mes | ⭐⭐      | ⭐⭐⭐        | Empresa     |
| **DigitalOcean** | $5-40/mes   | ⭐⭐⭐    | ⭐⭐          | PYME        |
| **Vercel**       | Gratis-$150 | ⭐⭐⭐    | ⭐⭐⭐        | Frontend    |
| **Docker + VPS** | $5-50/mes   | ⭐        | ⭐⭐          | Experto     |

---

## 4️⃣ Variables Críticas de Seguridad

### JWT_SECRET y JWT_REFRESH_SECRET

🔒 **NUNCA usar valuoresdefin** - Generar nuevo con:

```bash
# Generar 32 caracteres aleatorios
openssl rand -base64 32
```

**Resultado**:

```
YourProductionSecretKey1234567890abcdefgh=
```

---

### DATABASE_URL

```env
# Formato
postgresql://username:password@host:port/database

# Ejemplo
postgresql://prod_user:Secure_Pass_123@db-prod.aws.rds.com:5432/inventory_prod

# ⚠️ IMPORTANTE
- Usar usuarios con permisos mínimos
- Cambiar contraseña default
- Usar SSL en conexión (SSL=true)
```

---

### CORS_ORIGIN

```env
# DESARROLLO (permitir localhost)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# PRODUCCIÓN (solo dominios reales)
CORS_ORIGIN=https://app.tudominio.com,https://www.tudominio.com

# ⚠️ NO USAR *
```

---

### SMTP Credentials (Email)

**Opciones recomendadas:**

#### SendGrid (Recomendado - Gratis 100/día)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key_here
```

#### Gmail + App Password

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Google App Password
```

#### AWS SES

```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=465
SMTP_USER=your_iam_user
SMTP_PASSWORD=your_iam_password
```

---

### AWS S3 (Imágenes y CDN)

```bash
# Crear Access Key en AWS IAM
# Política mínima requerida:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::inventory-bucket/*"
    }
  ]
}

# Variables
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalr...
AWS_S3_BUCKET=inventory-prod-bucket
AWS_S3_REGION=us-east-1
```

---

### Redis (Cache en Producción)

```env
# ElastiCache (AWS)
REDIS_HOST=redis-prod.xxxxx.cache.amazonaws.com
REDIS_PORT=6380
REDIS_PASSWORD=your_redis_auth_token

# O Heroku Redis
# Heroku config:get REDIS_URL
```

---

## 5️⃣ Checklist de Deployment

### Pre-Deployment

- [ ] Base de datos configurada y respaldada
- [ ] Variables de entorno seguras en servidor
- [ ] Certificado SSL/TLS instalado
- [ ] Dominio apuntando a servidor
- [ ] GitHub repository público/privado
- [ ] Node.js v18+ instalado
- [ ] PostgreSQL 14+ en servidor

### Deployment

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd inventory-app/backend

# 2. Instalar dependencias
npm install --production

# 3. Generar Prisma Client
npx prisma generate

# 4. Ejecutar migraciones
npx prisma migrate deploy

# 5. Compilar TypeScript (si es necesario)
npm run build

# 6. Iniciar servidor
npm run start:prod
```

### Post-Deployment

- [ ] API respondiendo en `/api/v1/health` ✅
- [ ] Autenticación JWT funciona
- [ ] Base de datos conecta sin errores
- [ ] Emails se envían correctamente
- [ ] CORS configurado correctamente
- [ ] HTTPS redirige HTTP
- [ ] Rate limiting activo
- [ ] Logs se escriben correctamente
- [ ] Backups automatizados activos

### Monitoreo

```bash
# Ver logs en tiempo real
tail -f /var/log/inventory-app/production.log

# Ver procesos (PM2)
pm2 monit

# Heroku
heroku logs --tail
```

---

## 🔄 Actualización en Producción

### Procedimiento seguro

```bash
# 1. Cambios locales
git commit -m "Feature: nuevo carrito persistente"
git push origin main

# 2. En servidor de producción
git pull origin main
npm install --production
npx prisma migrate deploy
npm run start:prod

# O con PM2
pm2 restart inventory-api
pm2 save
```

### Rollback en caso de error

```bash
# Volver a versión anterior
git revert <commit-hash>
git push origin main
# Luego hacer pull y reiniciar
```

---

## 📊 Monitoreo en Producción

### Configurar Sentry (Error Tracking)

```bash
# 1. Ir a sentry.io
# 2. Crear proyecto Node.js
# 3. Copiar DSN

SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

### Health Check

```bash
# Endpoint para monitoreo
GET http://localhost:3000/api/v1/health

# Response
{
  "status": "ok",
  "timestamp": "2026-02-11T10:00:00Z",
  "database": "connected"
}
```

---

## 🔐 Seguridad en Producción

### Recomendaciones

1. **SSH Keys en lugar de passwords**

   ```bash
   ssh-keygen -t ed25519
   ```

2. **Firewall restrictivo**
   - Solo puerto 443 (HTTPS) al público
   - SSH solo desde IP fija

3. **Backups diarios**

   ```bash
   # RDS: Automated backups con 30d retention
   # O script cron: pg_dump schedule
   ```

4. **Actualizar dependencias**

   ```bash
   npm audit fix
   npm update
   ```

5. **Monitoreo 24/7**
   - Sentry para errores
   - UptimeRobot para disponibilidad
   - CloudWatch/Datadog para métricas

---

## 📞 Troubleshooting

### Error: "DATABASE_URL is not set"

```bash
# Confirmar variable en servidor
echo $DATABASE_URL
# Si no aparece, exportar:
export DATABASE_URL=postgresql://...
```

### Error: "Port already in use"

```bash
# Cambiar puerto
API_PORT=3001

# O liberar puerto
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Error: "CORS error"

```bash
# Verificar CORS_ORIGIN
echo $CORS_ORIGIN

# Debe incluir dominio del frontend
CORS_ORIGIN=https://app.tudominio.com
```

---

**Generado**: 11 de Febrero de 2026  
**Status**: ✅ LISTO PARA PRODUCCIÓN
