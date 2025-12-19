# Script para iniciar el proyecto (Windows PowerShell)
# Uso: .\start.ps1

Write-Host "🚀 Iniciando SkyTrack Airlines" -ForegroundColor Green
Write-Host ""

# Función para matar procesos en un puerto
function Kill-Port {
    param([int]$Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($processes) {
        foreach ($pid in $processes) {
            Write-Host "🛑 Deteniendo proceso en puerto $Port (PID: $pid)" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Seconds 1
    }
}

# Detener procesos existentes
Kill-Port -Port 3001
Kill-Port -Port 5173

# Iniciar backend
Write-Host "📡 Iniciando backend..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm run dev
}

# Esperar un poco
Start-Sleep -Seconds 2

# Iniciar frontend
Write-Host "🌐 Iniciando frontend..." -ForegroundColor Green
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm run dev
}

Write-Host ""
Write-Host "✅ Servidores iniciados" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener ambos servidores" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para ver los logs:" -ForegroundColor Yellow
Write-Host "  Receive-Job -Job $backendJob" -ForegroundColor White
Write-Host "  Receive-Job -Job $frontendJob" -ForegroundColor White
Write-Host ""

# Mantener el script corriendo
try {
    while ($true) {
        Start-Sleep -Seconds 1
        Receive-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    }
} finally {
    Write-Host "🛑 Deteniendo servidores..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
}

