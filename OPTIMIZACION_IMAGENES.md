# 🖼️ Optimización de Imágenes - CD Onda

## Problema identificado

Las imágenes de los equipos son muy pesadas (algunas de más de 2MB), lo que causa tiempos de carga lentos.

## ✅ Optimizaciones implementadas en el código

### 1. **Componente AutoCarousel mejorado**
- ✅ Añadido soporte para `priority` prop
- ✅ Configurado `quality={75}` para mejor compresión
- ✅ Implementado `loading="lazy"` para carga diferida
- ✅ Añadida precarga de imágenes del carrusel

### 2. **ClubTeamsSection optimizado**
- ✅ Solo las primeras 3 tarjetas cargan con prioridad
- ✅ El resto usa lazy loading

### 3. **Configuración de Next.js**
- ✅ AVIF como formato prioritario (mejor compresión que WebP)
- ✅ Cache de imágenes optimizado (1 año)
- ✅ Tamaños de dispositivo configurados

## 📋 Imágenes que necesitan optimización manual

### Imágenes más pesadas (>1MB):
```
veteranos.webp      - 2271 KB (2.2 MB) ⚠️ MUY PESADA
edi.webp            - 1996 KB (2.0 MB) ⚠️ MUY PESADA
amater.webp         - 1976 KB (1.9 MB) ⚠️ MUY PESADA
primer-equipo.webp  - 1721 KB (1.7 MB) ⚠️ PESADA
chupetines-1.webp   - 1538 KB (1.5 MB) ⚠️ PESADA
juveniles-3.webp    - 1265 KB (1.2 MB) ⚠️ PESADA
hero.webp           - 1238 KB (1.2 MB) ⚠️ PESADA
querubines-2.webp   - 1170 KB (1.1 MB) ⚠️ PESADA
infantiles-4.webp   - 1080 KB (1.0 MB) ⚠️ PESADA
infantiles-3.webp   - 1068 KB (1.0 MB) ⚠️ PESADA
```

## 🛠️ Cómo optimizar las imágenes manualmente

### Opción 1: Usando una herramienta online
1. Ve a https://squoosh.app/
2. Arrastra la imagen
3. Configura:
   - **Formato:** WebP
   - **Calidad:** 75
   - **Resize:** Ancho máximo 800px
4. Descarga y reemplaza la imagen original

### Opción 2: Usando Sharp (Node.js)
```bash
# Instalar sharp si no lo tienes
npm install sharp

# Crear un script para optimizar una imagen específica:
node -e "const sharp = require('sharp'); sharp('public/images/club/veteranos.webp').resize(800, null, {fit: 'inside'}).webp({quality: 75}).toFile('public/images/club/veteranos-optimized.webp')"
```

### Opción 3: Usando ImageMagick
```bash
# Optimizar una imagen
magick convert public/images/club/veteranos.webp -resize 800x -quality 75 public/images/club/veteranos-optimized.webp
```

## 📊 Impacto esperado

Con estas optimizaciones:
- **Carga inicial:** ~70% más rápida (solo primeras 3 imágenes)
- **Carga total:** ~40-50% más rápida (lazy loading del resto)
- **Tamaño de página:** Reducción de ~10-15 MB a ~3-5 MB
- **Formato AVIF:** 20-30% más compresión que WebP

## 🎯 Recomendaciones

1. **Optimizar las 10 imágenes más pesadas** (listadas arriba)
2. **Objetivo de tamaño:** 200-400 KB por imagen
3. **Dimensiones recomendadas:** 800px de ancho máximo
4. **Calidad WebP:** 75 (buen balance calidad/tamaño)

## ⚡ Optimizaciones futuras

- Considerar usar un CDN (Cloudflare Images, Cloudinary)
- Implementar blur placeholders para mejor UX
- Usar formatos responsivos (srcset)

