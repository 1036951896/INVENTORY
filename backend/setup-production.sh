#!/bin/bash
################################################################################
# SCRIPT: setup-production.sh
# Propósito: Automatizar setup de servidor de producción
# Uso: chmod +x setup-production.sh && ./setup-production.sh
################################################################################

set -e

echo "🚀 Iniciando setup de servidor de producción..."

################################################################################
# 1. Actualizar sistema
################################################################################
echo "📦 Actualizando sistema..."
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y \
    build-essential \
    git \
    curl \
    wget \
    nano \
    htop \
    tmux

################################################################################
# 2. Instalar Node.js y npm
################################################################################
echo "📦 Instalando Node.js 18 LTS..."
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Verificar instalación
node --version
npm --version

################################################################################
# 3. Instalar PM2 (process manager)
################################################################################
echo "📦 Instalando PM2..."
npm install -g pm2

# Configurar PM2 para iniciar con el sistema
pm2 startup
pm2 save

################################################################################
# 4. Instalar PostgreSQL
################################################################################
echo "📦 Instalando PostgreSQL (opcional)..."
# Si usas RDS, comenta esta sección
# sudo apt-get install -y postgresql postgresql-contrib

################################################################################
# 5. Instalar Nginx (Reverse Proxy)
################################################################################
echo "📦 Instalando Nginx..."
sudo apt-get install -y nginx

# Crear configuración de Nginx
echo "⚙️ Configurando Nginx..."
sudo tee /etc/nginx/sites-available/inventory-api > /dev/null <<EOF
upstream api {
    server localhost:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.tudominio.com;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.tudominio.com;

    # SSL Certificates (obtener con Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tudominio.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy settings
    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Habilitar sitio
sudo ln -sf /etc/nginx/sites-available/inventory-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

################################################################################
# 6. Instalar Certbot (Let's Encrypt)
################################################################################
echo "🔐 Instalando Certbot para SSL..."
sudo apt-get install -y certbot python3-certbot-nginx

# Generar certificado (interactivo)
echo "⚠️ Deberás completar Certbot manualmente:"
echo "sudo certbot certonly --nginx -d api.tudominio.com"

################################################################################
# 7. Clonar repositorio
################################################################################
echo "📥 Clonando repositorio..."
cd /opt
sudo mkdir -p inventory-app
sudo chown $USER:$USER inventory-app
cd inventory-app

# Reemplazar con tu repositorio
git clone https://github.com/tuusuario/inventory-app.git .

################################################################################
# 8. Instalar dependencias
################################################################################
echo "📦 Instalando dependencias de Node..."
cd backend
npm install --production

################################################################################
# 9. Generar Prisma Client
################################################################################
echo "⚙️ Generando Prisma Client..."
npx prisma generate

################################################################################
# 10. Crear archivo .env
################################################################################
echo "⚙️ Creando archivo .env..."
cat > .env << 'ENVFILE'
# Database
DATABASE_URL=postgresql://user:password@rds-host:5432/inventory_prod

# JWT
JWT_SECRET=your_production_secret_here_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_here_32_chars

# API
API_PORT=3000
API_VERSION=v1
NODE_ENV=production
API_URL=https://api.tudominio.com

# CORS
CORS_ORIGIN=https://app.tudominio.com,https://www.tudominio.com

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_key_here

EMAIL_FROM=noreply@tudominio.com
ADMIN_EMAIL=admin@tudominio.com

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/inventory-app/production.log

# Seguridad
FORCE_HTTPS=true
ENABLE_HELMET=true

ENVFILE

echo "⚠️ IMPORTANTE: Editar .env con credenciales reales"
echo "   nano .env"

################################################################################
# 11. Crear directorio de logs
################################################################################
echo "📁 Creando directorio de logs..."
sudo mkdir -p /var/log/inventory-app
sudo chown $USER:$USER /var/log/inventory-app

################################################################################
# 12. Ejecutar migraciones
################################################################################
echo "🔄 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

################################################################################
# 13. Iniciar con PM2
################################################################################
echo "🚀 Iniciando aplicación con PM2..."
cd /opt/inventory-app/backend

# Compilar TypeScript
npm run build

# Iniciar aplicación
pm2 start npm --name "inventory-api" --max-memory-restart 500M -- run start:prod

# Guardar configuración
pm2 save

################################################################################
# 14. Configurar logs de PM2
################################################################################
echo "📊 Configurando logs..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30

################################################################################
# 15. Configurar monitoreo
################################################################################
echo "📊 Configurando monitoreo..."
pm2 install pm2-auto-pull
pm2 install pm2-sentry

################################################################################
# Resumen
################################################################################
echo ""
echo "✅ SETUP COMPLETADO"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Editar .env con credenciales reales"
echo "   sudo nano /opt/inventory-app/backend/.env"
echo ""
echo "2. Configurar SSL/TLS con Certbot"
echo "   sudo certbot certonly --nginx -d api.tudominio.com"
echo ""
echo "3. Editar Nginx con tu dominio"
echo "   sudo nano /etc/nginx/sites-available/inventory-api"
echo ""
echo "4. Verificar estado de la aplicación"
echo "   pm2 status"
echo ""
echo "5. Ver logs en tiempo real"
echo "   pm2 logs inventory-api"
echo ""
echo "6. Configurar backups automáticos"
echo "   # Agregar cron job de backups"
echo ""
echo "🚀 API disponible en: https://api.tudominio.com"
echo ""

################################################################################
