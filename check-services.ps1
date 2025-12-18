# Script para verificar el estado de todos los servicios
Write-Host "=== Verificando estado de servicios SkyTrack ===" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | Select-String "skytrack"

Write-Host ""
Write-Host "2. Verificando conectividad de servicios..." -ForegroundColor Yellow

$services = @(
    @{Name="API Gateway"; URL="http://localhost:3000/api/health"},
    @{Name="Auth Service"; URL="http://localhost:3001/health"},
    @{Name="Flights Service"; URL="http://localhost:3002/health"},
    @{Name="Planes Service"; URL="http://localhost:3003/health"},
    @{Name="Crew Service"; URL="http://localhost:3004/health"},
    @{Name="Dashboard Service"; URL="http://localhost:3005/health"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.URL -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($service.Name): OK" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $($service.Name): No disponible" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "3. Verificando MongoDB..." -ForegroundColor Yellow
$mongoStatus = docker ps --filter "name=skytrack-mongodb" --format "{{.Status}}"
if ($mongoStatus -match "healthy|Up") {
    Write-Host "✅ MongoDB: $mongoStatus" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB: $mongoStatus" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Verificación completada ===" -ForegroundColor Cyan






