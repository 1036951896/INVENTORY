@echo off
REM ============================================================================
REM Script: setup-production.bat
REM Propósito: Preparar frontend para producción
REM Uso: Ejecutar desde terminal (PowerShell o CMD)
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo ===============================================
echo  SETUP FRONTEND - PRODUCCION
echo ===============================================
echo.

REM Navegar a carpeta frontend
cd frontend

REM Instalar dependencias
echo [1/5] Instalando dependencias...
call npm install --production

REM Compilar para producción
echo [2/5] Compilando para producción...
call npm run build

REM Verificar build
echo [3/5] Verificando build...
if exist dist (
    echo ✓ Build creado exitosamente
) else (
    echo ✗ Error en build
    exit /b 1
)

REM Crear archivo .env.production
echo [4/5] Creando .env.production...
(
    echo VITE_API_BASE_URL=https://api.tudominio.com
    echo VITE_APP_NAME=Inventory E-Commerce
    echo VITE_APP_VERSION=2.0.0
    echo VITE_LOG_LEVEL=warn
    echo VITE_ENABLE_DEBUG=false
) > .env.production

echo ✓ Archivo .env.production creado

REM Mostrar tamaño del build
echo [5/5] Mostrando tamaño del build...
for /r dist %%a in (*) do (
    set /a size+=%%~za
)
if defined size (
    echo.
    echo Tamaño total: !size! bytes ^(^!size:~0,-6!.!size:~-6,2! MB^)
)

echo.
echo ===============================================
echo  ✅ SETUP COMPLETADO
echo ===============================================
echo.
echo Próximos pasos:
echo.
echo 1. Editar .env.production con tu dominio
echo    set VITE_API_BASE_URL=https://api.tudominio.com
echo.
echo 2. El contenido para producción está en: dist/
echo.
echo 3. Deployment a servidor:
echo    - Subir carpeta 'dist' a Vercel, Netlify, AWS S3+CloudFront, etc
echo.
echo 4. Configurar variables de entorno en servidor:
echo    - API_BASE_URL=https://api.tudominio.com
echo    - NODE_ENV=production
echo.
echo 🚀 Frontend listo para producción!
echo.
