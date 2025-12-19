# Script para reiniciar el servidor backend
# Uso: .\restart-dev.ps1

Write-Host "🔄 Reiniciando servidor backend..." -ForegroundColor Cyan
Write-Host ""

# Detener procesos en el puerto 3001
$port = 3001
Write-Host "🔍 Buscando procesos en el puerto $port..." -ForegroundColor Yellow

$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "🛑 Deteniendo procesos existentes en el puerto $port..." -ForegroundColor Yellow
    foreach ($pid in $processes) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "  - Deteniendo proceso: $($process.ProcessName) (PID: $pid)" -ForegroundColor Gray
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "✅ Procesos detenidos" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "ℹ️  No hay procesos en el puerto $port" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
Write-Host "Servidor disponible en: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

npm run dev

