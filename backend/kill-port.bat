@echo off
echo 🔍 Buscando procesos en el puerto 3001...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo 🛑 Deteniendo proceso PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo ✅ Proceso detenido (si existía)
echo.
echo Ahora puedes ejecutar: npm run dev
pause

