# Script de Limpieza Automatica del Proyecto
# Ejecuta las correcciones identificadas en la auditoria

Write-Host "INICIANDO LIMPIEZA DEL PROYECTO" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$confirmacion = Read-Host "Deseas proceder con la limpieza? (S/N)"
if ($confirmacion -ne "S" -and $confirmacion -ne "s") {
    Write-Host "[X] Limpieza cancelada" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "FASE 1: Limpieza de Archivos Obsoletos" -ForegroundColor Yellow
Write-Host ""

# Crear carpeta de backup
$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "[OK] Carpeta de backup creada: $backupDir" -ForegroundColor Green

# 1. Mover frontend antiguo a backup
Write-Host "Moviendo frontend antiguo (public/) a backup..." -ForegroundColor Yellow
if (Test-Path "public") {
    Move-Item -Path "public" -Destination "$backupDir/public" -Force
    Write-Host "  [OK] Frontend antiguo movido a backup" -ForegroundColor Green
}
else {
    Write-Host "  [INFO] Carpeta public ya no existe" -ForegroundColor Gray
}

# 2. Mover servidor antiguo a backup
Write-Host "Moviendo servidor obsoleto (server/) a backup..." -ForegroundColor Yellow
if (Test-Path "server") {
    Move-Item -Path "server" -Destination "$backupDir/server" -Force
    Write-Host "  [OK] Servidor obsoleto movido a backup" -ForegroundColor Green
}
else {
    Write-Host "  [INFO] Carpeta server ya no existe" -ForegroundColor Gray
}

# 3. Eliminar package.json raiz (servidor obsoleto)
Write-Host "Eliminando package.json y node_modules de raiz..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Move-Item -Path "package.json" -Destination "$backupDir/package.json" -Force
    Write-Host "  [OK] package.json movido a backup" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "  [OK] package-lock.json eliminado" -ForegroundColor Green
}
if (Test-Path "node_modules") {
    Write-Host "  Eliminando node_modules (puede tardar)..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "  [OK] node_modules eliminado" -ForegroundColor Green
}

# 4. Mover archivos de prueba
Write-Host "Moviendo archivos de prueba..." -ForegroundColor Yellow
$testFiles = @(
    "test-admin-load.html",
    "test-reportes.js"
)
New-Item -ItemType Directory -Path "$backupDir/tests" -Force | Out-Null
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "$backupDir/tests/$file" -Force
        Write-Host "  [OK] $file movido" -ForegroundColor Green
    }
}

# 5. Renombrar carpeta de imagenes
Write-Host "Renombrando carpeta de imagenes..." -ForegroundColor Yellow
if (Test-Path "imagenes productos") {
    Rename-Item -Path "imagenes productos" -NewName "uploads" -Force
    Write-Host "  [OK] 'imagenes productos' -> 'uploads'" -ForegroundColor Green
}
else {
    Write-Host "  [INFO] Carpeta 'imagenes productos' ya no existe" -ForegroundColor Gray
}

Write-Host ""
Write-Host "FASE 2: Crear Estructura de Archivos" -ForegroundColor Yellow
Write-Host ""

# Crear carpeta docs/archive
Write-Host "Creando estructura de documentacion..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "docs/archive" -Force | Out-Null
Write-Host "  [OK] docs/archive creado" -ForegroundColor Green

# Mover documentación histórica
$docsToArchive = @(
    "CSS_CHANGES_SUMMARY.md",
    "HEADER_UPGRADE_2024.md",
    "README_HEADER_UPGRADE.md",
    "VERIFICATION_CHECKLIST.md",
    "VISUAL_REFERENCE.md",
    "MEJORAS_FILTROS.md"
)
foreach ($doc in $docsToArchive) {
    if (Test-Path $doc) {
        Move-Item -Path $doc -Destination "docs/archive/$doc" -Force
        Write-Host "  [OK] $doc archivado" -ForegroundColor Green
    }
}

# Mover scripts one-time
Write-Host "Archivando scripts temporales..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "scripts/archive" -Force | Out-Null
if (Test-Path "descargar-imagenes.ps1") {
    Move-Item -Path "descargar-imagenes.ps1" -Destination "scripts/archive/descargar-imagenes.ps1" -Force
    Write-Host "  [OK] descargar-imagenes.ps1 archivado" -ForegroundColor Green
}

Write-Host ""
Write-Host "FASE 3: Actualizar .gitignore" -ForegroundColor Yellow
Write-Host ""

# Actualizar .gitignore
$gitignoreAdditions = @"

# Uploads de imágenes
uploads/
imagenes productos/

# Backups
backup_*/

# Archivos temporales adicionales
*.bak
*.old
.env.local
.env.production.local

# Tests
tests/temp/
"@

Add-Content -Path ".gitignore" -Value $gitignoreAdditions
Write-Host "[OK] .gitignore actualizado" -ForegroundColor Green

Write-Host ""
Write-Host "RESUMEN DE LIMPIEZA" -ForegroundColor Cyan
Write-Host "======================"  -ForegroundColor Cyan
Write-Host ""
Write-Host "[OK] Frontend antiguo (public/) -> backup" -ForegroundColor Green
Write-Host "[OK] Servidor obsoleto (server/) -> backup" -ForegroundColor Green
Write-Host "[OK] package.json raiz -> backup" -ForegroundColor Green
Write-Host "[OK] node_modules raiz -> eliminado" -ForegroundColor Green
Write-Host "[OK] Archivos de prueba -> backup/tests" -ForegroundColor Green
Write-Host "[OK] 'imagenes productos' -> 'uploads'" -ForegroundColor Green
Write-Host "[OK] Documentacion historica -> docs/archive" -ForegroundColor Green
Write-Host "[OK] .gitignore actualizado" -ForegroundColor Green
Write-Host ""
Write-Host "Backup completo guardado en: $backupDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "LIMPIEZA COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Revisar que todo funcione correctamente"
Write-Host "  2. Ejecutar tests del backend: cd backend && npm test"
Write-Host "  3. Ejecutar frontend: cd frontend && npm run dev"
Write-Host "  4. Si todo funciona, eliminar carpeta de backup"
Write-Host "  5. Hacer commit de los cambios"
Write-Host ""
