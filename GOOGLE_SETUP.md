# 🔍 Configuración de Herramientas de Google

Esta guía te ayudará a configurar todas las herramientas de Google para tu web CD Onda.

---

## 📊 1. Google Analytics 4 (GA4)

Google Analytics te permite analizar el tráfico de tu web, conocer a tus visitantes y medir conversiones.

### Paso 1: Crear cuenta de Google Analytics

1. Ve a: https://analytics.google.com
2. Haz clic en **"Empezar a medir"** o **"Crear cuenta"**
3. Configura:
   - **Nombre de la cuenta:** CD Onda
   - **Nombre de la propiedad:** CD Onda Website
   - **Zona horaria:** España (GMT+1)
   - **Moneda:** EUR (€)
4. Selecciona **"Web"** como plataforma
5. Configura el flujo de datos:
   - **URL del sitio web:** Tu dominio (ej: `https://www.cdonda.com`)
   - **Nombre del flujo:** CD Onda Web

### Paso 2: Obtener el ID de medición

Después de crear la propiedad, verás un **ID de medición** con formato: `G-XXXXXXXXXX`

### Paso 3: Configurar en tu aplicación

En Dokploy, añade esta variable de entorno:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**✅ Listo!** Google Analytics se activará automáticamente en producción.

### Verificar instalación

1. Visita tu web
2. En Google Analytics, ve a **Informes > Tiempo real**
3. Deberías ver tu visita activa

---

## 🏷️ 2. Google Tag Manager (GTM) - Opcional pero Recomendado

Google Tag Manager te permite gestionar todas tus herramientas de marketing (GA, Facebook Pixel, etc.) sin editar código.

### Paso 1: Crear cuenta GTM

1. Ve a: https://tagmanager.google.com
2. Crea una cuenta:
   - **Nombre de cuenta:** CD Onda
   - **País:** España
3. Configura el contenedor:
   - **Nombre del contenedor:** CD Onda Web
   - **Plataforma de destino:** Web

### Paso 2: Obtener el ID del contenedor

Verás un **ID del contenedor** con formato: `GTM-XXXXXXX`

### Paso 3: Configurar en tu aplicación

En Dokploy, añade esta variable de entorno:
```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Paso 4: Configurar Google Analytics dentro de GTM

1. En GTM, ve a **Etiquetas > Nueva**
2. Crea una etiqueta de tipo **"Google Analytics: GA4 Configuration"**
3. Introduce tu **ID de medición** de GA4
4. Activa en **"All Pages"**
5. **Publicar** los cambios

**💡 Ventaja:** Con GTM puedes añadir Facebook Pixel, conversiones de Google Ads, etc., sin tocar código.

---

## 🔎 3. Google Search Console

Google Search Console te ayuda a:
- Indexar tu web en Google
- Ver en qué búsquedas apareces
- Detectar errores de SEO
- Enviar sitemap

### Paso 1: Acceder a Search Console

1. Ve a: https://search.google.com/search-console
2. Haz clic en **"Añadir propiedad"**
3. Selecciona **"Prefijo de URL"**
4. Introduce tu dominio completo: `https://www.cdonda.com`

### Paso 2: Verificar propiedad

Google te ofrecerá varios métodos de verificación. **Opción recomendada: Etiqueta HTML**

1. Selecciona **"Etiqueta HTML"**
2. Copia el código que te dan, algo como:
   ```html
   <meta name="google-site-verification" content="tu-codigo-unico-aqui" />
   ```
3. Añádelo al `app/layout.tsx` en la sección `metadata`:

```typescript
export const metadata: Metadata = {
  // ... resto del metadata
  verification: {
    google: 'tu-codigo-unico-aqui', // Solo el código, sin la etiqueta meta
  },
}
```

4. Despliega los cambios
5. Vuelve a Search Console y haz clic en **"Verificar"**

### Paso 3: Enviar Sitemap

Una vez verificada:

1. En Search Console, ve a **"Sitemaps"** (menú izquierdo)
2. Añade esta URL: `https://www.cdonda.com/sitemap.xml`
3. Haz clic en **"Enviar"**

**✅ Tu sitemap se ha enviado!** Google empezará a rastrear tu web.

### Paso 4: Solicitar indexación de páginas importantes

1. En Search Console, ve a **"Inspección de URLs"**
2. Introduce cada URL importante:
   - `https://www.cdonda.com`
   - `https://www.cdonda.com/campus-navidad`
   - `https://www.cdonda.com/campus-navidad/inscripcion`
3. Haz clic en **"Solicitar indexación"**

**⏱️ Tiempo de indexación:** Puede tardar de 1 hora a varios días dependiendo de la autoridad de tu dominio.

