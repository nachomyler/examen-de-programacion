@echo off
echo 🚀 Iniciando servidor backend con watch mode...
echo Servidor disponible en: http://localhost:3001
echo Los cambios se recargarán automáticamente
echo Presiona Ctrl+C para detener el servidor
echo.

node node_modules\tsx\dist\cli.mjs watch src\index.ts

