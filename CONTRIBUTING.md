# 🤝 Guía de Contribución - SkyTrack Airlines

Esta guía te ayudará a configurar el proyecto en cualquier computadora y entorno de desarrollo.

## 🖥️ Compatibilidad

Este proyecto está diseñado para funcionar en:

- ✅ **Windows** (10, 11)
- ✅ **Linux** (Ubuntu, Debian, Fedora, etc.)
- ✅ **macOS** (10.15+)
- ✅ **Visual Studio Code** (cualquier versión reciente)
- ✅ **Cualquier editor** que soporte TypeScript

## 🚀 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd examen-de-programacion
```

### 2. Instalación Automática

**Windows:**
```powershell
.\setup.ps1
```

**Linux / macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Verificar Instalación

```bash
# Verificar Node.js
node --version  # Debe ser >= 18.0.0

# Verificar npm
npm --version   # Debe ser >= 9.0.0

# Verificar que las dependencias estén instaladas
ls backend/node_modules  # Debe existir
ls frontend/node_modules  # Debe existir
```

## 💻 Desarrollo en Visual Studio Code

### Configuración Automática

1. Abre el proyecto en VS Code
2. VS Code detectará automáticamente las extensiones recomendadas
3. Haz clic en "Install All" cuando aparezca la notificación

### Características Incluidas

- ✅ **Debugging** configurado para backend y frontend
- ✅ **Tareas** predefinidas para build, dev, test, etc.
- ✅ **Formato automático** con Prettier
- ✅ **Linting** con ESLint
- ✅ **Soporte completo** para TypeScript y Prisma

### Usar las Tareas

1. Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
2. Escribe "Tasks: Run Task"
3. Selecciona la tarea deseada:
   - `build-backend` - Compila el backend
   - `start-backend` - Inicia el servidor backend
   - `start-frontend` - Inicia el servidor frontend
   - `prisma-generate` - Genera cliente Prisma
   - `seed-database` - Pobla la base de datos

### Usar Debugging

1. Abre el panel de Debug (`Ctrl+Shift+D`)
2. Selecciona una configuración:
   - "Debug Backend" - Depura el backend
   - "Debug Frontend" - Depura el frontend en Chrome
   - "Debug Full Stack" - Depura ambos simultáneamente
3. Presiona `F5` para iniciar

## 🔧 Scripts Disponibles

### Desde la Raíz del Proyecto

```bash
# Instalación
npm run install:all          # Instala todas las dependencias
npm run setup                # Configuración completa

# Desarrollo
npm run dev:backend          # Inicia backend
npm run dev:frontend         # Inicia frontend

# Build
npm run build:all            # Compila todo
npm run build:backend        # Compila backend
npm run build:frontend       # Compila frontend

# Base de datos
npm run prisma:generate      # Genera cliente Prisma
npm run prisma:migrate       # Ejecuta migraciones
npm run prisma:studio        # Abre Prisma Studio
npm run seed                 # Pobla base de datos

# Testing
npm run test:backend         # Ejecuta tests del backend
```

### Scripts Multiplataforma

**Windows:**
- `setup.ps1` - Configuración completa
- `start.ps1` - Inicia backend y frontend
- `backend\restart-dev.ps1` - Reinicia el backend
- `backend\kill-port.ps1` - Libera el puerto 3001

**Linux / macOS:**
- `setup.sh` - Configuración completa
- `start.sh` - Inicia backend y frontend
- `backend\restart-dev.sh` - Reinicia el backend (si existe)

## 📁 Estructura del Proyecto

```
examen-de-programacion/
├── backend/              # Backend API (Express + TypeScript + Prisma)
│   ├── src/             # Código fuente
│   ├── prisma/          # Schema y migraciones
│   ├── dist/            # Código compilado
│   └── package.json     # Dependencias del backend
│
├── frontend/            # Frontend (React + TypeScript + Vite)
│   ├── src/            # Código fuente
│   ├── dist/           # Build de producción
│   └── package.json    # Dependencias del frontend
│
├── .vscode/            # Configuración de VS Code
│   ├── launch.json     # Configuraciones de debugging
│   ├── tasks.json      # Tareas automatizadas
│   └── settings.json   # Configuración del workspace
│
├── package.json        # Scripts principales del proyecto
├── setup.ps1          # Script de configuración (Windows)
├── setup.sh           # Script de configuración (Linux/Mac)
├── start.ps1          # Script de inicio (Windows)
├── start.sh           # Script de inicio (Linux/Mac)
└── README.md          # Documentación principal
```

## 🐛 Solución de Problemas Comunes

### Error: Puerto ocupado

**Windows:**
```powershell
.\backend\kill-port.ps1
```

**Linux/Mac:**
```bash
lsof -ti:3001 | xargs kill -9
```

### Error: Permisos (Linux/Mac)

```bash
chmod +x setup.sh start.sh
```

### Error: Node.js no encontrado

Instala Node.js desde https://nodejs.org/ (versión 18 o superior)

### Error: Prisma Client no generado

```bash
cd backend
npm run prisma:generate
```

## 📝 Convenciones de Código

- **TypeScript** estricto habilitado
- **Prettier** para formateo automático
- **ESLint** para linting
- **Commits** descriptivos en español o inglés

## ✅ Checklist Antes de Contribuir

- [ ] Node.js >= 18 instalado
- [ ] Dependencias instaladas (`npm run install:all`)
- [ ] Base de datos configurada (`npm run setup`)
- [ ] Servidor backend funciona (`npm run dev:backend`)
- [ ] Frontend funciona (`npm run dev:frontend`)
- [ ] Tests pasan (`npm run test:backend`)

## 📚 Recursos Adicionales

- [README.md](README.md) - Documentación completa
- [INSTALACION.md](INSTALACION.md) - Guía de instalación detallada
- [.vscode/README.md](.vscode/README.md) - Configuración de VS Code

