# Guía de Despliegue a Producción

Esta guía te ayudará a desplegar la aplicación CD Onda a producción con la base de datos de Neon PostgreSQL.

## Variables de Entorno Requeridas

Configura las siguientes variables de entorno en tu plataforma de despliegue (Dokploy):

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_vHUkKQV0JRa5@ep-damp-voice-ab7pe30b-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. NEXTAUTH_SECRET
Genera un secreto seguro con:
```bash
openssl rand -base64 32
```

O usa un generador online: https://generate-secret.vercel.app/32

### 3. NEXTAUTH_URL
La URL completa de tu aplicación en producción:
```
https://tu-dominio.com
```

### 4. (Opcional) Variables para Admin por Defecto
```
ADMIN_EMAIL=admin@cdonda.com
ADMIN_PASSWORD=tu-password-seguro
ADMIN_NAME=Administrador CD Onda
```

## Pasos de Despliegue en Dokploy

### 1. Configurar Variables de Entorno

En la configuración de tu aplicación en Dokploy, añade las variables de entorno mencionadas arriba.

### 2. Inicializar la Base de Datos

Después del primer despliegue, necesitas inicializar las tablas en la base de datos. Tienes dos opciones:

#### Opción A: Usando Prisma Migrate (Recomendado)
Conecta a tu servidor o usa el terminal de Dokploy y ejecuta:
```bash
npx prisma migrate deploy
```

#### Opción B: Usando Prisma DB Push
```bash
npx prisma db push
```

### 3. Crear el Admin Inicial

Después de inicializar la base de datos, puedes crear el admin inicial de dos formas:

#### Opción A: Automática (si configuraste ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME)
El admin se creará automáticamente al iniciar la aplicación.

#### Opción B: Manual mediante API
Haz una petición POST a `/api/admin` con:
```json
{
  "email": "admin@cdonda.com",
  "nombre": "Administrador",
  "password": "tu-password-seguro"
}
```

**Nota**: La ruta `/api/admin` requiere autenticación, así que primero necesitarás crear el admin manualmente en la base de datos o usar el script de seed.

### 4. Script de Seed (Alternativa)

Si prefieres usar el script de seed para crear el admin:
```bash
npm run seed
```

Esto creará un admin con:
- Email: `admin@cdonda.com`
- Password: `admin123`

**⚠️ IMPORTANTE**: Cambia estas credenciales inmediatamente después del primer login.

## Verificación Post-Despliegue

1. Verifica que la aplicación carga correctamente
2. Accede a `/admin/login` y prueba el login
3. Verifica que puedes crear inscripciones
4. Verifica que el panel de administración funciona

## Troubleshooting

### Error: "Prisma Client no está inicializado"
- Verifica que `DATABASE_URL` está configurada correctamente
- Asegúrate de que las tablas están creadas (ejecuta `prisma migrate deploy`)

### Error: "Variables de entorno faltantes"
- Verifica que todas las variables de entorno están configuradas en Dokploy
- Reinicia la aplicación después de añadir variables de entorno

### Error de conexión a la base de datos
- Verifica que la URL de conexión es correcta
- Verifica que la base de datos de Neon está activa
- Verifica que el firewall permite conexiones desde tu servidor

## Comandos Útiles

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Aplicar migraciones pendientes
npx prisma migrate deploy

# Abrir Prisma Studio (interfaz visual de la BD)
npx prisma studio

# Generar el cliente de Prisma (se hace automáticamente en postinstall)
npx prisma generate
```

