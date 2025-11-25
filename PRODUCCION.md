# 📋 CHECKLIST DE PRODUCCIÓN - CD Onda

## ✅ Preparación Completada

- [x] Archivos de desarrollo eliminados
- [x] Base de datos SQLite de desarrollo eliminada
- [x] Scripts de prueba eliminados
- [x] Archivos de prueba (firmas y justificantes) eliminados
- [x] `.gitignore` actualizado
- [x] Scripts de inicialización creados
- [x] Documentación de deployment creada

## 🔧 Información Necesaria para Producción

### 1. Base de Datos ✅
Ya configurada: PostgreSQL en Neon
```
postgresql://neondb_owner:npg_vHUkKQV0JRa5@ep-damp-voice-ab7pe30b-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Variables de Entorno Requeridas

#### A. NEXTAUTH_SECRET
Un secreto aleatorio para encriptar tokens de sesión.
Puedes generarlo con:
```bash
openssl rand -base64 32
```
O usar cualquier cadena aleatoria larga y segura.

#### B. NEXTAUTH_URL
La URL de tu dominio en producción.
**Ejemplo:**
- `https://cdonda.com`
- `https://www.cdonda.com`
- `https://cdonda.dokploy.app`

#### C. ADMIN_EMAIL
El email del administrador inicial del sistema.
**Ejemplo:** `admin@cdonda.com` o tu email personal

#### D. ADMIN_PASSWORD
Una contraseña segura para el administrador inicial.
**Recomendación:** Mínimo 8 caracteres, con mayúsculas, minúsculas y números.

## 📦 Pasos para Desplegar en Dokploy

### 1. Conectar Repositorio
- Sube el código a GitHub/GitLab
- Conecta el repositorio en Dokploy

### 2. Configurar Variables de Entorno
En Dokploy, añade estas variables:
```env
DATABASE_URL=postgresql://neondb_owner:npg_vHUkKQV0JRa5@ep-damp-voice-ab7pe30b-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=[tu-secreto-generado]
NEXTAUTH_URL=[tu-dominio-completo]
ADMIN_EMAIL=[tu-email]
ADMIN_PASSWORD=[tu-password-segura]
```

### 3. Configurar Build
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Puerto:** 3000
- **Node Version:** 18 o superior

### 4. Después del Primer Deployment
Ejecuta estos comandos para inicializar la base de datos:

```bash
# Aplicar migraciones
npm run db:deploy

# Crear usuario administrador
node scripts/create-admin.js
```

### 5. Configurar Dominio (Opcional)
- En Dokploy, configura tu dominio personalizado
- Actualiza NEXTAUTH_URL con el dominio final

## 🔐 Seguridad

### Contraseñas
- ⚠️ **IMPORTANTE:** Después del primer login, cambia la contraseña del admin desde el panel
- No compartas las credenciales de administrador
- Usa contraseñas únicas y seguras

### Base de Datos
- La base de datos PostgreSQL ya está configurada con SSL
- Los backups se gestionan automáticamente en Neon

### Archivos Subidos
- Las firmas y justificantes se guardan en `storage/`
- En producción, considera usar almacenamiento en la nube (S3, Cloudflare R2, etc.)

## 📊 Monitoreo Post-Deployment

### Verificaciones
- [ ] La página principal carga correctamente
- [ ] El formulario de inscripción funciona
- [ ] Se pueden generar justificantes PDF
- [ ] El panel de administración es accesible
- [ ] Las imágenes de los logos cargan correctamente
- [ ] El carrusel de sponsors funciona

### Acceso Admin
URL: `https://[tu-dominio]/admin/login`
Email: [el que configuraste]
Password: [la que configuraste]

## 🛠️ Mantenimiento

### Actualizar Aplicación
```bash
git pull origin main
npm install
npm run build
npm start
```

### Ver Logs
En Dokploy, revisa los logs en tiempo real para detectar errores.

### Base de Datos
- Accede a Prisma Studio: `npm run db:studio`
- Ver migraciones: `prisma migrate status`

## 📞 Soporte

Si hay problemas durante el deployment:
1. Revisa los logs en Dokploy
2. Verifica que todas las variables de entorno estén configuradas
3. Confirma que la base de datos sea accesible
4. Revisa que el puerto 3000 esté disponible

---

## 🎯 Próximos Pasos Recomendados

Después del deployment inicial:

1. **Optimización de Imágenes**
   - Convierte todas las imágenes .jpg a .webp para mejor rendimiento
   - Especialmente importante: `Diputacion-Castellon.jpg` (muy pesada)

2. **CDN para Assets**
   - Considera usar un CDN para servir imágenes y videos
   - Mejorará significativamente la velocidad de carga

3. **Monitoreo**
   - Configura alertas para errores críticos
   - Monitorea el uso de base de datos

4. **Backups**
   - Configura backups regulares de la base de datos
   - Exporta los justificantes periódicamente

5. **Analytics** (Opcional)
   - Google Analytics o alternativas
   - Seguimiento de conversiones de inscripciones

