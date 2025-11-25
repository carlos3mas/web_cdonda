# 🚨 RESPUESTA A INCIDENTE DE SEGURIDAD

## ⚠️ INCIDENTE DETECTADO
**Fecha:** 25 de Noviembre 2025
**Tipo:** Exposición de credenciales en GitHub
**Severidad:** CRÍTICA

---

## ✅ ACCIONES TOMADAS INMEDIATAMENTE:

1. ✅ Eliminados archivos con credenciales expuestas:
   - `DEPLOY.md`
   - `PRODUCCION.md`
   - `ENV_TEMPLATE.md`

2. ✅ Sanitizados archivos restantes:
   - `DEPLOYMENT_FINAL.md`
   - `GOOGLE_SETUP.md`

3. ✅ Actualizado `.gitignore` para prevenir futuros incidentes

---

## 🔴 ACCIONES CRÍTICAS QUE DEBES HACER AHORA:

### 1. **REGENERAR DATABASE_URL (URGENTE - Hazlo YA)**

La antigua DATABASE_URL está comprometida. Cualquiera puede acceder a tu base de datos.

#### Opción A: Resetear password de Neon
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto `neondb`
3. Ve a **Settings** → **Reset password**
4. Copia la NUEVA DATABASE_URL
5. Actualízala en Dokploy

#### Opción B: Crear nueva base de datos
1. Ve a https://console.neon.tech
2. Crea un nuevo proyecto/database
3. Copia la nueva DATABASE_URL
4. Migra los datos si es necesario
5. Actualízala en Dokploy

### 2. **GENERAR NUEVO NEXTAUTH_SECRET**

El viejo está expuesto. Genera uno nuevo:

```bash
# En tu terminal local (Git Bash o WSL):
openssl rand -base64 32
```

O usa: https://generate-secret.vercel.app/32

### 3. **CAMBIAR ADMIN_PASSWORD**

El password `Cdonda123` está expuesto. Cámbialo:

1. Genera uno seguro (usa 1Password, Bitwarden, etc.)
2. Actualiza en Dokploy
3. Actualiza tu gestor de contraseñas

---

## 🔧 ACTUALIZAR VARIABLES EN DOKPLOY:

1. Ve a Dokploy → tu aplicación
2. **Environment Variables**
3. Actualiza estas 3 variables:

```
DATABASE_URL=postgresql://[NUEVA_CREDENCIAL_DE_NEON]
NEXTAUTH_SECRET=[NUEVO_SECRET_GENERADO]
ADMIN_PASSWORD=[NUEVO_PASSWORD_SEGURO]
```

4. Click en **Save**
5. **Redeploy** la aplicación

---

## 🛡️ PREVENCIÓN FUTURA:

### ✅ Lo que YA hemos hecho:
- ✅ Eliminados archivos con secretos
- ✅ Actualizado `.gitignore`
- ✅ Sanitizada documentación

### ⚠️ NUNCA hagas esto:
- ❌ NO commitees archivos `.env` 
- ❌ NO pongas credenciales en archivos `.md`
- ❌ NO compartas DATABASE_URL en documentación
- ❌ NO uses passwords simples como `Cdonda123`

### ✅ SIEMPRE haz esto:
- ✅ Usa variables de entorno en Dokploy/Vercel
- ✅ Usa `.env.example` con valores de ejemplo
- ✅ Usa gestores de contraseñas
- ✅ Genera secrets aleatorios fuertes

---

## 📋 CHECKLIST DE SEGURIDAD:

- [ ] ✅ Regenerada DATABASE_URL en Neon
- [ ] ✅ Generado nuevo NEXTAUTH_SECRET
- [ ] ✅ Creado nuevo ADMIN_PASSWORD seguro
- [ ] ✅ Actualizadas variables en Dokploy
- [ ] ✅ Redesplegada aplicación
- [ ] ✅ Verificado que la app funciona
- [ ] ✅ Guardadas credenciales en gestor seguro
- [ ] ✅ Marcado incidente como resuelto en GitGuardian

---

## 🔍 VERIFICACIÓN POST-INCIDENTE:

Después de hacer los cambios:

1. **Verifica que la app funciona:**
   - https://cdonda.es carga correctamente
   - Puedes hacer login en /admin/login con el NUEVO password

2. **Verifica que las credenciales viejas YA NO funcionan:**
   - Intenta conectar con la vieja DATABASE_URL (debería fallar)

3. **Monitorea los logs:**
   - Revisa Dokploy logs por intentos de acceso sospechosos

---

## 📞 RECURSOS:

- **Neon Console:** https://console.neon.tech
- **Dokploy:** Tu panel de Dokploy
- **GitGuardian:** https://dashboard.gitguardian.com
- **Generate Secret:** https://generate-secret.vercel.app

---

## ⏰ TIEMPO ESTIMADO PARA RESOLUCIÓN:

- Regenerar credenciales: **5 minutos**
- Actualizar Dokploy: **2 minutos**
- Redeploy: **3 minutos**
- **TOTAL: ~10 minutos**

---

## 🎯 PRÓXIMOS PASOS:

1. **AHORA MISMO:** Regenera las 3 credenciales
2. **Actualiza Dokploy** con las nuevas credenciales
3. **Redeploy** la aplicación
4. **Verifica** que todo funciona
5. **Marca el incidente como resuelto** en GitGuardian

---

**⚠️ NO IGNORES ESTO. Actúa AHORA para proteger tu aplicación y datos. ⚠️**

