# Script para verificar todos los endpoints de API
$API_URL = "http://localhost:3000"

# Función para hacer requests
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Token = $null,
        [string]$Body = $null
    )
    
    $url = "$API_URL$Endpoint"
    $headers = @{ "Content-Type" = "application/json" }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    try {
        $params = @{
            Uri             = $url
            Method          = $Method
            Headers         = $headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params["Body"] = $Body
        }
        
        $response = Invoke-WebRequest @params
        return @{
            Status = "OK"
            Code   = $response.StatusCode
            Data   = $response.Content | ConvertFrom-Json
        }
    }
    catch {
        $errorResponse = $null
        try {
            $errorResponse = $_.Exception.Response.Content | ConvertFrom-Json
        }
        catch {}
        
        return @{
            Status    = "ERROR"
            Code      = $_.Exception.Response.StatusCode.Value
            Error     = $_.Exception.Message
            ErrorData = $errorResponse
        }
    }
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Testing API Endpoints" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "[1] Health Check" -ForegroundColor Yellow
$health = Test-Endpoint -Method Get -Endpoint "/api/v1/health"
Write-Host "Status: $($health.Status)" -ForegroundColor Green
Write-Host "Code: $($health.Code)" -ForegroundColor Gray
Write-Host ""

# 2. Login (para obtener token)
Write-Host "[2] Admin Login" -ForegroundColor Yellow
$loginBody = @{
    email    = "admin@inventory.com"
    password = "admin123"
} | ConvertTo-Json
$login = Test-Endpoint -Method Post -Endpoint "/api/v1/auth/login" -Body $loginBody
Write-Host "Status: $($login.Status)" -ForegroundColor Green
Write-Host "Code: $($login.Code)" -ForegroundColor Gray

$token = $null
if ($login.Data -and $login.Data.access_token) {
    $token = $login.Data.access_token
    $userName = $login.Data.user.nombre
    Write-Host "Token obtenido: $($token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "Usuario: $userName (Rol: $($login.Data.user.rol))" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host "Error obteniendo token" -ForegroundColor Red
    Write-Host "Respuesta: $($login.Data | ConvertTo-Json)" -ForegroundColor Red
    Write-Host ""
}

# 3. Get Productos
Write-Host "[3] Get Productos" -ForegroundColor Yellow
if ($token) {
    $productos = Test-Endpoint -Method Get -Endpoint "/api/v1/products" -Token $token
    Write-Host "Status: $($productos.Status)" -ForegroundColor Green
    Write-Host "Code: $($productos.Code)" -ForegroundColor Gray
    if ($productos.Data -is [array]) {
        Write-Host "Productos encontrados: $($productos.Data.Length)" -ForegroundColor Cyan
        Write-Host "Primeros 3 productos:" -ForegroundColor Gray
        $productos.Data | Select-Object -First 3 | ForEach-Object {
            Write-Host "  - $($_.nombre) (ID: $($_.id.Substring(0, 8))...)" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "Respuesta: $($productos.Data | ConvertTo-Json)" -ForegroundColor Gray
    }
    Write-Host ""
}
else {
    Write-Host "No hay token, saltando este endpoint" -ForegroundColor Yellow
    Write-Host ""
}

# 4. Get Órdenes
Write-Host "[4] Get Ordenes" -ForegroundColor Yellow
if ($token) {
    $orders = Test-Endpoint -Method Get -Endpoint "/api/v1/orders" -Token $token
    Write-Host "Status: $($orders.Status)" -ForegroundColor Green
    Write-Host "Code: $($orders.Code)" -ForegroundColor Gray
    if ($orders.Data -is [array]) {
        Write-Host "Ordenes encontradas: $($orders.Data.Length)" -ForegroundColor Cyan
    }
    else {
        Write-Host "Respuesta: $($orders.Data | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
    }
    Write-Host ""
}
else {
    Write-Host "No hay token, saltando este endpoint" -ForegroundColor Yellow
    Write-Host ""
}

# 5. Get Usuarios
Write-Host "[5] Get Usuarios" -ForegroundColor Yellow
if ($token) {
    $users = Test-Endpoint -Method Get -Endpoint "/api/v1/users" -Token $token
    Write-Host "Status: $($users.Status)" -ForegroundColor Green
    Write-Host "Code: $($users.Code)" -ForegroundColor Gray
    if ($users.Data -is [array]) {
        Write-Host "Usuarios encontrados: $($users.Data.Length)" -ForegroundColor Cyan
    }
    else {
        Write-Host "Respuesta: $($users.Data | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
    }
    Write-Host ""
}
else {
    Write-Host "No hay token, saltando este endpoint" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Verificacion completada" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
