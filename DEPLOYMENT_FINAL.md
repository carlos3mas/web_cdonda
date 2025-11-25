# 🚀 DEPLOYMENT FINAL - CD Onda a Producción

## ✅ Configuración Completa

### Dominio: **https://cdonda.es** 🌐

---

## 📋 CHECKLIST PRE-DEPLOYMENT

- [x] ✅ Base de datos PostgreSQL configurada (Neon)
- [x] ✅ Variables de entorno preparadas
- [x] ✅ Dominio aprobado: cdonda.es
- [x] ✅ SEO y metadata configurados
- [x] ✅ Traducciones verificadas (ES/VAL)
- [x] ✅ Todas las funcionalidades probadas
- [x] ✅ Documentación completa

---

## 🔧 PASO 1: Preparar Repositorio Git

### 1.1 Asegúrate de que todo está commiteado

```bash
git status
git add .
git commit -m "Preparar aplicación para producción - cdonda.es"
```

### 1.2 Subir a GitHub/GitLab

```bash
git push origin main
```

Si aún no tienes repositorio remoto:

```bash
# Crear repositorio en GitHub/GitLab primero, luego:
git remote add origin https://github.com/tu-usuario/web-cdonda.git
git branch -M main
git push -u origin main
```

---

## 🏗️ PASO 2: Configurar Dokploy

### 2.1 Crear Nueva Aplicación

1. **Login en Dokploy**
2. **Crear Nueva Aplicación**
   - Click en "New Application" o "Create App"
3. **Configurar Proyecto:**
   - **Nombre:** `cd-onda-web` (o el que prefieras)
   - **Tipo:** Next.js / Node.js
   - **Repositorio:** Conectar tu repositorio Git
   - **Branch:** `main`

### 2.2 Configurar Build Settings

En la sección de configuración:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Install Command:** `npm install`
- **Port:** `3000`
- **Node Version:** `18` o superior

---

## 🔑 PASO 3: Configurar Variables de Entorno

En Dokploy, ve a la sección **"Environment Variables"** y añade:

### Variables Requeridas (copia exactamente):

```
DATABASE_URL=postgresql://neondb_owner:npg_vHUkKQV0JRa5@ep-damp-voice-ab7pe30b-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=352af6a96c19428145a0aeb16cfdb4fb

NEXTAUTH_URL=https://cdonda.es

ADMIN_EMAIL=escolafut@gmail.com

ADMIN_PASSWORD=Cdonda123
```

**⚠️ IMPORTANTE:**
- NO incluyas comillas en los valores
- Copia y pega exactamente como está
- Verifica que no haya espacios extra

---

## 🌐 PASO 4: Configurar Dominio

### 4.1 En Dokploy

1. Ve a la sección **"Domains"** de tu aplicación
2. Click en **"Add Domain"**
3. Introduce: `cdonda.es`
4. También añade: `www.cdonda.es` (opcional pero recomendado)

### 4.2 Configurar DNS

En tu proveedor de dominios (donde compraste cdonda.es):

**Opción A: Usando registros A**
```
Tipo: A
Nombre: @
Valor: [IP que te proporciona Dokploy]
TTL: 3600

Tipo: A
Nombre: www
Valor: [IP que te proporciona Dokploy]
TTL: 3600
```

**Opción B: Usando CNAME (si Dokploy te da un dominio)**
```
Tipo: CNAME
Nombre: www
Valor: [dominio.dokploy.app]
TTL: 3600
```

**⏱️ Tiempo de propagación:** 5 minutos a 48 horas (normalmente < 2 horas)

---

## 🚀 PASO 5: Primer Deployment

1. En Dokploy, click en **"Deploy"** o **"Build & Deploy"**
2. Espera a que el build complete (2-5 minutos)
3. Verás logs en tiempo real

### Logs esperados:
```
> Installing dependencies...
> Running build...
> Build completed successfully
> Starting application on port 3000
```

**✅ Deployment exitoso** cuando veas: `Server running on port 3000`

---

## 🗄️ PASO 6: Inicializar Base de Datos

**IMPORTANTE:** Después del primer deployment exitoso, ejecuta estos comandos.

