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

### Paso 1: Clonar o Navegar al Proyecto

Si tienes el proyecto en un repositorio Git:

```bash
git clone <repository-url>
cd proyecto-de-programacion
```

Si ya tienes el proyecto localmente, simplemente navega a la carpeta:

```bash
cd "C:\Users\Usuario\OneDrive\Desktop\proyecto de programacion"
```

### Paso 2: Instalar Dependencias del Backend

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
npm run build
npm run dev
```

El backend estará disponible en: **http://localhost:3001**

**Nota:** Si el puerto 3001 está ocupado, verás un error. En ese caso:

- Cierra cualquier aplicación que esté usando el puerto 3001
- O cambia el puerto en el archivo `backend/.env` (ej: `PORT=3002`)

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

### Autenticación

#### `POST /api/auth/register`

Registrar nuevo usuario

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nombre Usuario"
}
```

#### `POST /api/auth/login`

Iniciar sesión

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta:**

```json
{
  "token": "jwt-token",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "Nombre Usuario",
    "role": "USUARIO"
  }
}
```

### Vuelos

- `GET /api/flights` - Obtener todos los vuelos (con filtros opcionales: `?origin=MAD&destination=NYC&status=PROGRAMADO`)
- `GET /api/flights/:id` - Obtener un vuelo por ID
- `POST /api/flights` - Crear nuevo vuelo (requiere rol OPERADOR o ADMIN)
- `PUT /api/flights/:id` - Actualizar vuelo (requiere rol OPERADOR o ADMIN)
- `DELETE /api/flights/:id` - Eliminar vuelo (baja lógica, solo ADMIN)

**Headers requeridos:** `Authorization: Bearer <token>`

### Aviones

- `GET /api/planes` - Obtener todos los aviones
- `GET /api/planes/:id` - Obtener un avión por ID
- `POST /api/planes` - Crear nuevo avión
- `PUT /api/planes/:id` - Actualizar avión

**Headers requeridos:** `Authorization: Bearer <token>`

### Tripulación

- `GET /api/crew/flight/:flightId` - Obtener tripulación de un vuelo
- `POST /api/crew/flight/:flightId` - Agregar tripulante a un vuelo (requiere rol OPERADOR o ADMIN)
- `DELETE /api/crew/:id` - Eliminar tripulante (requiere rol OPERADOR o ADMIN)

**Headers requeridos:** `Authorization: Bearer <token>`

### Dashboard

- `GET /api/dashboard` - Obtener datos del dashboard (vuelos activos, próximos vuelos, vuelos de operadores)
- `PUT /api/dashboard/flight/:id/status` - Actualizar estado de un vuelo

**Headers requeridos:** `Authorization: Bearer <token>`

### Vuelos de Usuario

- `POST /api/user-flights/flight/:flightId/take` - Tomar un vuelo (para usuarios)
- `DELETE /api/user-flights/flight/:flightId/release` - Liberar un vuelo (para usuarios)
- `GET /api/user-flights/my-flights` - Obtener mis vuelos tomados
- `GET /api/user-flights/flight/:flightId/check` - Verificar si un vuelo está tomado

**Headers requeridos:** `Authorization: Bearer <token>`

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

### Ejecutar Tests Unitarios

```bash
cd backend
npm test
```

### Ejecutar Tests E2E

```bash
cd backend
npm test -- tests/e2e
```

### Ejecutar Todos los Tests

```bash
cd backend
npm test
```

## 👤 Credenciales de Usuario

Los siguientes usuarios se crean automáticamente con el seed:

### Administrador

- **Email:** `admin@skytrack.com`
- **Contraseña:** `admin123`
- **Rol:** ADMIN
- **Permisos:** Acceso completo, puede eliminar vuelos (baja lógica)

### Operador

- **Email:** `operador@skytrack.com`
- **Contraseña:** `operador123`
- **Rol:** OPERADOR
- **Permisos:** Crear/editar vuelos, gestionar tripulación, gestionar aviones

### Usuario

- **Email:** `usuario@skytrack.com`
- **Contraseña:** `usuario123`
- **Rol:** USUARIO
- **Permisos:** Ver vuelos, crear/editar aviones, tomar vuelos

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