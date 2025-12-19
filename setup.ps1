# Script de configuración para Windows PowerShell
# Uso: .\setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 SkyTrack Airlines - Configuración del Proyecto" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detectado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar versión de Node.js
$nodeMajorVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeMajorVersion -lt 18) {
    Write-Host "❌ Node.js versión 18 o superior requerida" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Instalar dependencias
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Configurar backend
Write-Host "🔧 Configurando backend..." -ForegroundColor Yellow
Set-Location backend

# Crear .env si no existe
if (-not (Test-Path .env)) {
    Write-Host "Creando archivo .env..." -ForegroundColor Yellow
    @"
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="skytrack-secret-key-change-in-production"
PORT=3001
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
}

# Generar Prisma Client
Write-Host "🔧 Generando cliente de Prisma..." -ForegroundColor Yellow
npm run prisma:generate

# Ejecutar migraciones
Write-Host "🔧 Ejecutando migraciones..." -ForegroundColor Yellow
try {
    npm run prisma:migrate
} catch {
    npm run prisma:migrate deploy
}

# Compilar
Write-Host "🔧 Compilando TypeScript..." -ForegroundColor Yellow
npm run build

# Seed
Write-Host "🌱 Poblando base de datos..." -ForegroundColor Yellow
try {
    npm run seed
} catch {
    Write-Host "⚠️  Seed ya ejecutado o error (puede continuar)" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "✅ Configuración completada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el proyecto:" -ForegroundColor Cyan
Write-Host "  Terminal 1: npm run dev:backend" -ForegroundColor White
Write-Host "  Terminal 2: npm run dev:frontend" -ForegroundColor White
Write-Host ""

