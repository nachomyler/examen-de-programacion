# Script para iniciar el servidor backend en modo desarrollo
# Uso: .\start-dev.ps1

Write-Host "🔨 Compilando TypeScript..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar. Verifica los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
Write-Host "Servidor disponible en: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

node dist/index.js

