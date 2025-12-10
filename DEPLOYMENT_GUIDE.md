# Guía de Despliegue - CD Onda Web

## ✅ Cambios Realizados

### 1. **Migración a Turso Database**
- ✅ Actualizado `prisma/schema.prisma` para usar SQLite/Turso
- ✅ Añadidos campos faltantes: `nombreArchivoFirma`, `derechosImagen`, `comentarios`
- ✅ Configurado adaptador LibSQL para Prisma

### 2. **Correcciones en el Código**
- ✅ Reparado `lib/prisma.ts` para conectar correctamente con Turso
- ✅ Corregido `components/inscripcion/InscripcionForm.tsx`:
  - Añadidas funciones faltantes: `handleChange`, `handleFileChange`
  - Añadida referencia `signatureCanvasRef`
  - Corregida estructura HTML

### 3. **Configuración de Base de Datos**
- ✅ Actualizado `.env` con credenciales de Turso
- ✅ Creado script de migración `scripts/migrate-turso.ts`
- ✅ Ejecutada migración exitosamente

### 4. **Dependencias**
- ✅ Corregidas versiones de Prisma (5.9.0)
- ✅ Instaladas dependencias faltantes:
  - `class-variance-authority`
  - `@radix-ui/react-dialog`
  - `dotenv`

## 🚀 Variables de Entorno para Dockploy

Asegúrate de configurar estas variables en Dockploy (usa **tus propios valores reales**, no los de ejemplo):

```env
# URL de tu base de datos Turso (la encuentras en el panel de Turso)
DATABASE_URL="libsql://TU-NOMBRE-DB.turso.io"

# Token de autenticación de Turso (cópialo desde Turso, NO lo subas nunca a git)
TURSO_AUTH_TOKEN="TU_TURSO_AUTH_TOKEN_AQUI"

# Secret para NextAuth (genera uno aleatorio, por ejemplo con: openssl rand -base64 32)
NEXTAUTH_SECRET="TU_NEXTAUTH_SECRET_AQUÍ"

# URL pública de tu web en producción
NEXTAUTH_URL="https://tu-dominio.com"

NODE_ENV="production"
```

## 📋 Pasos para Desplegar

### 1. Preparar el Repositorio
```bash
git add .
git commit -m "Fix: Migración a Turso y corrección del sistema de inscripciones"
git push origin main
```

### 2. Configurar en Dockploy
1. Ve a tu proyecto en Dockploy
2. Configura las variables de entorno listadas arriba
3. Asegúrate de que `NEXTAUTH_URL` apunte a tu dominio de producción

### 3. Build Commands (si es necesario)
```bash
npm install
npx prisma generate
npm run build
```

### 4. Ejecutar Migración en Producción
Después del primer despliegue, ejecuta:
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/migrate-turso.ts
```

O puedes ejecutar las migraciones manualmente usando Turso CLI:
```bash
turso db shell cdondaweb-cdonda < prisma/migrations/migration.sql
```

## 🔍 Verificación

### Verificar que la aplicación funciona:
1. Accede a tu dominio
2. Ve a la página de inscripción
3. Prueba rellenar el formulario
4. Verifica que se guarda en la base de datos

### Verificar la base de datos:
```bash
# Usando Turso CLI
turso db shell cdondaweb-cdonda
> SELECT COUNT(*) FROM inscripciones;
```

## 🛠️ Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que `DATABASE_URL` y `TURSO_AUTH_TOKEN` estén correctamente configurados
- Asegúrate de que no hay espacios extra en las variables

### Error: "Table does not exist"
- Ejecuta el script de migración: `npm run migrate-turso`
- O ejecuta manualmente las migraciones con Turso CLI

### Error: "Module not found"
- Ejecuta `npm install` para instalar todas las dependencias
- Verifica que `package.json` tenga todas las dependencias necesarias

## 📊 Estructura de la Base de Datos

### Tabla: inscripciones
- `id` - ID único
- `tipoInscripcion` - Tipo de campus (campus-navidad, campus-verano, etc.)
- `nombreJugador` - Nombre del jugador
- `apellidos` - Apellidos
- `fechaNacimiento` - Fecha de nacimiento
- `dni` - DNI del tutor
- `nombreTutor` - Nombre del tutor
- `telefono1` - Teléfono principal
- `telefono2` - Teléfono secundario (opcional)
- `enfermedad` - Enfermedades (opcional)
- `medicacion` - Medicación (opcional)
- `alergico` - Alergias (opcional)
- `numeroSeguridadSocial` - Número de seguridad social
- `pagada` - Estado de pago (boolean)
- `justificantePago` - Ruta al archivo del justificante
- `nombreArchivoJustificante` - Nombre original del archivo
- `firma` - Ruta a la firma digital
- `nombreArchivoFirma` - Nombre del archivo de firma
- `derechosImagen` - Autorización de derechos de imagen (boolean)
- `comentarios` - Comentarios adicionales
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de actualización

## 🎯 Próximos Pasos

1. **Prueba el formulario de inscripción** en producción
2. **Verifica que los archivos se suben correctamente** (justificantes y firmas)
3. **Comprueba el panel de administración** para ver las inscripciones
4. **Configura backups automáticos** de la base de datos Turso

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs de Dockploy
2. Verifica las variables de entorno
3. Comprueba la conexión con Turso
4. Revisa los logs del servidor Next.js

---

**Última actualización:** 10 de Diciembre de 2025
**Estado:** ✅ Sistema de inscripciones funcionando correctamente
