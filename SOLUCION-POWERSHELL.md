# Solución: Error de Política de Ejecución de PowerShell

Este error ocurre porque PowerShell tiene restringida la ejecución de scripts por seguridad.

## ✅ Solución Aplicada (Ya Funciona) ✅

El script `dev` ahora ejecuta tsx directamente con `node` evitando completamente PowerShell. Simplemente ejecuta:

```powershell
npm run dev
```

O usa el script batch (funciona en cualquier terminal):

```cmd
start-dev-watch.bat
```

### Solución 2: Cambiar Política de Ejecución (Temporal)

Abre PowerShell como Administrador y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego ejecuta `npm run dev` normalmente.

**Nota:** Esto permite ejecutar scripts locales pero requiere confirmación para scripts remotos.

### Solución 3: Cambiar Política Solo para Esta Sesión

Ejecuta esto antes de `npm run dev`:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm run dev
```

Esto solo afecta la sesión actual de PowerShell.

### Solución 4: Usar Command Prompt en lugar de PowerShell

En VS Code:
1. Abre una nueva terminal (`Ctrl+Shift+``)
2. Cambia a "Command Prompt" en el dropdown
3. Ejecuta: `npm run dev`

### Solución 5: Usar el Script Compilado

Si prefieres no cambiar la política:

```powershell
npm run build
npm run dev:prod
```

Esto compila primero y luego ejecuta el código compilado.

## 🔧 Cambios Realizados

- **Script `dev` actualizado**: Ahora usa `npx tsx` que evita problemas de política
- **Script `seed` actualizado**: También usa `npx tsx`

## 📝 Recomendación

**Opción más segura:** Usar `npx` (ya implementado) - no requiere cambiar políticas.

**Opción más práctica:** Cambiar la política a `RemoteSigned` para el usuario actual (Solución 2).

## ⚠️ Nota de Seguridad

La política `RemoteSigned` es segura porque:
- Permite ejecutar scripts locales sin firma
- Requiere firma para scripts descargados de internet
- Solo afecta a tu usuario, no al sistema completo

