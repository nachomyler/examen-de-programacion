# Script para iniciar todos los servicios localmente (sin Docker)
# Requiere MongoDB corriendo localmente en mongodb://localhost:27017

Write-Host "=== SkyTrack Airlines - Inicio Local de Servicios ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Asegúrate de que MongoDB esté corriendo en mongodb://localhost:27017" -ForegroundColor Yellow
Write-Host ""

# Función para iniciar un servicio
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$Port
    )
    
    Write-Host "Iniciando $ServiceName en puerto $Port..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Crear archivo .env en la raíz si no existe
$rootPath = $PSScriptRoot
$envFile = Join-Path $rootPath ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creando archivo .env..." -ForegroundColor Yellow
    "JWT_SECRET=tu-secret-key-muy-segura-cambiar-en-produccion" | Out-File -FilePath $envFile -Encoding UTF8
}

$servicesPath = Join-Path $rootPath "services"

# Iniciar servicios en orden
Start-Service -ServiceName "MongoDB" -ServicePath "N/A" -Port "27017"
Start-Service -ServiceName "Auth Service" -ServicePath (Join-Path $servicesPath "auth-service") -Port "3001"
Start-Sleep -Seconds 3
Start-Service -ServiceName "Planes Service" -ServicePath (Join-Path $servicesPath "planes-service") -Port "3003"
Start-Sleep -Seconds 2
Start-Service -ServiceName "Flights Service" -ServicePath (Join-Path $servicesPath "flights-service") -Port "3002"
Start-Sleep -Seconds 2
Start-Service -ServiceName "Crew Service" -ServicePath (Join-Path $servicesPath "crew-service") -Port "3004"
Start-Sleep -Seconds 2
Start-Service -ServiceName "Dashboard Service" -ServicePath (Join-Path $servicesPath "dashboard-service") -Port "3005"
Start-Sleep -Seconds 2
Start-Service -ServiceName "API Gateway" -ServicePath (Join-Path $servicesPath "api-gateway") -Port "3000"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== Todos los servicios están iniciando ===" -ForegroundColor Cyan
Write-Host "Servicios disponibles en:" -ForegroundColor Yellow
Write-Host "  - API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host "  - Auth Service: http://localhost:3001" -ForegroundColor White
Write-Host "  - Flights Service: http://localhost:3002" -ForegroundColor White
Write-Host "  - Planes Service: http://localhost:3003" -ForegroundColor White
Write-Host "  - Crew Service: http://localhost:3004" -ForegroundColor White
Write-Host "  - Dashboard Service: http://localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "Para poblar datos iniciales:" -ForegroundColor Yellow
Write-Host "  cd services/auth-service && npm run seed" -ForegroundColor White
Write-Host "  cd services/planes-service && npm run seed" -ForegroundColor White






