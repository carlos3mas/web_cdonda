import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { join, parse } from 'path'

async function run() {
  const dir = join(process.cwd(), 'public', 'images', 'kits')
  const entries = await readdir(dir)
  const targets = entries.filter((f) => /\.(jpe?g|png)$/i.test(f))
  if (targets.length === 0) {
    console.log('No hay imágenes JPG/JPEG/PNG para convertir en', dir)
    return
  }
  console.log('Convirtiendo a WEBP:', targets)

  for (const file of targets) {
    const srcPath = join(dir, file)
    const { name } = parse(file)
    const dstPath = join(dir, `${name}.webp`)
    try {
      await sharp(srcPath).webp({ quality: 75 }).toFile(dstPath)
      console.log('OK ->', dstPath)
    } catch (e) {
      console.error('Error convirtiendo', file, e)
    }
  }
}

run().catch((e) => {
  console.error('Error general en conversión:', e)
  process.exit(1)
})

