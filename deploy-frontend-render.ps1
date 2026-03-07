# Script para Deployar Frontend a Render
# Hace commit y push de las configuraciones de entorno

Write-Host "PREPARANDO DEPLOYMENT DEL FRONTEND" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar archivos .env
Write-Host "Verificando archivos de configuracion..." -ForegroundColor Yellow

if (Test-Path "frontend\.env.production") {
    Write-Host "[OK] frontend/.env.production encontrado" -ForegroundColor Green
}
else {
    Write-Host "[X] frontend/.env.production NO encontrado" -ForegroundColor Red
    exit 1
}

if (Test-Path "frontend\.env.development") {
    Write-Host "[OK] frontend/.env.development encontrado" -ForegroundColor Green
}
else {
    Write-Host "[X] frontend/.env.development NO encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Agregando archivos..." -ForegroundColor Yellow
git add frontend/.env.production frontend/.env.development ACCESO_DESDE_CELULAR.md

Write-Host "Creando commit..." -ForegroundColor Yellow
git commit -m "feat: agregar configuracion de entorno para produccion

- Agregar .env.production con URL del backend de Render
- Agregar .env.development con URL local
- Documentar pasos para acceder desde celular
- Guia completa de deployment de frontend en Render
"

Write-Host "Enviando cambios a GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "[OK] CAMBIOS ENVIADOS A GITHUB" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PROXIMOS PASOS PARA CREAR EL FRONTEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ir a Render Dashboard:" -ForegroundColor White
Write-Host "   https://dashboard.render.com" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Click en 'New +' > 'Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "3. Conectar repositorio:" -ForegroundColor White
Write-Host "   https://github.com/1036951896/INVENTORY" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Configurar:" -ForegroundColor White
Write-Host "   Name: inventory-frontend" -ForegroundColor Gray
Write-Host "   Root Directory: frontend" -ForegroundColor Gray
Write-Host "   Build: npm install --legacy-peer-deps && npm run build" -ForegroundColor Gray
Write-Host "   Start: npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Variables de entorno (Advanced):" -ForegroundColor White
Write-Host "   VITE_API_URL=https://inventory-api-74yl.onrender.com" -ForegroundColor Gray
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Plan: Free (0 USD/mes)" -ForegroundColor White
Write-Host ""
Write-Host "7. Click 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "8. Esperar 2-3 minutos mientras deploya" -ForegroundColor White
Write-Host ""
Write-Host "9. Obtener la URL (algo como):" -ForegroundColor White
Write-Host "   https://inventory-frontend-XXXX.onrender.com" -ForegroundColor Gray
Write-Host ""
Write-Host "10. Acceder desde tu celular a esa URL!" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver guia completa en: ACCESO_DESDE_CELULAR.md" -ForegroundColor Yellow
Write-Host ""
