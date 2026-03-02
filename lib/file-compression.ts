import sharp from 'sharp'

/**
 * Comprime una imagen usando sharp
 * @param buffer Buffer de la imagen original
 * @param maxSizeKB Tamaño máximo en KB (por defecto 500KB)
 * @returns Buffer de la imagen comprimida
 */
export async function compressImage(buffer: Buffer, originalMime: string, maxSizeKB: number = 500): Promise<{ buffer: Buffer, mimeType: string }> {
  try {
    const metadata = await sharp(buffer).metadata()

    // Si es PNG, convertir a WebP para mejor compresión
    // Si es JPEG/JPG o cualquier otro, optimizar a JPEG con calidad ajustada
    let compressed: Buffer
    let finalMime = originalMime

    if (metadata.format === 'png') {
      // Convertir PNG a WebP con buena calidad
      compressed = await sharp(buffer)
        .webp({ quality: 85, effort: 6 })
        .toBuffer()
      finalMime = 'image/webp'
    } else {
      // Para JPEG u otros (incluyendo heic si sharp lo soporta), optimizar a JPEG
      compressed = await sharp(buffer)
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toBuffer()
      finalMime = 'image/jpeg'
    }

    // Si aún es muy grande, reducir calidad iterativamente
    let quality = 85
    while (compressed.length > maxSizeKB * 1024 && quality > 40) {
      quality -= 10

      if (metadata.format === 'png') {
        compressed = await sharp(buffer)
          .webp({ quality, effort: 6 })
          .toBuffer()
      } else {
        compressed = await sharp(buffer)
          .jpeg({ quality, progressive: true, mozjpeg: true })
          .toBuffer()
      }
    }

    // Si sigue siendo muy grande, redimensionar
    if (compressed.length > maxSizeKB * 1024) {
      const width = metadata.width || 1920
      const newWidth = Math.floor(width * 0.8)

      compressed = await sharp(buffer)
        .resize(newWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toBuffer()
    }

    const originalSizeKB = (buffer.length / 1024).toFixed(2)
    const compressedSizeKB = (compressed.length / 1024).toFixed(2)
    const savings = (((buffer.length - compressed.length) / buffer.length) * 100).toFixed(1)

    console.log(`🗜️  Imagen comprimida: ${originalSizeKB}KB → ${compressedSizeKB}KB (${savings}% reducción), Mime: ${finalMime}`)

    return { buffer: compressed, mimeType: finalMime }
  } catch (error) {
    console.error('Error al comprimir imagen:', error)
    // Si falla la compresión, devolver el buffer original
    return { buffer, mimeType: originalMime }
  }
}

/**
 * Comprime un PDF (simplificado - solo reduce calidad de imágenes embebidas)
 * Para PDFs, la mejor opción es aceptarlos tal cual o usar servicios externos
 * @param buffer Buffer del PDF original
 * @returns Buffer del PDF (sin cambios por ahora)
 */
export async function compressPDF(buffer: Buffer): Promise<{ buffer: Buffer, mimeType: string }> {
  // Los PDFs son más complejos de comprimir sin librerías especializadas
  // Por ahora, los dejamos tal cual
  // En producción, podrías usar servicios como:
  // - pdf-lib para manipulación básica
  // - ghostscript vía child_process
  // - Servicios cloud como Cloudinary

  const sizeKB = (buffer.length / 1024).toFixed(2)
  console.log(`📄 PDF aceptado: ${sizeKB}KB (sin compresión)`)

  return { buffer, mimeType: 'application/pdf' }
}

/**
 * Detecta el tipo de archivo y aplica la compresión adecuada
 * @param buffer Buffer del archivo
 * @param mimeType Tipo MIME del archivo
 * @param maxSizeKB Tamaño máximo en KB
 * @returns Buffer comprimido
 */
export async function compressFile(
  buffer: Buffer,
  mimeType: string,
  maxSizeKB: number = 500
): Promise<{ buffer: Buffer, mimeType: string }> {
  if (mimeType.startsWith('image/') || mimeType === '') {
    return await compressImage(buffer, mimeType || 'image/jpeg', maxSizeKB)
  } else if (mimeType === 'application/pdf') {
    return await compressPDF(buffer)
  }

  // Para otros tipos, devolver sin cambios
  return { buffer, mimeType }
}

/**
 * Obtiene información sobre un archivo
 */
export function getFileInfo(buffer: Buffer, filename: string) {
  const sizeKB = (buffer.length / 1024).toFixed(2)
  const sizeMB = (buffer.length / 1024 / 1024).toFixed(2)

  return {
    filename,
    sizeBytes: buffer.length,
    sizeKB: parseFloat(sizeKB),
    sizeMB: parseFloat(sizeMB),
    sizeFormatted: buffer.length > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
  }
}
