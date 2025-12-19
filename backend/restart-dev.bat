@echo off
echo 🔄 Reiniciando servidor backend...
echo.

echo 🛑 Deteniendo procesos en el puerto 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /PID %%a /F >nul 2>&1
)

timeout /t 1 /nobreak >nul

echo 🚀 Iniciando servidor...
echo Servidor disponible en: http://localhost:3001
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev

