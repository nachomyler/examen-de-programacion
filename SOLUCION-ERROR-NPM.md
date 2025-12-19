# Solución: Error "Cannot read properties of undefined (reading 'stdin')"

Este error ocurre cuando npm se ejecuta en Git Bash en Windows debido a problemas de compatibilidad.

## ✅ Soluciones

### Solución 1: Usar PowerShell (Recomendado)

En VS Code, cambia la terminal a PowerShell:

1. Abre una nueva terminal: `Ctrl+Shift+`` (backtick)
2. Haz clic en el dropdown de la terminal (donde dice "Git Bash")
3. Selecciona "PowerShell" o "Command Prompt"
4. Ejecuta: `npm run dev`

### Solución 2: Usar el script de PowerShell

Ejecuta directamente el script de PowerShell:

```powershell
cd backend
.\start-dev-watch.ps1
```

O para modo producción (requiere compilación previa):

```powershell
cd backend
.\start-dev.ps1
```

### Solución 3: Usar tsx directamente

En lugar de `npm run dev`, ejecuta:

```bash
npx tsx watch src/index.ts
```

### Solución 4: Configurar npm para usar PowerShell

El archivo `backend/.npmrc` ya está configurado para usar PowerShell. Si el problema persiste:

1. Cierra todas las terminales
2. Abre una nueva terminal en PowerShell
3. Ejecuta: `npm run dev`

### Solución 5: Usar las tareas de VS Code

1. Presiona `Ctrl+Shift+P`
2. Escribe "Tasks: Run Task"
3. Selecciona "start-backend"

Esto ejecutará el comando en PowerShell automáticamente.

## 🔧 Cambios Realizados

1. **Script `dev` actualizado**: Ahora usa `tsx watch` que es más confiable
2. **Archivo `.npmrc`**: Configurado para usar PowerShell por defecto
3. **Scripts PowerShell**: Creados `start-dev.ps1` y `start-dev-watch.ps1`
4. **Configuración VS Code**: Actualizada para usar PowerShell en tareas

## 📝 Notas

- El script `dev` ahora usa `tsx watch` que recarga automáticamente los cambios
- Si necesitas ejecutar el código compilado, usa `npm run dev:prod`
- Las tareas de VS Code ahora usan PowerShell automáticamente

## 🐛 Si el problema persiste

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que npm esté instalado: `npm --version`
3. Limpia la caché de npm: `npm cache clean --force`
4. Reinstala dependencias: `npm install`

