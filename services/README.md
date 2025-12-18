# SkyTrack Airlines - Arquitectura de Microservicios

Esta carpeta contiene los microservicios de SkyTrack Airlines.

## Estructura

```
services/
├── auth-service/          # Servicio de Autenticación (puerto 3001)
├── flights-service/       # Servicio de Vuelos (puerto 3002)
├── planes-service/        # Servicio de Aviones (puerto 3003)
├── crew-service/          # Servicio de Tripulación (puerto 3004)
├── dashboard-service/     # Servicio de Dashboard (puerto 3005)
└── api-gateway/           # API Gateway (puerto 3000)
```

## Tecnologías

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT para autenticación
- Docker para containerización








