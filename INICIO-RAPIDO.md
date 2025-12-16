# 🚀 Guía de Inicio Rápido - SkyTrack Airlines

Esta guía te ayudará a poner en funcionamiento la aplicación SkyTrack Airlines paso a paso.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x (incluido con Node.js)

Para verificar que los tienes instalados, abre una terminal y ejecuta:

```bash
node --version
npm --version
```

Si no los tienes instalados, descárgalos desde: https://nodejs.org/

---

## 🎯 Pasos para Iniciar la Aplicación

### Paso 1: Verificar que el archivo `.env` existe

Navega a la carpeta `backend` y verifica que existe el archivo `.env`. Si no existe, créalo con el siguiente contenido:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="skytrack-secret-key-change-in-production"
PORT=3001
```

**Ubicación:** `backend/.env`

---

### Paso 2: Instalar Dependencias del Backend

Abre una terminal y ejecuta:

```bash
cd backend
npm install
```

Espera a que termine la instalación. Esto puede tardar unos minutos.

---

### Paso 3: Configurar la Base de Datos

En la misma terminal (debe estar en la carpeta `backend`), ejecuta:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Esto creará la base de datos SQLite en `backend/prisma/dev.db`.

---

### Paso 4: Poblar la Base de Datos con Datos Iniciales

Ejecuta:

```bash
npm run build
npm run seed
```

Esto creará los usuarios de prueba (admin, operador, usuario) y algunos datos de ejemplo.

---

### Paso 5: Iniciar el Backend

En la misma terminal, ejecuta:

```bash
npm run dev
```

**Deberías ver un mensaje como:**

```
🚀 Servidor corriendo en http://localhost:3001
```

**⚠️ IMPORTANTE:** Deja esta terminal abierta y corriendo. No la cierres.

**Si aparece el error `EADDRINUSE: address already in use :::3001`:**

El puerto 3001 está ocupado. Para solucionarlo:

**En Windows (PowerShell):**

```powershell
# Encontrar el proceso
netstat -ano | findstr :3001

# Detener el proceso (reemplaza <PID> con el número que aparezca)
Stop-Process -Id <PID> -Force
```

**O usa este comando automático:**

```powershell
$proc = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if($proc) { Stop-Process -Id $proc -Force; Write-Host 'Proceso detenido' } else { Write-Host 'Puerto libre' }
```

Luego vuelve a ejecutar `npm run dev`.

---

### Paso 6: Abrir una Nueva Terminal para el Frontend

**Abre una NUEVA terminal** (no cierres la del backend) y ejecuta:

```bash
cd frontend
npm install
```

Espera a que termine la instalación.

---

### Paso 7: Iniciar el Frontend

En la misma terminal del frontend (debe estar en la carpeta `frontend`), ejecuta:

```bash
npm run dev
```

**Deberías ver un mensaje como:**

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**⚠️ IMPORTANTE:** Deja esta terminal también abierta y corriendo.

---

### Paso 8: Abrir la Aplicación en el Navegador

Abre tu navegador web (Chrome, Firefox, Edge, etc.) y ve a:

```
http://localhost:5173
```

---

### Paso 9: Iniciar Sesión

Usa una de estas credenciales para iniciar sesión:

#### 👨‍💼 Administrador

- **Email:** `admin@skytrack.com`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo, puede eliminar vuelos

#### 👨‍✈️ Operador

- **Email:** `operador@skytrack.com`
- **Contraseña:** `operador123`
- **Permisos:** Crear/editar vuelos, gestionar tripulación

#### 👤 Usuario

- **Email:** `usuario@skytrack.com`
- **Contraseña:** `usuario123`
- **Permisos:** Ver vuelos, crear aviones, tomar vuelos

---

## ✅ Verificación

Si todo está funcionando correctamente, deberías ver:

1. ✅ La página de login en `http://localhost:5173`
2. ✅ Poder iniciar sesión con las credenciales
3. ✅ Ver el dashboard o la lista de vuelos después del login

---

## 🔄 Reiniciar la Aplicación

Si necesitas reiniciar la aplicación:

1. **Detén ambos servidores:**

   - En las terminales del backend y frontend, presiona `Ctrl + C`

2. **Vuelve a iniciar:**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev` (en otra terminal)

---

## 🛑 Detener la Aplicación

Para detener los servidores:

1. En cada terminal, presiona `Ctrl + C`
2. O cierra las terminales

---

## 📝 Resumen de Comandos

### Primera vez (configuración inicial):

```bash
# 1. Backend - Instalar dependencias
cd backend
npm install

# 2. Backend - Configurar base de datos
npx prisma generate
npx prisma migrate dev --name init

# 3. Backend - Poblar datos
npm run build
npm run seed

# 4. Frontend - Instalar dependencias
cd ../frontend
npm install
```

### Cada vez que quieras iniciar la aplicación:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

**Navegador:**

```
http://localhost:5173
```

---

## ⚠️ Problemas Comunes

### Error: Puerto 3001 ocupado

**Solución:** Ver sección "Paso 5" arriba.

### Error: Cannot find module '@prisma/client'

**Solución:**

```bash
cd backend
npx prisma generate
```

### Error: La base de datos está vacía

**Solución:**

```bash
cd backend
npm run seed
```

### El frontend no se conecta al backend

**Verifica:**

1. El backend está corriendo en `http://localhost:3001`
2. Puedes acceder a `http://localhost:3001` en el navegador
3. El archivo `frontend/vite.config.ts` tiene el proxy configurado correctamente

### Error 404 al hacer login

**Solución:**

1. Verifica que el backend esté corriendo
2. Recarga la página del navegador (F5)
3. Limpia la caché del navegador (Ctrl + Shift + Delete)

---

## 📞 Estructura de Terminales

Para que la aplicación funcione, necesitas **2 terminales abiertas simultáneamente**:

```
┌─────────────────────────────────────┐
│  Terminal 1: Backend               │
│  cd backend                          │
│  npm run dev                         │
│  → http://localhost:3001            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Terminal 2: Frontend               │
│  cd frontend                         │
│  npm run dev                         │
│  → http://localhost:5173             │
└─────────────────────────────────────┘
```

---

## 🎉 ¡Listo!

Si sigues estos pasos, deberías tener la aplicación funcionando correctamente.

**Recuerda:**

- ✅ Ambas terminales deben estar corriendo simultáneamente
- ✅ El backend debe estar en `http://localhost:3001`
- ✅ El frontend debe estar en `http://localhost:5173`
- ✅ Abre el navegador en `http://localhost:5173`

---

**Última actualización:** Diciembre 2024

