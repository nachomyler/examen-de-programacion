#!/bin/bash
# Script de configuración multiplataforma para Linux/Mac
# Uso: chmod +x setup.sh && ./setup.sh

set -e

echo "🚀 SkyTrack Airlines - Configuración del Proyecto"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versión 18 o superior requerida${NC}"
    echo "Versión actual: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detectado${NC}"
echo ""

# Instalar dependencias
echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
cd backend
npm install
cd ..

echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd frontend
npm install
cd ..

# Configurar backend
echo -e "${YELLOW}🔧 Configurando backend...${NC}"
cd backend

# Crear .env si no existe
if [ ! -f .env ]; then
    echo "Creando archivo .env..."
    cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="skytrack-secret-key-change-in-production"
PORT=3001
EOF
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
fi

# Generar Prisma Client
echo -e "${YELLOW}🔧 Generando cliente de Prisma...${NC}"
npm run prisma:generate

# Ejecutar migraciones
echo -e "${YELLOW}🔧 Ejecutando migraciones...${NC}"
npm run prisma:migrate || npm run prisma:migrate deploy

# Compilar
echo -e "${YELLOW}🔧 Compilando TypeScript...${NC}"
npm run build

# Seed
echo -e "${YELLOW}🌱 Poblando base de datos...${NC}"
npm run seed || echo "Seed ya ejecutado o error (puede continuar)"

cd ..

echo ""
echo -e "${GREEN}✅ Configuración completada exitosamente!${NC}"
echo ""
echo "Para iniciar el proyecto:"
echo "  Terminal 1: npm run dev:backend"
echo "  Terminal 2: npm run dev:frontend"
echo ""