### Opción A: Desde la Terminal de Dokploy

En Dokploy, abre la terminal de tu aplicación y ejecuta:

```bash
# 1. Aplicar migraciones de Prisma
npm run db:deploy

# 2. Crear usuario administrador
node scripts/create-admin.js
```

Verás:
```
✅ Migrations applied successfully
✅ Admin user created successfully!
📧 Email: escolafut@gmail.com
```

### Opción B: Desde tu terminal local (si tienes acceso SSH)

```bash
# Conectar a tu servidor
ssh user@your-server

# Ir al directorio de la app
cd /path/to/app

# Ejecutar comandos
npm run db:deploy
node scripts/create-admin.js
```

---

## ✅ PASO 7: Verificar Deployment

### 7.1 Verificaciones Básicas

Visita tu dominio y verifica:

- [ ] La página principal carga: `https://cdonda.es`
- [ ] Las imágenes se ven correctamente
- [ ] El video del campus funciona
- [ ] El carrusel de sponsors funciona
- [ ] El cambio de idioma funciona (ES/VAL)
- [ ] Los enlaces de navegación funcionan

### 7.2 Verificar Formularios

- [ ] Formulario de campus funciona: `https://cdonda.es/campus-navidad/inscripcion`
- [ ] Se puede adjuntar justificante de pago
- [ ] Se puede firmar
- [ ] Se genera el PDF correctamente

### 7.3 Verificar Panel Admin

1. Ve a: `https://cdonda.es/admin/login`
2. Login con:
   - **Email:** escolafut@gmail.com
   - **Password:** Cdonda123
3. Verifica:
   - [ ] Puedes acceder al dashboard
   - [ ] Ves las inscripciones (debería estar vacío al principio)
   - [ ] Puedes ver estadísticas
   - [ ] Funciona la gestión de plantillas

### 7.4 Verificar SEO

- [ ] Robots.txt: `https://cdonda.es/robots.txt`
- [ ] Sitemap: `https://cdonda.es/sitemap.xml`
- [ ] Manifest: `https://cdonda.es/manifest.webmanifest`

---

## 🔒 PASO 8: Seguridad Post-Deployment

### 8.1 Cambiar Contraseña de Admin

**⚠️ IMPORTANTE:** Haz esto inmediatamente después del deployment

1. Login en el admin
2. Ve a configuración/perfil
3. Cambia la contraseña a una más segura
4. **NO la compartas con nadie**

### 8.2 Configurar HTTPS

Dokploy normalmente configura HTTPS automáticamente con Let's Encrypt.

Verifica:
- [ ] El candado aparece en el navegador
- [ ] `https://` funciona correctamente
- [ ] `http://` redirige a `https://`

---

## 📊 PASO 9: Configurar Google Tools (Opcional pero Recomendado)

### 9.1 Google Analytics

1. Crea cuenta en: https://analytics.google.com
2. Obtén tu ID: `G-XXXXXXXXXX`
3. En Dokploy, añade variable de entorno:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. Redeploy la aplicación

### 9.2 Google Search Console

1. Ve a: https://search.google.com/search-console
2. Añade propiedad: `https://cdonda.es`
3. Verifica con etiqueta HTML
4. Envía el sitemap: `https://cdonda.es/sitemap.xml`
5. Solicita indexación de páginas principales

**Ver:** `GOOGLE_SETUP.md` para instrucciones detalladas

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot connect to database"

**Causa:** Problema con DATABASE_URL

**Solución:**
1. Verifica que la variable esté bien copiada (sin espacios)
2. Confirma que la base de datos Neon esté activa
3. Revisa los logs de Dokploy para más detalles

### Error: "NEXTAUTH_URL is not defined"

**Causa:** Variable no configurada o mal escrita

**Solución:**
1. Verifica en Dokploy que `NEXTAUTH_URL=https://cdonda.es` está configurada
2. Redeploy la aplicación

### Error: "Failed to build"

**Causa:** Error durante el proceso de build

**Solución:**
1. Revisa los logs de build en Dokploy
2. Verifica que todas las dependencias estén en `package.json`
3. Confirma que Node.js version sea 18+
4. Intenta hacer build local: `npm run build`

