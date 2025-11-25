/**
 * Script para optimizar imágenes pesadas del sitio
 * Convierte JPG grandes a WebP optimizados
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToOptimize = [
  {
    input: 'public/images/logos/Sara-Blazquez.jpg',
    output: 'public/images/logos/Sara-Blazquez.webp',
  },
  {
    input: 'public/images/logos/Diputacion-Castellon.jpg',
    output: 'public/images/logos/Diputacion-Castellon.webp',
  },
  {
    input: 'public/images/logos/J.P.E.jpg',
    output: 'public/images/logos/J.P.E.webp',
  },
  {
    input: 'public/images/logos/GALAXY-TILES.jpg',
    output: 'public/images/logos/GALAXY-TILES.webp',
  },
];

async function optimizeImages() {
  console.log('🖼️  Optimizando imágenes...\n');

  for (const { input, output } of imagesToOptimize) {
    try {
      if (!fs.existsSync(input)) {
        console.log(`⚠️  ${input} no existe, saltando...`);
        continue;
      }

      const inputStats = fs.statSync(input);
      const inputSizeMB = (inputStats.size / (1024 * 1024)).toFixed(2);

      console.log(`📥 Procesando: ${path.basename(input)} (${inputSizeMB} MB)`);

      // Optimizar y convertir a WebP
      await sharp(input)
        .webp({ quality: 85, effort: 6 })
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(output);

      const outputStats = fs.statSync(output);
      const outputSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2);
      const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

      console.log(`✅ Creado: ${path.basename(output)} (${outputSizeMB} MB)`);
      console.log(`💾 Reducción: ${reduction}%\n`);
    } catch (error) {
      console.error(`❌ Error procesando ${input}:`, error.message);
    }
  }

  console.log('✨ ¡Optimización completada!');
  console.log('\n📝 Ahora actualiza las referencias de .jpg a .webp en el código');
}

optimizeImages();

