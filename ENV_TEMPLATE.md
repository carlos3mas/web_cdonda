# Plantilla de Variables de Entorno

Copia este contenido y configúralo en tu plataforma de despliegue (Dokploy) o en un archivo `.env.local` para desarrollo.

## Variables Requeridas

```bash
# Base de datos PostgreSQL (Neon)
DATABASE_URL="postgresql://neondb_owner:npg_vHUkKQV0JRa5@ep-damp-voice-ab7pe30b-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth.js - Genera un secreto seguro con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-secreto-seguro-aqui"

# URL de tu aplicación en producción
NEXTAUTH_URL="https://tu-dominio.com"
```

## Variables Opcionales

```bash
# Configuración del admin por defecto (se crea automáticamente si no existe)
ADMIN_EMAIL="admin@cdonda.com"
ADMIN_PASSWORD="cambiar-en-produccion"
ADMIN_NAME="Administrador CD Onda"
```

## Instrucciones para Dokploy

1. Ve a la configuración de tu aplicación en Dokploy
2. Busca la sección "Variables de Entorno" o "Environment Variables"
3. Añade cada variable una por una:
   - `DATABASE_URL` = `postgresql://neondb_owner:npg_vHUkKQV0JRa5@ep-damp-voice-ab7pe30b-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - `NEXTAUTH_SECRET` = (genera uno nuevo con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = `https://tu-dominio.com`
4. Guarda los cambios
5. Reinicia la aplicación

## Generar NEXTAUTH_SECRET

Ejecuta este comando para generar un secreto seguro:

```bash
openssl rand -base64 32
```

O visita: https://generate-secret.vercel.app/32

