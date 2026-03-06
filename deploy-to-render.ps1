# Script para Deployar Cambios a Render
# Este script hace commit y push de las correcciones

Write-Host "PREPARANDO DEPLOYMENT DE CORRECCIONES" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la rama correcta
$currentBranch = git branch --show-current
Write-Host "Rama actual: $currentBranch" -ForegroundColor Yellow

if ($currentBranch -ne "main") {
    Write-Host "[ADVERTENCIA] No estas en la rama 'main'. Continuar? (S/N)" -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -ne "S" -and $confirm -ne "s") {
        Write-Host "[X] Deployment cancelado" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "Archivos modificados:" -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "Deseas hacer commit y push de estos cambios? (S/N)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "[X] Deployment cancelado" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Agregando archivos..." -ForegroundColor Yellow
git add .

Write-Host "Creando commit..." -ForegroundColor Yellow
git commit -m "fix: corregir deployment de Render - actualizar servicios frontend/backend

- Actualizar render.yaml con servicio de frontend correcto
- Eliminar referencia a servicio obsoleto inventory-app
- Crear nuevo servicio inventory-frontend (React + Vite)
- Restaurar server.js para servir frontend en produccion
- Actualizar CORS en backend con URL correcta del frontend
- Agregar documentacion SOLUCION_RENDER.md con pasos de deployment
"

Write-Host "Enviando cambios a GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "[OK] CAMBIOS ENVIADOS A GITHUB" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Ir a Render Dashboard: https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Eliminar servicio 'inventory-app' (obsoleto)" -ForegroundColor White
Write-Host "3. El backend 'inventory-api' se redesplegara automaticamente" -ForegroundColor White
Write-Host "4. Crear nuevo servicio 'inventory-frontend' siguiendo la guia en SOLUCION_RENDER.md" -ForegroundColor White
Write-Host ""
Write-Host "Ver documentacion completa en: SOLUCION_RENDER.md" -ForegroundColor Yellow
Write-Host ""
