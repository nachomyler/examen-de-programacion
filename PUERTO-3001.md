# Solución: Puerto 3001 en Uso

## 🔍 Problema

El puerto 3001 ya está en uso, generalmente porque:

1. Docker está ejecutando el `auth-service` en ese puerto
2. Hay un proceso Node.js local corriendo en ese puerto

## ✅ Soluciones

### Opción 1: Detener Docker (si quieres ejecutar localmente)

**Detener solo el auth-service:**

```bash
docker-compose stop auth-service
```

**Detener todos los servicios de Docker:**

```bash
docker-compose down
```

### Opción 2: Usar Docker (Recomendado)

En lugar de ejecutar el servidor localmente, usa Docker:

```bash
# Iniciar todos los servicios
docker-compose up

# O en segundo plano
docker-compose up -d
```

### Opción 3: Cambiar el puerto del servidor local

Si necesitas ejecutar el servidor localmente en un puerto diferente:

1. Crear archivo `.env` en la carpeta del servicio:

```env
PORT=3002
```

2. O modificar el código para usar otro puerto:

```typescript
const PORT = process.env.PORT || 3002; // Cambiar a 3002 u otro puerto disponible
```

### Opción 4: Usar el script stop-server.bat

Ejecuta el script `stop-server.bat` que detendrá cualquier proceso local en el puerto 3001:

```bash
.\stop-server.bat
```

**Nota:** Este script solo detiene procesos locales, no contenedores de Docker.

## 🔧 Verificar qué está usando el puerto

```bash
# Windows
netstat -ano | findstr :3001

# Ver detalles del proceso
tasklist | findstr <PID>
```

## 📝 Recomendación

Si estás desarrollando, usa **Docker Compose** para mantener todos los servicios sincronizados y evitar conflictos de puertos. Solo ejecuta servicios localmente si necesitas debuggear un servicio específico.