### El admin ya existe

**Causa:** Script se ejecutó dos veces

**Solución:**
- Usa las credenciales existentes
- O cambia `ADMIN_EMAIL` a otro email y vuelve a ejecutar

### Las imágenes no cargan

**Causa:** Problema con rutas o permisos

**Solución:**
1. Verifica que la carpeta `public/` esté en el repositorio
2. Confirma que las imágenes tengan las extensiones correctas
3. Revisa los logs del navegador (F12 > Console)

### El dominio no resuelve

**Causa:** DNS no propagado o mal configurado

**Solución:**
1. Espera 2-24 horas para propagación DNS
2. Verifica configuración DNS en tu proveedor
3. Usa https://dnschecker.org para verificar propagación
4. Mientras tanto, usa el dominio temporal de Dokploy

---

## 📈 PASO 10: Monitoreo Post-Deployment

### Primera Hora
- [ ] Verificar que la web carga correctamente
- [ ] Probar todas las funcionalidades principales
- [ ] Verificar logs de errores en Dokploy
- [ ] Cambiar contraseña de admin

### Primer Día
- [ ] Verificar que las inscripciones funcionan
- [ ] Revisar que los emails lleguen (si aplica)
- [ ] Comprobar rendimiento (tiempo de carga)
- [ ] Verificar en diferentes dispositivos

### Primera Semana
- [ ] Configurar Google Analytics
- [ ] Configurar Search Console
- [ ] Enviar sitemap
- [ ] Solicitar indexación
- [ ] Compartir en redes sociales del club
- [ ] Configurar backups de base de datos

---

## 🎯 MÉTRICAS A MONITOREAR

### En Dokploy
- CPU usage (debería estar < 70%)
- Memory usage (debería estar < 80%)
- Response time (< 1 segundo)
- Error rate (debería ser 0%)

### En Google Analytics (después de configurar)
- Visitantes únicos
- Páginas más visitadas
- Tasa de rebote
- Conversiones (inscripciones)

---

## 🔄 ACTUALIZACIONES FUTURAS

Para actualizar la aplicación después del deployment inicial:

```bash
# 1. Hacer cambios en tu código
# 2. Commitear
git add .
git commit -m "Descripción de cambios"
git push origin main

# 3. Dokploy detectará los cambios y redesplegará automáticamente
```

O en Dokploy:
1. Click en "Redeploy"
2. Espera a que complete
3. Verifica cambios en producción

---

## 📞 CONTACTOS DE EMERGENCIA

### Soporte Técnico
- **Base de datos (Neon):** https://neon.tech/docs
- **Dokploy:** https://docs.dokploy.com
- **Next.js:** https://nextjs.org/docs

### Logs y Debug
- **Logs de aplicación:** Panel de Dokploy > Logs
- **Logs de base de datos:** Panel de Neon
- **Logs del navegador:** F12 > Console

---

## 🎉 ¡DEPLOYMENT COMPLETADO!

Si has completado todos los pasos, tu aplicación debería estar:

✅ **Online en:** https://cdonda.es
✅ **Segura** con HTTPS
✅ **Funcional** con todas las características
✅ **Monitoreada** y lista para recibir usuarios

### Próximos Pasos Recomendados:

1. **Compartir la web:**
   - Publicar en redes sociales del club
   - Enviar a jugadores y familias
   - Añadir a firma de emails

2. **SEO:**
   - Configurar Google Analytics
   - Configurar Search Console
   - Solicitar indexación

3. **Mantenimiento:**
   - Revisar inscripciones regularmente
   - Responder consultas
   - Actualizar información cuando sea necesario

---

## 📚 DOCUMENTACIÓN ADICIONAL

- `DEPLOY.md` - Guía técnica de deployment
- `GOOGLE_SETUP.md` - Configuración de herramientas Google
- `SEO_CHECKLIST.md` - Checklist de SEO
- `TRADUCCIONES_VERIFICADAS.md` - Verificación de traducciones
- `.env.production.example` - Template de variables de entorno

---

**🚀 ¡Enhorabuena! La web del CD Onda está lista para el mundo.**

**Cualquier duda, consulta la documentación o los logs de Dokploy.**

