const sharp = require('sharp')
const { readdir } = require('fs').promises
const { join, parse } = require('path')

async function run() {
  const dirArg = process.argv[2]
  if (!dirArg) {
    console.error('Uso: node scripts/convert-dir-to-webp.js <ruta_relativa_directorio>')
    process.exit(1)
  }
  const dir = join(process.cwd(), dirArg)
  const entries = await readdir(dir)
  const targets = entries.filter((f) => /\.(jpe?g|png)$/i.test(f))
  if (targets.length === 0) {
    console.log('No hay imágenes JPG/JPEG/PNG para convertir en', dir)
    return
  }
  console.log('Convirtiendo a WEBP en', dir, ':', targets)

  for (const file of targets) {
    const srcPath = join(dir, file)
    const { name } = parse(file)
    const dstPath = join(dir, `${name}.webp`)
    try {
      await sharp(srcPath).webp({ quality: 75 }).toFile(dstPath)
      console.log('OK ->', dstPath)
    } catch (e) {
      console.error('Error convirtiendo', file, e.message || e)
    }
  }
}

run().catch((e) => {
  console.error('Error general en conversión:', e.message || e)
  process.exit(1)
})

