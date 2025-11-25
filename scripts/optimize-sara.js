const sharp = require('sharp');
const fs = require('fs');

async function optimizeSara() {
  const input = 'public/images/logos/Sara-Blazquez.jpg';
  const output = 'public/images/logos/Sara-Blazquez.webp';

  try {
    const inputStats = fs.statSync(input);
    console.log(`📥 Tamaño original: ${(inputStats.size / (1024 * 1024)).toFixed(2)} MB`);

    // Optimizar con más agresividad
    await sharp(input)
      .resize(600, 600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80, effort: 6 })
      .toFile(output);

    const outputStats = fs.statSync(output);
    console.log(`✅ Tamaño optimizado: ${(outputStats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`💾 Reducción: ${((1 - outputStats.size / inputStats.size) * 100).toFixed(1)}%`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

optimizeSara();

