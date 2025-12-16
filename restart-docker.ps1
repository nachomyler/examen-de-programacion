# Script para reiniciar Docker Desktop
Write-Host "Deteniendo Docker Desktop..." -ForegroundColor Yellow
Stop-Process -Name "Docker Desktop" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host "Iniciando Docker Desktop..." -ForegroundColor Green
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

Write-Host "Esperando a que Docker Desktop se inicie..." -ForegroundColor Yellow
$timeout = 60
$elapsed = 0
while ($elapsed -lt $timeout) {
    try {
        docker ps 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Docker Desktop está listo!" -ForegroundColor Green
            exit 0
        }
    } catch {
        # Continuar esperando
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
    Write-Host "." -NoNewline
}

Write-Host ""
Write-Host "Timeout: Docker Desktop puede estar tardando más de lo esperado." -ForegroundColor Yellow
Write-Host "Por favor, espera unos segundos más y verifica manualmente con 'docker ps'" -ForegroundColor Yellow

