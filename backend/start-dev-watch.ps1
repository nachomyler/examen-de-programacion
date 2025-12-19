# Script para iniciar el servidor backend con watch (tsx)
# Uso: .\start-dev-watch.ps1

Write-Host "🚀 Iniciando servidor backend con watch mode..." -ForegroundColor Green
Write-Host "Servidor disponible en: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Los cambios se recargarán automáticamente" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Usar npm run dev que ya tiene npx configurado
npm run dev

