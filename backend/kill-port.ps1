# Script para detener procesos en el puerto 3001
# Uso: .\kill-port.ps1 [puerto]
# Ejemplo: .\kill-port.ps1 3001

param(
    [int]$Port = 3001
)

Write-Host "🔍 Buscando procesos en el puerto $Port..." -ForegroundColor Cyan
Write-Host ""

$processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    foreach ($pid in $processes) {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "🛑 Deteniendo proceso: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  ✅ Proceso detenido" -ForegroundColor Green
        }
    }
    Write-Host ""
    Write-Host "✅ Puerto $Port liberado exitosamente" -ForegroundColor Green
    Write-Host "Ahora puedes ejecutar: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "ℹ️  No se encontraron procesos en el puerto $Port" -ForegroundColor Green
    Write-Host "El puerto está libre, puedes ejecutar: npm run dev" -ForegroundColor Cyan
}

