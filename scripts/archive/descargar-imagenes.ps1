# Script para descargar imágenes de productos desde URLs
$jsonPath = "c:\Users\Equipo\Desktop\inventory app\public\data\productos-imagenes.json"
$outputDir = "c:\Users\Equipo\Desktop\inventory app\public\images\productos"

# Leer el JSON
$json = Get-Content $jsonPath | ConvertFrom-Json

# Variables para tracking
$contador = 0
$errores = 0

Write-Host "=== Iniciando descarga de imagenes ===" -ForegroundColor Green
Write-Host "Destino: $outputDir" -ForegroundColor Cyan

# Iterar sobre los productos
foreach ($producto in $json.productos) {
    $id = $producto.id
    $url = $producto.imagen
    
    # Saltar si la imagen ya es local
    if ($url -match "^\.\.?/|^images/|^public/") {
        Write-Host "[SKIP] Producto $id : Ya es local" -ForegroundColor Gray
        continue
    }
    
    # Crear nombre de archivo
    if ($url -match "\.webp") { $extension = ".webp" } 
    elseif ($url -match "\.png") { $extension = ".png" }
    else { $extension = ".jpg" }
    
    $filename = "producto-$id$extension"
    $outputPath = Join-Path $outputDir $filename
    
    # Verificar si ya existe
    if (Test-Path $outputPath) {
        Write-Host "[OK] Producto $id : Ya existe ($filename)" -ForegroundColor Yellow
        continue
    }
    
    try {
        Write-Host "[DESCARGANDO] Producto $id" -ForegroundColor Cyan
        
        # Usar User-Agent para evitar bloqueos
        $response = Invoke-WebRequest -Uri $url -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -OutFile $outputPath -ErrorAction Stop
        
        $contador++
        $fileSize = (Get-Item $outputPath).Length
        
        Write-Host "[EXITO] Producto $id : $filename ($fileSize bytes)" -ForegroundColor Green
    }
    catch {
        $errores++
        Write-Host "[ERROR] Producto $id : Error en descarga" -ForegroundColor Red
    }
    
    # Pausa entre descargas
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Green
Write-Host "Descargadas: $contador" -ForegroundColor Green
Write-Host "Errores: $errores" -ForegroundColor $(if($errores -gt 0) {"Red"} else {"Green"})

# Mostrar archivos en carpeta
$archivos = Get-ChildItem $outputDir -ErrorAction SilentlyContinue | Measure-Object
Write-Host "Archivos totales en carpeta: $($archivos.Count)" -ForegroundColor Yellow

Write-Host ""
Write-Host "UBICACION: $outputDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Las imagenes estan listas en:" -ForegroundColor Green
Write-Host "public/images/productos/" -ForegroundColor Yellow

