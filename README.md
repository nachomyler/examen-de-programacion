# SkyTrack Airlines - Sistema de Gestión de Vuelos

Sistema completo de gestión de vuelos para la aerolínea ficticia SkyTrack Airlines. Implementado con **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, **SQLite** y frontend **React** con **TypeScript**.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución](#ejecución)
- [Acceso a la Aplicación](#acceso-a-la-aplicación)
- [Endpoints de la API](#endpoints-de-la-api)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Pruebas](#pruebas)
- [Credenciales de Usuario](#credenciales-de-usuario)
- [Solución de Problemas](#solución-de-problemas)
- [Estructura del Proyecto](#estructura-del-proyecto)

## ✨ Características

- ✅ **CRUD completo** de vuelos, aviones y tripulación
- ✅ **Sistema de autenticación** con roles (Admin, Operador, Usuario)
- ✅ **Filtrado de vuelos** por origen, destino y estado
- ✅ **Baja lógica (soft delete)** de vuelos (solo Admin)
- ✅ **Panel de Estado de Vuelos** en tiempo real
- ✅ **Gestión de aviones** con tipos (Privado/Económico), aerolíneas y clases de servicio
- ✅ **Gestión de tripulación** por vuelo (Piloto, Copiloto, Auxiliar)
- ✅ **Asignación de vuelos** para usuarios
- ✅ **Tests unitarios y E2E**

## 🛠 Tecnologías

### Backend

- **Node.js** con **Express**
- **TypeScript**
- **Prisma ORM** - ORM para SQLite
- **SQLite** - Base de datos
- **JWT** para autenticación
- **bcryptjs** para hashing de contraseñas
- **Jest** para testing

### Frontend

- **React 18** con **TypeScript**
- **Vite** como bundler
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Context API** para manejo de estado

## 📦 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x
- **npm** >= 9.x (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación y Configuración

### Opción 1: Instalación Automática (Recomendada)

**Windows:**
```powershell
.\setup.ps1
```

**Linux / macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

Esto instalará todas las dependencias y configurará el proyecto automáticamente.

### Opción 2: Instalación Manual

### Paso 1: Clonar o Navegar al Proyecto

Si tienes el proyecto en un repositorio Git:

```bash
git clone <repository-url>
cd examen-de-programacion
```

Si ya tienes el proyecto localmente, simplemente navega a la carpeta del proyecto.

### Paso 2: Instalar Dependencias

Desde la raíz del proyecto:

```bash
npm run install:all
```

O instalar por separado:

```bash
cd backend
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="skytrack-secret-key-change-in-production"
PORT=3001
```

**Nota:** Si el archivo `.env` ya existe, verifica que tenga estos valores.

### Paso 4: Configurar la Base de Datos

Genera el cliente de Prisma y ejecuta las migraciones:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

Esto creará el archivo `backend/prisma/dev.db` (base de datos SQLite).

### Paso 5: Poblar la Base de Datos con Datos Iniciales

Ejecuta el script de seed para crear usuarios y datos de ejemplo:

```bash
cd backend
npm run build
npm run seed
```

**Nota:** El script `seed` requiere que el código esté compilado. Si `npm run seed` no funciona, ejecuta primero `npm run build`.

### Paso 6: Instalar Dependencias del Frontend

Abre una nueva terminal y navega a la carpeta del frontend:

```bash
cd frontend
npm install
```

## ▶️ Ejecución

### Iniciar el Backend

En la terminal, desde la carpeta `backend/`:

```bash
cd backend
npm run dev
```

El backend estará disponible en: **http://localhost:3001**

**Nota importante:** El script `dev` ahora **detiene automáticamente** cualquier proceso que esté usando el puerto 3001 antes de iniciar. Si aún tienes problemas, usa los scripts de reinicio.

**Scripts útiles disponibles:**
- `npm run dev` - **Ahora detiene procesos automáticamente** antes de iniciar
- `restart-dev.ps1` / `restart-dev.sh` - Detiene procesos y reinicia el servidor (más información)
- `kill-port.ps1` / `kill-port.bat` - Solo detiene procesos en el puerto 3001
- `start-dev-watch.ps1` / `start-dev-watch.bat` - Inicia con watch mode

**Nota:** El script `dev` ahora ejecuta tsx directamente con `node`, evitando problemas de política de ejecución. Compila y ejecuta automáticamente, recargando los cambios.

**Si encuentras errores:**

1. **Error "Cannot read properties of undefined (reading 'stdin')"** (Git Bash):
   - Cambia a PowerShell o Command Prompt en VS Code (dropdown de la terminal)
   - O ejecuta: `start-dev-watch.bat`

2. **Error "ejecución de scripts está deshabilitada"** (PowerShell):
   - Todos los scripts ahora ejecutan directamente con `node` evitando problemas de política
   - Scripts actualizados: `dev`, `test`, `prisma:*`, `seed`
   - Si persiste, usa los scripts batch: `start-dev-watch.bat`, `restart-dev.bat`
   - Ver `SOLUCION-POWERSHELL.md` para más detalles

3. **Error "EADDRINUSE: address already in use :::3001"**:
   - El puerto 3001 está ocupado por otra instancia del servidor
   - **Solución automática:** El script `dev` ahora detiene procesos automáticamente. Si persiste:
     - Ejecuta `.\restart-dev.ps1` (Windows) o `./restart-dev.sh` (Linux/Mac)
     - O ejecuta `.\kill-port.ps1` y luego `npm run dev`
   - **Manual (Windows):** `taskkill /PID <PID> /F` (reemplaza `<PID>` con el número del proceso)
   - **Manual (Linux/Mac):** `lsof -ti:3001 | xargs kill -9`
   - Ver `SOLUCION-PUERTO-OCUPADO.md` para más detalles

Ver `SOLUCION-ERROR-NPM.md` para más detalles.

**Nota:** Si el puerto 3001 está ocupado, verás el error `EADDRINUSE`. Soluciones:

1. **Detener el proceso automáticamente:**
   ```powershell
   .\kill-port.ps1
   ```
   O en Command Prompt:
   ```cmd
   kill-port.bat
   ```

2. **Detener manualmente:**
   ```powershell
   # Encontrar el proceso
   netstat -ano | findstr :3001
   # Detener (reemplaza <PID> con el número que aparezca)
   taskkill /PID <PID> /F
   ```

3. **O cambiar el puerto** en el archivo `backend/.env` (ej: `PORT=3002`)

### Iniciar el Frontend

Abre una **nueva terminal** y navega a la carpeta `frontend/`:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: **http://localhost:5173** (o el puerto que Vite asigne)

**Importante:** Ambos servidores (backend y frontend) deben estar ejecutándose simultáneamente.

## 🌐 Acceso a la Aplicación

1. Abre tu navegador web
2. Ve a: **http://localhost:5173** (o el puerto que muestre Vite)
3. Inicia sesión con las credenciales proporcionadas (ver sección [Credenciales de Usuario](#credenciales-de-usuario))

## 📡 Endpoints de la API

La API está disponible en: **http://localhost:3001/api**

**Nota:** Todos los endpoints (excepto `/api/auth/register` y `/api/auth/login`) requieren autenticación mediante el header:
```
Authorization: Bearer <token>
```

### 🔐 Autenticación

#### `POST /api/auth/register`

Registrar nuevo usuario (rol por defecto: USUARIO)

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nombre Usuario"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "Nombre Usuario",
    "role": "USUARIO"
  }
}
```

#### `POST /api/auth/login`

Iniciar sesión

**Request:**
```json
{
  "email": "admin@skytrack.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@skytrack.com",
    "name": "Administrador",
    "role": "ADMIN"
  }
}
```

**Errores:**
- `401` - Credenciales inválidas
- `400` - Campos faltantes

### ✈️ Vuelos

#### `GET /api/flights`

Obtener todos los vuelos (con filtros opcionales)

**Query Parameters:**
- `origin` (opcional): Filtrar por origen (ej: `?origin=España`)
- `destination` (opcional): Filtrar por destino (ej: `?destination=México`)
- `status` (opcional): Filtrar por estado (ej: `?status=PROGRAMADO`)

**Ejemplo:**
```
GET /api/flights?origin=España&destination=México&status=PROGRAMADO
```

**Response (200):**
```json
[
  {
    "id": "1",
    "origin": "España",
    "destination": "México",
    "date": "2024-12-20",
    "time": "10:30",
    "status": "PROGRAMADO",
    "planeId": "1",
    "plane": {
      "id": "1",
      "name": "Boeing 737-800",
      "model": "737-800",
      "capacity": 189
    },
    "crewMembers": [],
    "creator": {
      "id": 1,
      "name": "Administrador",
      "email": "admin@skytrack.com",
      "role": "ADMIN"
    }
  }
]
```

#### `GET /api/flights/:id`

Obtener un vuelo por ID

**Response (200):** Mismo formato que el array anterior, pero un solo objeto

**Errores:**
- `404` - Vuelo no encontrado

#### `POST /api/flights`

Crear nuevo vuelo (requiere rol **OPERADOR** o **ADMIN**)

**Request:**
```json
{
  "origin": "España",
  "destination": "México",
  "date": "2024-12-25",
  "time": "14:30",
  "planeId": "1",
  "status": "PROGRAMADO"
}
```

**Response (201):** Objeto de vuelo creado

**Errores:**
- `400` - Campos faltantes
- `403` - Sin permisos (requiere OPERADOR o ADMIN)
- `404` - Avión no encontrado

#### `PUT /api/flights/:id`

Actualizar vuelo (requiere rol **OPERADOR** o **ADMIN**)

**Request:**
```json
{
  "origin": "Francia",
  "destination": "Reino Unido",
  "date": "2024-12-26",
  "time": "16:00",
  "status": "EMBARCANDO"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos enviados.

**Response (200):** Objeto de vuelo actualizado

**Errores:**
- `404` - Vuelo no encontrado
- `403` - Sin permisos

#### `DELETE /api/flights/:id`

Eliminar vuelo (baja lógica, solo **ADMIN**)

**Response (200):**
```json
{
  "message": "Flight deleted successfully"
}
```

**Errores:**
- `404` - Vuelo no encontrado
- `403` - Solo ADMIN puede eliminar vuelos

### 🛫 Aviones

#### `GET /api/planes`

Obtener todos los aviones

**Response (200):**
```json
[
  {
    "id": "1",
    "name": "Boeing 737-800",
    "model": "737-800",
    "capacity": 189,
    "status": "DISPONIBLE",
    "type": "ECONOMICO",
    "airline": "SkyTrack Airlines",
    "serviceClass": "Económico Premium 2-4-2"
  }
]
```

#### `POST /api/planes`

Crear nuevo avión

**Request:**
```json
{
  "name": "Airbus A320",
  "model": "A320",
  "capacity": 180,
  "status": "DISPONIBLE",
  "type": "ECONOMICO",
  "airline": "SkyTrack Airlines",
  "serviceClass": "Clase Ejecutiva 2-2"
}
```

#### `PUT /api/planes/:id`

Actualizar avión

**Request:** Campos opcionales (mismo formato que POST)

### 👥 Tripulación

#### `GET /api/crew/flight/:flightId`

Obtener tripulación de un vuelo

**Response (200):**
```json
[
  {
    "id": "1",
    "name": "Juan Pérez",
    "role": "PILOTO",
    "flightId": "1"
  }
]
```

#### `POST /api/crew/flight/:flightId`

Agregar tripulante a un vuelo (requiere rol **OPERADOR** o **ADMIN**)

**Request:**
```json
{
  "name": "Juan Pérez",
  "role": "PILOTO"
}
```

**Roles válidos:** `PILOTO`, `COPILOTO`, `AUXILIAR`

#### `DELETE /api/crew/:id`

Eliminar tripulante (requiere rol **OPERADOR** o **ADMIN**)

**Response (200):** Mensaje de éxito

### 📊 Dashboard

#### `GET /api/dashboard`

Obtener datos del dashboard

**Response (200):**
```json
{
  "currentFlights": [...],
  "nextFlights": [...],
  "operatorFlights": [...],
  "myTakenFlights": [1, 2, 3]
}
```

#### `PUT /api/dashboard/flight/:id/status`

Actualizar estado de un vuelo

**Request:**
```json
{
  "status": "EN_VUELO"
}
```

**Estados válidos:** `PROGRAMADO`, `EMBARCANDO`, `EN_VUELO`, `ATERRIZADO`, `CANCELADO`

### 🎫 Vuelos de Usuario

#### `POST /api/user-flights/flight/:flightId/take`

Tomar un vuelo (para usuarios con rol **USUARIO**)

**Response (200):** Mensaje de éxito

**Errores:**
- `400` - Vuelo ya tomado por el usuario
- `403` - Solo usuarios pueden tomar vuelos

#### `DELETE /api/user-flights/flight/:flightId/release`

Liberar un vuelo (cancelar reserva)

**Response (200):** Mensaje de éxito

#### `GET /api/user-flights/my-flights`

Obtener mis vuelos tomados

**Response (200):** Array de vuelos

#### `GET /api/user-flights/flight/:flightId/check`

Verificar si un vuelo está tomado por el usuario actual

**Response (200):**
```json
{
  "taken": true
}
```

## 📝 Funcionalidades Implementadas

### ✅ 1. Listado de Vuelos + Filtros

- Listado completo de vuelos disponibles
- Filtros por:
  - Origen (nombres completos de países)
  - Destino (nombres completos de países)
  - Estado del vuelo (PROGRAMADO, EMBARCANDO, EN_VUELO, ATERRIZADO, CANCELADO)
- Los vuelos con baja lógica no aparecen en el listado

### ✅ 2. Baja Lógica de Vuelo

- Solo usuarios con rol **ADMIN** pueden realizar baja lógica de vuelos
- Implementa soft delete (campo `deletedAt`)
- Los vuelos eliminados no aparecen en las consultas normales

### ✅ 3. Crear y Editar Vuelos

- Formularios para crear y editar vuelos
- Campos requeridos:
  - Origen
  - Destino
  - Fecha
  - Hora
  - ID del avión
  - Estado del vuelo
- Solo usuarios con rol **OPERADOR** o **ADMIN** pueden crear/editar vuelos

### ✅ 4. Gestión de Aviones

- **Usuarios** pueden:
  - Crear aviones
  - Editar datos de aviones
  - Asignar aviones a vuelos (desde la lista de vuelos)
  - Ver estado del avión (DISPONIBLE, EN_VUELO, EN_MANTENIMIENTO)
- Campos adicionales:
  - Tipo: Privado o Económico
  - Aerolínea: Selección de 16 aerolíneas predeterminadas
  - Clase de Servicio: Diseño interno del avión (10 opciones predeterminadas)

### ✅ 5. Gestión de Tripulación

- **Operadores** y **Administradores** pueden:
  - Asignar tripulación a vuelos
  - Quitar tripulantes
  - Ver roles: PILOTO, COPILOTO, AUXILIAR
- Disponible en:
  - Página de Gestión de Aviones (para vuelos asignados a cada avión)
  - Panel de Estado de Vuelos

### ✅ 6. Panel de Estado de Vuelos

- Vista tipo "panel de aeropuerto" que muestra:
  - Vuelos en curso (EMBARCANDO o EN_VUELO)
  - Próximos vuelos a despegar
  - Vuelos creados por operadores/administradores
  - Estado actualizado (simulado con botones: Iniciar Embarque, Iniciar Vuelo, Aterrizar)
- Los usuarios pueden "tomar" vuelos creados por operadores/administradores
- Indicador "✓ EN CURSO" para vuelos tomados por el usuario actual

### ✅ 7. Unit Test

- Test de filtrado de vuelos:
  - Filtrar por estado devuelve solo los que coinciden
  - Filtrar por origen excluye otros aeropuertos
  - Vuelos con baja lógica no aparecen

### ✅ 8. Test E2E

- Flujo completo de usuario:
  1. Entrar al sitio
  2. Ver listado de vuelos
  3. Filtrar por estado
  4. Seleccionar un vuelo
  5. Ver tripulación asignada
  6. Cambiar el estado del vuelo (simulado)
  7. Asignar o quitar tripulación

## 🧪 Pruebas

El proyecto incluye tests unitarios y tests end-to-end (E2E) usando Jest.

### Prerrequisitos

Asegúrate de que:
1. El backend esté compilado: `npm run build`
2. La base de datos esté configurada y con datos de prueba: `npm run seed`

### Ejecutar Todos los Tests

```bash
cd backend
npm test
```

Esto ejecutará todos los tests (unitarios y E2E) y mostrará un resumen de resultados.

### Ejecutar Solo Tests Unitarios

```bash
cd backend
npm test -- tests/unit
```

O ejecutar un archivo específico:
```bash
npm test -- tests/unit/flight.test.ts
```

### Ejecutar Solo Tests E2E

```bash
cd backend
npm test -- tests/e2e
```

### Ejecutar Tests en Modo Watch

Para ejecutar tests en modo watch (se re-ejecutan al cambiar archivos):

```bash
cd backend
npm test -- --watch
```

### Ejecutar Tests con Cobertura

Para ver el reporte de cobertura de código:

```bash
cd backend
npm test -- --coverage
```

### Tests Disponibles

#### Tests Unitarios (`tests/unit/`)

- **`flight.test.ts`**: Tests de filtrado de vuelos
  - Filtrar por estado
  - Filtrar por origen
  - Excluir vuelos con baja lógica

#### Tests E2E (`tests/e2e/`)

- **`flight-flow.test.ts`**: Flujo completo de usuario
  - Ver listado de vuelos
  - Filtrar por estado
  - Ver detalles de vuelo
  - Gestionar tripulación
  - Cambiar estado de vuelo

### Estructura de Tests

```
backend/
├── tests/
│   ├── unit/              # Tests unitarios
│   │   └── flight.test.ts
│   └── e2e/               # Tests end-to-end
│       └── flight-flow.test.ts
└── src/
    └── __tests__/         # Tests adicionales
```

### Notas sobre Tests

- Los tests usan la misma base de datos de desarrollo (`dev.db`)
- Los tests E2E requieren que el servidor esté corriendo o se inicie automáticamente
- Algunos tests pueden requerir datos específicos en la base de datos (ejecuta `npm run seed` si fallan)

## 👤 Credenciales de Usuario

Los siguientes usuarios se crean automáticamente al ejecutar `npm run seed` en el backend:

### 🔑 Administrador (ADMIN)

**Credenciales:**
- **Email:** `admin@skytrack.com`
- **Contraseña:** `admin123`
- **Rol:** `ADMIN`

**Permisos completos:**
- ✅ Ver todos los vuelos
- ✅ Crear vuelos
- ✅ Editar vuelos
- ✅ **Eliminar vuelos** (baja lógica) - Solo ADMIN
- ✅ Gestionar tripulación
- ✅ Cambiar estado de vuelos
- ✅ Gestionar aviones
- ❌ No puede tomar vuelos (solo usuarios)

**Uso recomendado:** Para pruebas de funcionalidades administrativas y eliminación de vuelos.

### 🔑 Operador (OPERADOR)

**Credenciales:**
- **Email:** `operador@skytrack.com`
- **Contraseña:** `operador123`
- **Rol:** `OPERADOR`

**Permisos:**
- ✅ Ver todos los vuelos
- ✅ Crear vuelos
- ✅ Editar vuelos
- ❌ No puede eliminar vuelos
- ✅ Gestionar tripulación
- ✅ Cambiar estado de vuelos
- ✅ Gestionar aviones
- ❌ No puede tomar vuelos (solo usuarios)

**Uso recomendado:** Para pruebas de creación y edición de vuelos, gestión de tripulación.

### 🔑 Usuario (USUARIO)

**Credenciales:**
- **Email:** `usuario@skytrack.com`
- **Contraseña:** `usuario123`
- **Rol:** `USUARIO`

**Permisos:**
- ✅ Ver vuelos
- ❌ No puede crear/editar vuelos
- ❌ No puede eliminar vuelos
- ❌ No puede gestionar tripulación
- ❌ No puede cambiar estado de vuelos
- ✅ Gestionar aviones
- ✅ **Tomar vuelos** (reservar) - Solo usuarios

**Uso recomendado:** Para pruebas de funcionalidades de usuario final y reserva de vuelos.

### 📝 Notas Importantes

1. **Creación automática:** Estos usuarios se crean automáticamente al ejecutar `npm run seed`
2. **Si los usuarios no existen:** Ejecuta `npm run seed` en la carpeta `backend/`
3. **Cambiar contraseñas:** Las contraseñas están hasheadas con bcrypt. Para cambiarlas, modifica `backend/src/seed.ts` y vuelve a ejecutar el seed
4. **Nuevos usuarios:** Puedes crear nuevos usuarios desde la interfaz web usando el registro (`/register`), pero tendrán rol `USUARIO` por defecto

## 🔐 Roles y Permisos

| Acción                  | Usuario | Operador | Admin |
| ----------------------- | ------- | -------- | ----- |
| Ver vuelos              | ✅      | ✅       | ✅    |
| Crear vuelos            | ❌      | ✅       | ✅    |
| Editar vuelos           | ❌      | ✅       | ✅    |
| Eliminar vuelos         | ❌      | ❌       | ✅    |
| Gestionar tripulación   | ❌      | ✅       | ✅    |
| Cambiar estado de vuelo | ❌      | ✅       | ✅    |
| Gestionar aviones       | ✅      | ✅       | ✅    |
| Tomar vuelos            | ✅      | ❌       | ❌    |

## 🔧 Solución de Problemas

### Error: Puerto 3001 ya está en uso

**Solución:**

1. En Windows (PowerShell):

   ```powershell
   netstat -ano | findstr :3001
   # Anota el PID y luego:
   taskkill /PID <PID> /F
   ```

2. O cambia el puerto en `backend/.env`:
   ```env
   PORT=3002
   ```

### Error: Cannot find module '@prisma/client'

**Solución:**

```bash
cd backend
npx prisma generate
```

### Error: Prisma schema validation

**Solución:**

```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev --name init
npm run seed
```

### Error: EADDRINUSE o EPERM (OneDrive)

Si el proyecto está en OneDrive, puede haber problemas de sincronización. **Solución recomendada:**

1. Mueve el proyecto fuera de OneDrive a una carpeta local (ej: `C:\proyectos\`)
2. O pausa temporalmente la sincronización de OneDrive

### El frontend no se conecta al backend

**Verifica:**

1. El backend está corriendo en `http://localhost:3001`
2. El archivo `frontend/vite.config.ts` tiene el proxy configurado:
   ```typescript
   proxy: {
     '/api': 'http://localhost:3001'
   }
   ```

### Error al ejecutar npm run seed

**Solución:**

```bash
cd backend
npm run build
npm run seed
```

### La base de datos está vacía

**Solución:**

```bash
cd backend
npm run seed
```

Si no funciona, verifica que el archivo `backend/prisma/dev.db` existe. Si no existe:

```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

## 📁 Estructura del Proyecto

```
proyecto-de-programacion/
├── backend/                    # Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   ├── migrations/        # Migraciones de Prisma
│   │   └── dev.db             # Base de datos SQLite
│   ├── src/
│   │   ├── controllers/       # Controladores de la API
│   │   ├── routes/            # Rutas de Express
│   │   ├── middleware/        # Middleware (auth, etc.)
│   │   ├── types/             # Tipos TypeScript
│   │   ├── __tests__/         # Tests unitarios
│   │   ├── seed.ts            # Script de seed
│   │   └── index.ts           # Punto de entrada
│   ├── tests/                 # Tests E2E
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Servicios de API
│   │   ├── context/           # Context API (Auth)
│   │   ├── types/             # Tipos TypeScript
│   │   └── main.tsx           # Punto de entrada
│   ├── vite.config.ts         # Configuración de Vite
│   └── package.json
│
└── README.md                   # Este archivo
```

## 📚 Scripts Disponibles

### Backend

- `npm run dev` - Ejecutar servidor en modo desarrollo
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar servidor compilado
- `npm test` - Ejecutar tests
- `npm run prisma:generate` - Generar cliente de Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio (interfaz visual de BD)
- `npm run seed` - Poblar base de datos con datos de prueba

### Frontend

- `npm run dev` - Servidor de desarrollo (Vite)
- `npm run build` - Build de producción
- `npm run preview` - Preview del build de producción

## 🛠️ Desarrollo en Visual Studio Code

Este proyecto incluye configuración completa para VS Code:

### Extensiones Recomendadas

Al abrir el proyecto, VS Code sugerirá instalar extensiones recomendadas:
- TypeScript y JavaScript
- Prettier (formateo de código)
- ESLint (linting)
- Prisma (soporte para schema.prisma)
- React snippets
- GitLens

### Debugging

El proyecto incluye configuraciones de debugging predefinidas:

1. **Debug Backend**: Depura el servidor backend con breakpoints
2. **Debug Frontend**: Depura la aplicación React en Chrome/Edge
3. **Debug Full Stack**: Ejecuta ambos con debugging simultáneamente

Para usar:
- Abre el panel de Debug (`Ctrl+Shift+D`)
- Selecciona una configuración
- Presiona `F5` para iniciar

### Tareas Automatizadas

Accede a las tareas con `Ctrl+Shift+P` → "Tasks: Run Task":

- **build-backend** - Compila el backend
- **start-backend** - Inicia el servidor backend
- **start-frontend** - Inicia el servidor frontend
- **prisma-generate** - Genera cliente Prisma
- **prisma-migrate** - Ejecuta migraciones
- **seed-database** - Pobla la base de datos
- **test-backend** - Ejecuta tests

### Formato Automático

El código se formatea automáticamente al guardar gracias a Prettier. La configuración está en `.prettierrc`.

Ver `.vscode/README.md` para más detalles sobre la configuración de VS Code.

## 🚀 Inicio Rápido (Resumen)

```bash
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Configurar base de datos
npx prisma generate
npx prisma migrate dev --name init

# 3. Poblar base de datos
npm run build
npm run seed

# 4. Iniciar backend (Terminal 1)
npm run dev

# 5. Instalar dependencias del frontend (Terminal 2)
cd ../frontend
npm install

# 6. Iniciar frontend (Terminal 2)
npm run dev

# 7. Abrir navegador en http://localhost:5173
```

## 🤝 Contribución

Este es un proyecto educativo. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado como proyecto académico para SkyTrack Airlines.

---

**Nota:** Este es un sistema de demostración. Para uso en producción, considere implementar medidas de seguridad adicionales, validaciones más estrictas y manejo de errores mejorado.
#   e x a m e n - d e - p r o g r a m a c i o n 
 
 