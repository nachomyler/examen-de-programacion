# Solución: Error "EADDRINUSE: address already in use :::3001"

Este error ocurre cuando el puerto 3001 ya está siendo usado por otra instancia del servidor.

## ✅ Soluciones Rápidas

### Solución 1: Usar el Script Automático (Más Fácil) ✅

Ejecuta uno de estos scripts desde la carpeta `backend`:

**PowerShell:**
```powershell
.\kill-port.ps1
```

**Command Prompt:**
```cmd
kill-port.bat
```

Esto detendrá automáticamente cualquier proceso usando el puerto 3001.

### Solución 2: Detener Manualmente

1. **Encontrar el proceso:**
   ```powershell
   netstat -ano | findstr :3001
   ```
   
   Verás algo como:
   ```
   TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       7044
   ```
   
   El último número (7044) es el PID del proceso.

2. **Detener el proceso:**
   ```powershell
   taskkill /PID 7044 /F
   ```
   
   Reemplaza `7044` con el PID que encontraste.

### Solución 3: Cambiar el Puerto

Si prefieres usar otro puerto:

1. Edita `backend/.env`:
   ```env
   PORT=3002
   ```

2. Ejecuta `npm run dev` nuevamente

3. El servidor estará en `http://localhost:3002`

### Solución 4: Cerrar Terminales Anteriores

Si ejecutaste `npm run dev` en otra terminal:
1. Ve a esa terminal
2. Presiona `Ctrl+C` para detener el servidor
3. Vuelve a ejecutar `npm run dev` en la nueva terminal

## 🔍 Verificar si el Puerto Está Libre

Para verificar si el puerto está libre:

```powershell
netstat -ano | findstr :3001
```

Si no muestra nada, el puerto está libre.

## 💡 Prevención

Para evitar este problema:
- Siempre detén el servidor con `Ctrl+C` antes de cerrar la terminal
- Usa `kill-port.ps1` o `kill-port.bat` antes de iniciar el servidor si no estás seguro

## 📝 Notas

- El script `kill-port.ps1` funciona en PowerShell
- El script `kill-port.bat` funciona en Command Prompt y PowerShell
- Ambos scripts son seguros y solo afectan procesos en el puerto 3001

