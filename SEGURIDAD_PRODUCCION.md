# ✅ Seguridad para Producción - CD Onda

## 🔒 Medidas de Seguridad Implementadas

### 1. Autenticación en APIs
Todas las APIs sensibles ahora requieren autenticación:

- ✅ `/api/inscripciones` (GET) - Solo admins pueden ver inscripciones
- ✅ `/api/inscripciones/[id]` (GET/PATCH/DELETE) - Protegido
- ✅ `/api/inscripciones/stats` - Solo para admins
- ✅ `/api/plantillas` (GET/POST/DELETE) - Solo admins pueden gestionar plantillas
- ✅ `/api/admin` (GET/POST) - Solo admins pueden crear otros admins
- ✅ `/api/justificantes/[filename]` - Nueva API segura para servir archivos privados

**Público (sin autenticación):**
- `/api/inscripciones` (POST) - Crear inscripción (con rate limiting)

### 2. Archivos Privados
Los justificantes de pago ya NO están en la carpeta pública:

**Antes:** `public/justificantes/` ❌ (accesible por cualquiera)
**Ahora:** `storage/justificantes/` ✅ (privado, solo vía API con autenticación)

### 3. Rate Limiting
Implementado control de peticiones por IP:

- **Inscripciones:** Máximo 5 por hora (evita spam)
- **Subida de archivos:** Máximo 10 por minuto
- **APIs generales:** Máximo 60 peticiones por minuto

### 4. Validación Avanzada de Archivos

**Magic Numbers:** Valida el contenido real del archivo, no solo la extensión
- Detecta si un archivo `.jpg` es realmente un JPG
- Previene archivos maliciosos disfrazados

**Tipos permitidos:**
- JPEG/JPG
- PNG
- WEBP
- PDF

**Límites:**
- Justificantes: 5 MB máximo
- Plantillas PDF: 10 MB máximo

### 5. Variables de Entorno
Validación automática al iniciar la aplicación:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Si falta alguna, la app no inicia en producción.

---

## 📋 Checklist Pre-Producción

### Antes de Desplegar:

- [ ] **Variables de Entorno**
  - [ ] Configurar `DATABASE_URL` con la base de datos de producción
  - [ ] Generar `NEXTAUTH_SECRET` seguro (mínimo 32 caracteres aleatorios)
  - [ ] Configurar `NEXTAUTH_URL` con tu dominio real

- [ ] **Base de Datos**
  - [ ] Ejecutar `npx prisma db push` en producción
  - [ ] Crear al menos un usuario administrador
  - [ ] Hacer backup de la base de datos

- [ ] **Archivos**
  - [ ] Crear carpeta `storage/justificantes/` con permisos correctos
  - [ ] Crear carpeta `public/templates/` para plantillas PDF
  - [ ] Configurar permisos: solo el servidor puede escribir

- [ ] **Migraciones de Datos Existentes**
  - [ ] Si tienes justificantes en `public/justificantes/`, **moverlos** a `storage/justificantes/`
  - [ ] Actualizar rutas en la base de datos (quitar `/justificantes/` del path)

- [ ] **Seguridad del Servidor**
  - [ ] Configurar HTTPS (obligatorio)
  - [ ] Configurar CORS si es necesario
  - [ ] Configurar firewall
  - [ ] Límite de tamaño de peticiones en Nginx/Apache

- [ ] **Monitorización**
  - [ ] Configurar logs de errores
  - [ ] Monitorizar uso de disco (archivos subidos)
  - [ ] Alertas de rate limiting excesivo

### Recomendaciones Adicionales:

1. **Backups Automáticos**
   - Base de datos: Diario
   - Archivos (`storage/`): Semanal

2. **Rotación de Secrets**
   - Cambiar `NEXTAUTH_SECRET` cada 6 meses
   - Forzar logout de todos los admins

3. **Auditoría**
   - Revisar logs de acceso mensualmente
   - Verificar inscripciones sospechosas

4. **Limpieza**
   - Eliminar inscripciones antiguas después de X meses
   - Comprimir o archivar justificantes antiguos

---

## 🚨 En Caso de Brecha de Seguridad

1. **Inmediato:**
   - Cambiar `NEXTAUTH_SECRET`
   - Cerrar todas las sesiones activas
   - Revisar logs de acceso

2. **Evaluación:**
   - Identificar qué datos fueron accedidos
   - Verificar integridad de archivos
   - Comprobar inscripciones falsas

3. **Comunicación:**
   - Notificar a usuarios afectados si es necesario
   - Documentar el incidente

---

## 🔧 Generación de NEXTAUTH_SECRET

### Opción 1: OpenSSL
```bash
openssl rand -base64 32
```

### Opción 2: Node.js
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### Opción 3: Online (usar con precaución)
https://generate-secret.vercel.app/32

---

## 📞 Soporte

Si encuentras algún problema de seguridad:
1. NO lo compartas públicamente
2. Repórtalo inmediatamente al equipo técnico
3. Documenta los pasos para reproducirlo

---

**Fecha de última actualización:** 6 de noviembre de 2025
**Versión de seguridad:** 1.0

