# Solución: Scripts de PowerShell Bloqueados

Todos los scripts del proyecto han sido actualizados para funcionar correctamente en PowerShell sin necesidad de cambiar políticas de ejecución.

## ✅ Scripts Actualizados

Todos los scripts ahora ejecutan directamente con `node` en lugar de usar scripts `.ps1`:

### Backend

- ✅ `npm run dev` - Usa `node start-dev.js` (detiene procesos automáticamente)
- ✅ `npm test` - Usa `node node_modules/jest/bin/jest.js`
- ✅ `npm run prisma:generate` - Usa `node node_modules/prisma/build/index.js generate`
- ✅ `npm run prisma:migrate` - Usa `node node_modules/prisma/build/index.js migrate dev`
- ✅ `npm run prisma:studio` - Usa `node node_modules/prisma/build/index.js studio`
- ✅ `npm run seed` - Usa `node node_modules/tsx/dist/cli.mjs dist/seed.js`

### Scripts Adicionales

- `npm run test:watch` - Ejecuta tests en modo watch
- `npm run test:coverage` - Genera reporte de cobertura

## 🚀 Uso Normal

Simplemente ejecuta los comandos normalmente:

```powershell
cd backend
npm run dev      # Inicia el servidor
npm test         # Ejecuta tests
npm run prisma:studio  # Abre Prisma Studio
```

Todos funcionan sin problemas de política de ejecución.

## 🔧 Cómo Funciona

Los scripts ahora:
1. Usan `node` directamente para ejecutar los binarios
2. Evitan scripts `.ps1` que requieren políticas especiales
3. Funcionan en PowerShell, CMD, Git Bash, Linux y Mac

## 📝 Notas

- No necesitas cambiar políticas de ejecución
- Los scripts son multiplataforma
- Funcionan en cualquier terminal
- Compatible con VS Code

## ✅ Verificación

Para verificar que todo funciona:

```powershell
cd backend
npm test  # Debe ejecutar los tests sin errores
npm run dev  # Debe iniciar el servidor sin errores
```

