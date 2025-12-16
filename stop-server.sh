#!/bin/bash

echo "Deteniendo servidor en puerto 3001..."

# Encontrar y detener proceso en puerto 3001 (Linux/Mac)
PID=$(lsof -ti:3001)

if [ -z "$PID" ]; then
    echo "❌ No se encontró ningún proceso en el puerto 3001"
else
    echo "Proceso encontrado: $PID"
    kill -9 $PID
    echo "✅ Proceso detenido exitosamente"
fi

sleep 2
echo ""
echo "Verificando puerto 3001..."
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⚠️ El puerto aún está en uso"
else
    echo "✅ Puerto 3001 liberado"
fi

