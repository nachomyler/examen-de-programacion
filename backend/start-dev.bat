@echo off
echo 🔨 Compilando TypeScript...
call npm run build

if errorlevel 1 (
    echo ❌ Error al compilar. Verifica los errores arriba.
    pause
    exit /b 1
)

echo 🚀 Iniciando servidor backend...
echo Servidor disponible en: http://localhost:3001
echo Presiona Ctrl+C para detener el servidor
echo.

node dist/index.js

