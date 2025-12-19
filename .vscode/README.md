# Configuración de Visual Studio Code

Este proyecto incluye configuraciones optimizadas para trabajar en Visual Studio Code.

## 🚀 Inicio Rápido

### 1. Instalar Extensiones Recomendadas

Cuando abras el proyecto en VS Code, verás una notificación para instalar las extensiones recomendadas. Haz clic en "Install All" o instálalas manualmente desde la pestaña de Extensiones.

### 2. Usar las Tareas Predefinidas

Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac) y escribe "Tasks: Run Task" para ver todas las tareas disponibles:

- **build-backend** - Compila el backend TypeScript
- **build-frontend** - Compila el frontend
- **start-backend** - Inicia el servidor backend
- **start-frontend** - Inicia el servidor frontend
- **prisma-generate** - Genera el cliente de Prisma
- **prisma-migrate** - Ejecuta migraciones de Prisma
- **prisma-studio** - Abre Prisma Studio
- **seed-database** - Pobla la base de datos con datos iniciales
- **test-backend** - Ejecuta los tests del backend
- **install-all** - Instala dependencias de backend y frontend

### 3. Debugging

#### Debug Backend
1. Abre el panel de Debug (`Ctrl+Shift+D`)
2. Selecciona "Debug Backend" o "Debug Backend (tsx watch)"
3. Presiona F5 o haz clic en el botón de play

#### Debug Frontend
1. Abre el panel de Debug (`Ctrl+Shift+D`)
2. Selecciona "Debug Frontend (Chrome)" o "Debug Frontend (Edge)"
3. Presiona F5
4. Se abrirá el navegador con debugging habilitado

#### Debug Full Stack
1. Selecciona "Debug Full Stack"
2. Esto iniciará tanto el backend como el frontend con debugging habilitado

### 4. Atajos Útiles

- `Ctrl+Shift+B` - Ejecuta la tarea de build por defecto (build-backend)
- `F5` - Inicia debugging con la configuración seleccionada
- `Ctrl+F5` - Ejecuta sin debugging
- `Shift+F5` - Detiene el debugging

## 📁 Estructura de Archivos

- **launch.json** - Configuraciones de debugging
- **tasks.json** - Tareas automatizadas
- **settings.json** - Configuración del workspace
- **extensions.json** - Extensiones recomendadas

## 🔧 Configuración Personalizada

Puedes modificar estos archivos según tus preferencias. Los cambios solo afectarán a este workspace.

## 💡 Consejos

1. **Formato Automático**: El código se formatea automáticamente al guardar gracias a Prettier
2. **TypeScript**: VS Code detecta automáticamente las versiones de TypeScript del proyecto
3. **Prisma**: El lenguaje Prisma tiene soporte completo con autocompletado
4. **Terminal Integrada**: Usa la terminal integrada para ejecutar comandos npm

## 🐛 Solución de Problemas

### El debugging no funciona
- Asegúrate de que el backend esté compilado (`npm run build` en backend)
- Verifica que el puerto 3001 (backend) o 5173 (frontend) no estén ocupados

### Las tareas no se ejecutan
- Verifica que tengas Node.js y npm instalados
- Asegúrate de haber ejecutado `npm install` en backend y frontend

### Las extensiones no se instalan
- Intenta instalarlas manualmente desde la pestaña de Extensiones
- Algunas extensiones pueden requerir permisos adicionales

