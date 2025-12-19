#!/bin/bash
# Script para reiniciar el servidor backend (Linux/Mac)
# Uso: chmod +x restart-dev.sh && ./restart-dev.sh

PORT=3001

echo "🔄 Reiniciando servidor backend..."
echo ""

# Detener procesos en el puerto
echo "🔍 Buscando procesos en el puerto $PORT..."
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ ! -z "$PID" ]; then
    echo "🛑 Deteniendo procesos existentes en el puerto $PORT..."
    echo "  - PID: $PID"
    kill -9 $PID 2>/dev/null
    echo "✅ Procesos detenidos"
    sleep 2
else
    echo "ℹ️  No hay procesos en el puerto $PORT"
fi

echo ""
echo "🚀 Iniciando servidor..."
echo "Servidor disponible en: http://localhost:$PORT"
echo "Presiona Ctrl+C para detener el servidor"
echo ""

npm run dev

