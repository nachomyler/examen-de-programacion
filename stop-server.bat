@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Deteniendo servidor en puerto 3001...
echo ========================================
echo.

REM Buscar procesos en puerto 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    set PID=%%a
    echo Proceso encontrado en puerto 3001: !PID!
    echo Deteniendo proceso...
    taskkill /PID !PID! /F
    if !errorlevel! equ 0 (
        echo ✅ Proceso !PID! detenido exitosamente
    ) else (
        echo ❌ No se pudo detener el proceso !PID!
    )
)

timeout /t 2 >nul
echo.
echo Verificando puerto 3001...
netstat -ano | findstr :3001 >nul
if errorlevel 1 (
    echo ✅ Puerto 3001 liberado
) else (
    echo ⚠️ El puerto aún está en uso
    echo.
    echo Nota: Si estás usando Docker, el puerto puede estar ocupado por un contenedor.
    echo Ejecuta: docker-compose down
)

echo.
pause

