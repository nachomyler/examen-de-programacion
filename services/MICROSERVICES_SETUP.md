# Guía de Configuración de Microservicios

## Arquitectura

Este proyecto utiliza una arquitectura de microservicios con MongoDB como base de datos:

- **API Gateway** (puerto 3000) - Punto de entrada único
- **Auth Service** (puerto 3001) - Autenticación y autorización
- **Flights Service** (puerto 3002) - Gestión de vuelos
- **Planes Service** (puerto 3003) - Gestión de aviones
- **Crew Service** (puerto 3004) - Gestión de tripulación
- **Dashboard Service** (puerto 3005) - Panel de control
- **MongoDB** (puerto 27017) - Base de datos

## Instalación Local (sin Docker)

### Prerrequisitos
- Node.js >= 18
- MongoDB instalado y corriendo localmente

### Pasos

1. **Instalar MongoDB**
```bash
# En macOS con Homebrew
brew install mongodb-community
brew services start mongodb-community

# En Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# O usar MongoDB Atlas (cloud)
```

2. **Instalar dependencias de cada servicio**
```bash
cd services/auth-service && npm install
cd ../flights-service && npm install
cd ../planes-service && npm install
cd ../crew-service && npm install
cd ../dashboard-service && npm install
cd ../api-gateway && npm install
```

3. **Configurar variables de entorno**

Crear `.env` en cada servicio:
```env
PORT=3001  # (cambiar según el servicio)
MONGODB_URI=mongodb://localhost:27017/skytrack
JWT_SECRET=tu-secret-key-segura
```

4. **Ejecutar servicios**

En terminales separadas:
```bash
# Terminal 1
cd services/auth-service && npm run dev

# Terminal 2
cd services/flights-service && npm run dev

# Terminal 3
cd services/planes-service && npm run dev

# Terminal 4
cd services/crew-service && npm run dev

# Terminal 5
cd services/dashboard-service && npm run dev

# Terminal 6
cd services/api-gateway && npm run dev
```

5. **Poblar base de datos con datos iniciales**
```bash
cd services/auth-service && npm run seed
cd ../planes-service && npm run seed
```

## Instalación con Docker

### Prerrequisitos
- Docker
- Docker Compose

### Pasos

1. **Crear archivo `.env` en la raíz del proyecto**
```env
JWT_SECRET=tu-secret-key-muy-segura-cambiar-en-produccion
```

2. **Construir y ejecutar todos los servicios**
```bash
docker-compose up --build
```

3. **Ejecutar seeds (en contenedores)**
```bash
docker-compose exec auth-service npm run seed
docker-compose exec planes-service npm run seed
```

4. **Para detener los servicios**
```bash
docker-compose down
```

5. **Para ver logs de un servicio específico**
```bash
docker-compose logs -f auth-service
```

## Estructura de Base de Datos (MongoDB)

Todos los servicios comparten la misma base de datos MongoDB pero con colecciones separadas:

- `users` - Colección de usuarios (auth-service)
- `flights` - Colección de vuelos (flights-service)
- `planes` - Colección de aviones (planes-service)
- `crewmembers` - Colección de tripulación (crew-service)

## Comunicación entre Servicios

Los servicios se comunican mediante HTTP REST:
- Flights Service → Planes Service (para obtener datos de aviones)
- Crew Service → Flights Service (para verificar existencia de vuelos)
- Dashboard Service → Planes Service (para obtener datos de aviones)

## Credenciales por Defecto

Después de ejecutar los seeds:

- **Admin**: admin@skytrack.com / admin123
- **Operador**: operador@skytrack.com / operador123
- **Usuario**: usuario@skytrack.com / usuario123








