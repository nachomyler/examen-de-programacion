#!/bin/bash
# Script para iniciar el proyecto (Linux/Mac)
# Uso: chmod +x start.sh && ./start.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Iniciando SkyTrack Airlines${NC}"
echo ""

# Función para matar procesos en un puerto
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}🛑 Deteniendo proceso en puerto $port (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
}

# Detener procesos existentes
kill_port 3001
kill_port 5173

# Iniciar backend
echo -e "${GREEN}📡 Iniciando backend...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Esperar un poco
sleep 2

# Iniciar frontend
echo -e "${GREEN}🌐 Iniciando frontend...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Servidores iniciados${NC}"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"

# Esperar a que se presione Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

