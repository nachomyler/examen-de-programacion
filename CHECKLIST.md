# Checklist de Funcionalidad - SkyTrack Airlines

## ✅ Configuración de Autenticación

- [x] Middleware de autenticación creado en todos los servicios
- [x] JWT token configurado correctamente
- [x] Frontend envía tokens en todas las peticiones
- [x] Interceptor de respuesta maneja errores 401
- [x] Rutas protegidas según roles (ADMIN, OPERADOR, USUARIO)

## ✅ Rutas Públicas (sin autenticación)

Las siguientes rutas están disponibles sin autenticación para que la página sea visible:

- [x] `GET /api/flights` - Listar todos los vuelos
- [x] `GET /api/flights/:id` - Ver detalles de un vuelo
- [x] `GET /api/planes` - Listar todos los aviones
- [x] `GET /api/planes/:id` - Ver detalles de un avión
- [x] `GET /api/crew/flight/:flightId` - Ver tripulación de un vuelo
- [x] `POST /api/auth/login` - Iniciar sesión
- [x] `POST /api/auth/register` - Registrarse

## ✅ Rutas Protegidas (requieren autenticación)

### Flights Service

- [x] `POST /api/flights` - Crear vuelo (cualquier usuario autenticado)
- [x] `PUT /api/flights/:id` - Actualizar vuelo (cualquier usuario autenticado)
- [x] `DELETE /api/flights/:id` - Eliminar vuelo (solo ADMIN)

### Planes Service

- [x] `POST /api/planes` - Crear avión (OPERADOR o ADMIN)
- [x] `PUT /api/planes/:id` - Actualizar avión (OPERADOR o ADMIN)

### Crew Service

- [x] `POST /api/crew/flight/:flightId` - Agregar tripulación (OPERADOR o ADMIN)
- [x] `DELETE /api/crew/:id` - Eliminar tripulación (OPERADOR o ADMIN)

### Dashboard Service

- [x] `GET /api/dashboard/active` - Ver vuelos activos (requiere autenticación)
- [x] `GET /api/dashboard/next` - Ver próximo vuelo (requiere autenticación)
- [x] `PUT /api/dashboard/flight/:id/status` - Actualizar estado (OPERADOR o ADMIN)

## ✅ Frontend

- [x] Interceptor de axios agrega token automáticamente
- [x] Interceptor de respuesta maneja errores 401 y redirige al login
- [x] ProtectedRoute protege rutas que requieren autenticación
- [x] Manejo de errores mejorado en todas las páginas
- [x] Páginas muestran estados de carga apropiados

## ✅ Servicios en Ejecución

Para verificar que todo está funcionando:

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs de un servicio
docker-compose logs -f <service-name>

# Verificar health checks
curl http://localhost:3000/api/health
```

## 🔍 Cómo Probar

1. **Iniciar sesión:**

   - Email: `admin@skytrack.com` / Password: `admin123` (Admin)
   - Email: `operador@skytrack.com` / Password: `operador123` (Operador)
   - Email: `usuario@skytrack.com` / Password: `usuario123` (Usuario)

2. **Probar rutas públicas:**

   ```bash
   # Listar vuelos (público)
   curl http://localhost:3000/api/flights

   # Ver un avión (público)
   curl http://localhost:3000/api/planes
   ```

3. **Probar rutas protegidas:**

   ```bash
   # Primero hacer login para obtener token
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@skytrack.com","password":"admin123"}'

   # Usar el token para acceder a rutas protegidas
   curl http://localhost:3000/api/dashboard/active \
     -H "Authorization: Bearer <tu-token-aqui>"
   ```

## ⚠️ Problemas Comunes

1. **Error 401 al cargar la página:**

   - Verificar que el token esté guardado en localStorage
   - Verificar que el token no haya expirado (24 horas)
   - Hacer logout y login nuevamente

2. **Error 403 (Insufficient permissions):**

   - Verificar que el usuario tenga el rol correcto para la acción
   - Solo ADMIN puede eliminar vuelos
   - Solo OPERADOR o ADMIN pueden crear/editar aviones y tripulación

3. **La página no carga:**
   - Verificar que todos los servicios estén corriendo: `docker-compose ps`
   - Verificar que el frontend esté corriendo en `http://localhost:5173`
   - Verificar la consola del navegador para errores

## 📝 Notas

- Las rutas de lectura (GET) son públicas para permitir que cualquier usuario vea la información
- Las rutas de escritura (POST, PUT, DELETE) están protegidas según los roles
- El token JWT expira después de 24 horas
- Todos los servicios comparten el mismo `JWT_SECRET` configurado en `docker-compose.yml`






