# Configuración de Autenticación - SkyTrack Airlines

## Descripción

Este documento describe la configuración y el uso del sistema de autenticación JWT implementado en los microservicios de SkyTrack Airlines.

## Middleware de Autenticación

### Ubicación

El middleware de autenticación está disponible en cada servicio que lo necesita:

- `services/flights-service/src/middleware/auth.middleware.ts`
- `services/crew-service/src/middleware/auth.middleware.ts`
- `services/planes-service/src/middleware/auth.middleware.ts`
- `services/dashboard-service/src/middleware/auth.middleware.ts`
- `services/shared/middleware/auth.middleware.ts` (versión compartida con características adicionales)

### Funciones Disponibles

#### `authenticate`

Middleware que verifica el token JWT del header `Authorization` y adjunta la información del usuario al objeto `req`.

**Uso:**

```typescript
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

router.get(
  "/protected-route",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    // req.user está disponible aquí
    const userId = req.user?.id;
    const userRole = req.user?.role;
  }
);
```

#### `requireRole(...roles: string[])`

Middleware que requiere que el usuario tenga uno de los roles especificados. Debe usarse después de `authenticate`.

**Uso:**

```typescript
import {
  authenticate,
  requireRole,
  AuthRequest,
} from "../middleware/auth.middleware";

// Solo Admin puede acceder
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    // Solo usuarios con rol ADMIN pueden llegar aquí
  }
);

// Admin o Operador pueden acceder
router.post(
  "/",
  authenticate,
  requireRole("ADMIN", "OPERADOR"),
  async (req: AuthRequest, res: Response) => {
    // Solo usuarios con rol ADMIN u OPERADOR pueden llegar aquí
  }
);
```

#### `optionalAuthenticate`

Middleware que intenta autenticar pero no falla si no hay token. Útil para rutas que tienen funcionalidad diferente según si el usuario está autenticado o no.

**Uso:**

```typescript
import {
  optionalAuthenticate,
  AuthRequest,
} from "../middleware/auth.middleware";

router.get(
  "/public-route",
  optionalAuthenticate,
  async (req: AuthRequest, res: Response) => {
    if (req.user) {
      // Usuario autenticado - mostrar contenido adicional
    } else {
      // Usuario no autenticado - contenido básico
    }
  }
);
```

## Configuración

### Variables de Entorno

Todos los servicios requieren la variable de entorno `JWT_SECRET`:

```env
JWT_SECRET=tu-secret-key-muy-segura-cambiar-en-produccion
```

**⚠️ IMPORTANTE:** En producción, usa un secreto fuerte y único. No uses el valor por defecto 'secret'.

### Docker Compose

En el archivo `docker-compose.yml`, el `JWT_SECRET` se pasa desde el archivo `.env` en la raíz del proyecto:

```yaml
environment:
  JWT_SECRET: ${JWT_SECRET:-your-secret-key-change-in-production}
```

### Desarrollo Local

Cada servicio debe tener un archivo `.env` con:

```env
JWT_SECRET=tu-secret-key-segura
MONGODB_URI=mongodb://localhost:27017/skytrack
PORT=3001  # Cambiar según el servicio
```

## Flujo de Autenticación

1. **Login/Register:**

   - El usuario envía credenciales a `/api/auth/login` o `/api/auth/register`
   - El `auth-service` valida las credenciales
   - Se genera un JWT token que incluye `id`, `email`, y `role`
   - El token se envía al frontend

2. **Peticiones Autenticadas:**

   - El frontend incluye el token en el header: `Authorization: Bearer <token>`
   - El API Gateway reenvía el request al microservicio correspondiente
   - El middleware `authenticate` verifica el token
   - Si es válido, adjunta la información del usuario a `req.user`
   - Si no es válido, retorna error 401

3. **Autorización por Roles:**
   - Después de `authenticate`, se puede usar `requireRole`
   - Se verifica que el rol del usuario esté en la lista permitida
   - Si no tiene permisos, retorna error 403

## Roles Disponibles

- **ADMIN**: Acceso completo, puede eliminar vuelos
- **OPERADOR**: Puede crear/editar vuelos, gestionar tripulación, cambiar estados
- **USUARIO**: Solo lectura de vuelos

## Rutas Protegidas

### Flights Service

- `POST /api/flights` - Requiere autenticación (cualquier rol)
- `PUT /api/flights/:id` - Requiere autenticación (cualquier rol)
- `DELETE /api/flights/:id` - Requiere autenticación + rol ADMIN

### Crew Service

- `POST /api/crew/flight/:flightId` - Requiere autenticación + rol OPERADOR o ADMIN
- `DELETE /api/crew/:id` - Requiere autenticación + rol OPERADOR o ADMIN

### Planes Service

- `POST /api/planes` - Requiere autenticación + rol OPERADOR o ADMIN
- `PUT /api/planes/:id` - Requiere autenticación + rol OPERADOR o ADMIN

### Dashboard Service

- `GET /api/dashboard/active` - Requiere autenticación
- `GET /api/dashboard/next` - Requiere autenticación
- `PUT /api/dashboard/flight/:id/status` - Requiere autenticación + rol OPERADOR o ADMIN

## Ejemplos de Uso

### Endpoint Protegido Simple

```typescript
router.get(
  "/my-data",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    // Obtener datos del usuario
    res.json({ userId });
  }
);
```

### Endpoint Solo para Admin

```typescript
router.delete(
  "/:id",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res: Response) => {
    // Solo Admin puede eliminar
  }
);
```

### Endpoint para Múltiples Roles

```typescript
router.post(
  "/create",
  authenticate,
  requireRole("OPERADOR", "ADMIN"),
  async (req: AuthRequest, res: Response) => {
    // Operador o Admin pueden crear
  }
);
```

## Manejo de Errores

El middleware retorna los siguientes códigos de error:

- **401 Unauthorized**: No hay token, token inválido, o token expirado
- **403 Forbidden**: Token válido pero rol insuficiente

Ejemplo de respuesta de error:

```json
{
  "error": "Insufficient permissions",
  "message": "This action requires one of the following roles: ADMIN"
}
```

## Seguridad

1. **JWT Secret**: Nunca commits el secreto real en el repositorio
2. **HTTPS**: En producción, siempre usa HTTPS para proteger los tokens
3. **Token Expiration**: Los tokens expiran después de 24 horas
4. **Validación**: Siempre valida el token en cada request protegido

## Testing

Para probar endpoints protegidos, incluye el token en el header:

```bash
curl -X GET http://localhost:3000/api/flights \
  -H "Authorization: Bearer <tu-token-aqui>"
```

Obtén un token haciendo login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skytrack.com","password":"admin123"}'
```






