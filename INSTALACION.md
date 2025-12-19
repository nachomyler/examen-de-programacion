# 📦 Guía de Instalación - SkyTrack Airlines

Esta guía te ayudará a instalar y configurar el proyecto en cualquier sistema operativo.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x ([Descargar](https://nodejs.org/))
- **npm** >= 9.x (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

### Verificar Instalación

```bash
node --version  # Debe ser >= 18.0.0
npm --version   # Debe ser >= 9.0.0
```

## 🚀 Instalación Rápida

### Windows

1. **Abrir PowerShell** en la carpeta del proyecto
2. **Ejecutar el script de configuración:**
   ```powershell
   .\setup.ps1
   ```
3. **Iniciar el proyecto:**
   ```powershell
   .\start.ps1
   ```

### Linux / macOS

1. **Dar permisos de ejecución:**
   ```bash
   chmod +x setup.sh start.sh
   ```
2. **Ejecutar el script de configuración:**
   ```bash
   ./setup.sh
   ```
3. **Iniciar el proyecto:**
   ```bash
   ./start.sh
   ```

## 📝 Instalación Manual

Si prefieres instalar manualmente:

### Paso 1: Instalar Dependencias

```bash
# Instalar todas las dependencias
npm run install:all

# O instalar por separado
npm run install:backend
npm run install:frontend
```

### Paso 2: Configurar Backend

```bash
cd backend

# Crear archivo .env (si no existe)
# Windows PowerShell:
@"
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="skytrack-secret-key-change-in-production"
PORT=3001
"@ | Out-File -FilePath .env -Encoding UTF8

# Linux/Mac:
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="skytrack-secret-key-change-in-production"
PORT=3001
EOF

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Compilar
npm run build

# Poblar base de datos
npm run seed

cd ..
```

### Paso 3: Iniciar Servidores

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## 🌐 Acceso a la Aplicación

Una vez iniciados los servidores:

- **Backend API:** http://localhost:3001
- **Frontend:** http://localhost:5173

## 🔧 Scripts Disponibles

### Desde la raíz del proyecto:

- `npm run install:all` - Instala dependencias de backend y frontend
- `npm run build:all` - Compila backend y frontend
- `npm run dev:backend` - Inicia el servidor backend
- `npm run dev:frontend` - Inicia el servidor frontend
- `npm run setup` - Configuración completa (instala, genera Prisma, migra, seed)
- `npm run seed` - Pobla la base de datos con datos iniciales
- `npm run prisma:studio` - Abre Prisma Studio

### Scripts Multiplataforma:

- **Windows:** `setup.ps1`, `start.ps1`
- **Linux/Mac:** `setup.sh`, `start.sh`

## 🐛 Solución de Problemas

### Error: Puerto ocupado

**Windows:**
```powershell
# Detener proceso en puerto 3001
Get-NetTCPConnection -LocalPort 3001 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Linux/Mac:**
```bash
# Detener proceso en puerto 3001
lsof -ti:3001 | xargs kill -9
```

### Error: Permisos de ejecución (Linux/Mac)

```bash
chmod +x setup.sh start.sh
```

### Error: Node.js no encontrado

Asegúrate de tener Node.js instalado:
- Descarga desde: https://nodejs.org/
- Verifica con: `node --version`

### Error: Prisma Client no generado

```bash
cd backend
npm run prisma:generate
```

## 📚 Más Información

- Ver `README.md` para documentación completa
- Ver `INICIO-RAPIDO.md` para guía paso a paso
- Ver `.vscode/README.md` para configuración de VS Code

## ✅ Verificación

Después de la instalación, verifica que todo funciona:

1. Backend responde en http://localhost:3001
2. Frontend carga en http://localhost:5173
3. Puedes iniciar sesión con:
   - Email: `admin@skytrack.com`
   - Password: `admin123`