---

## 🚀 4. Verificar que todo funciona

### Robots.txt
Visita: `https://tu-dominio.com/robots.txt`

Deberías ver:
```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /storage/

Sitemap: https://tu-dominio.com/sitemap.xml
```

### Sitemap.xml
Visita: `https://tu-dominio.com/sitemap.xml`

Deberías ver un XML con todas tus páginas.

### Manifest (PWA)
Visita: `https://tu-dominio.com/manifest.webmanifest`

Deberías ver un JSON con información de la app.

### Google Analytics
1. Visita tu web
2. Abre las DevTools (F12)
3. Ve a la pestaña **"Network"**
4. Busca peticiones a `google-analytics.com` o `gtag/js`
5. Si aparecen, está funcionando ✅

---

## 📈 5. Métricas y Objetivos Recomendados

### En Google Analytics, configura estos eventos:

1. **Conversión: Inscripción Campus**
   - Evento: `form_submit`
   - Parámetro: `form_name = campus_inscripcion`

2. **Conversión: Inscripción General**
   - Evento: `form_submit`
   - Parámetro: `form_name = inscripcion_general`

3. **Engagement: Descargar PDF**
   - Evento: `file_download`
   - Tipo: `pdf`

4. **Engagement: Ver promociones**
   - Evento: `view_promotion`

### Informes importantes a revisar:

- **Tiempo real:** Usuarios activos ahora
- **Adquisición > Visión general:** De dónde vienen tus visitantes
- **Engagement > Páginas y pantallas:** Páginas más visitadas
- **Conversiones:** Inscripciones completadas
- **Datos demográficos:** Edad y ubicación de visitantes

---

## 🎯 6. Google My Business (Opcional pero Recomendado)

Si el club tiene una ubicación física, configura Google My Business:

1. Ve a: https://business.google.com
2. Añade tu negocio:
   - **Nombre:** Club Deportivo Onda
   - **Categoría:** Club deportivo / Escuela de fútbol
   - **Ubicación:** Campo Enrique Saura o La Cossa
   - **Teléfono y web:** Datos de contacto

**Beneficios:**
- Aparecer en Google Maps
- Reseñas de clientes
- Horarios y fotos
- Mayor visibilidad local

---

## 🔐 7. Variables de Entorno Finales

Una vez tengas todo, tus variables de entorno en Dokploy deberían ser:

```env
# Base de datos
DATABASE_URL=postgresql://[tu-conexion-neon]

# NextAuth
NEXTAUTH_SECRET=352af6a96c19428145a0aeb16cfdb4fb
NEXTAUTH_URL=https://www.cdonda.com

# Admin
ADMIN_EMAIL=escolafut@gmail.com
ADMIN_PASSWORD=Cdonda123

# Google Analytics (añadir cuando tengas el ID)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager (opcional, añadir si usas GTM)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## 📝 Checklist Final

- [ ] Google Analytics 4 configurado
- [ ] Variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` añadida en Dokploy
- [ ] Google Tag Manager configurado (opcional)
- [ ] Variable `NEXT_PUBLIC_GTM_ID` añadida en Dokploy (opcional)
- [ ] Google Search Console verificado
- [ ] Sitemap enviado a Search Console
- [ ] Páginas principales indexadas manualmente
- [ ] Código de verificación añadido al layout
- [ ] Robots.txt accesible y correcto
- [ ] Google My Business configurado (opcional)
- [ ] Verificado que Analytics funciona en DevTools

---

## 🆘 Troubleshooting

### Google Analytics no registra visitas
- Verifica que la variable de entorno esté configurada
- Comprueba que estás en producción (no funciona en localhost)
- Espera 24-48 horas para ver datos completos
- Revisa en "Tiempo real" para ver visitas instantáneas

### Search Console no verifica la propiedad
- Asegúrate de haber desplegado los cambios con el código de verificación
- Prueba con otro método de verificación (DNS o archivo HTML)
- Espera unos minutos y reintenta

### Las páginas no se indexan
- Verifica que `robots.txt` permita el rastreo
- Envía el sitemap en Search Console
- Solicita indexación manual de cada URL importante
- Espera 3-7 días para ver resultados

### GTM no carga
- Verifica que el ID empiece con `GTM-`
- Comprueba la variable de entorno
- Revisa la consola del navegador por errores

---

## 📚 Recursos Adicionales

- [Google Analytics Academy](https://analytics.google.com/analytics/academy/)
- [Search Console Help](https://support.google.com/webmasters)
- [Tag Manager Quickstart](https://support.google.com/tagmanager/answer/6102821)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)

---

**¿Necesitas ayuda?** Consulta la documentación oficial o contacta con soporte de Google.

