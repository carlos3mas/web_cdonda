import sharp from 'sharp'

/**
 * Comprime una imagen usando sharp
 * @param buffer Buffer de la imagen original
 * @param maxSizeKB Tamaño máximo en KB (por defecto 500KB)
 * @returns Buffer de la imagen comprimida
 */
export async function compressImage(buffer: Buffer, maxSizeKB: number = 500): Promise<Buffer> {
  try {
    const metadata = await sharp(buffer).metadata()
    
    // Si es PNG, convertir a WebP para mejor compresión
    // Si es JPEG/JPG, optimizar con calidad ajustada
    let compressed: Buffer
    
    if (metadata.format === 'png') {
      // Convertir PNG a WebP con buena calidad
      compressed = await sharp(buffer)
        .webp({ quality: 85, effort: 6 })
        .toBuffer()
    } else {
      // Para JPEG, optimizar con calidad progresiva
      compressed = await sharp(buffer)
        .jpeg({ quality: 85, progressive: true, mozjpeg: true })
        .toBuffer()
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
    
    console.log(`🗜️  Imagen comprimida: ${originalSizeKB}KB → ${compressedSizeKB}KB (${savings}% reducción)`)
    
    return compressed
  } catch (error) {
    console.error('Error al comprimir imagen:', error)
    // Si falla la compresión, devolver el buffer original
    return buffer
  }
}

/**
 * Comprime un PDF (simplificado - solo reduce calidad de imágenes embebidas)
 * Para PDFs, la mejor opción es aceptarlos tal cual o usar servicios externos
 * @param buffer Buffer del PDF original
 * @returns Buffer del PDF (sin cambios por ahora)
 */
export async function compressPDF(buffer: Buffer): Promise<Buffer> {
  // Los PDFs son más complejos de comprimir sin librerías especializadas
  // Por ahora, los dejamos tal cual
  // En producción, podrías usar servicios como:
  // - pdf-lib para manipulación básica
  // - ghostscript vía child_process
  // - Servicios cloud como Cloudinary
  
  const sizeKB = (buffer.length / 1024).toFixed(2)
  console.log(`📄 PDF aceptado: ${sizeKB}KB (sin compresión)`)
  
  return buffer
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
): Promise<Buffer> {
  if (mimeType.startsWith('image/')) {
    return await compressImage(buffer, maxSizeKB)
  } else if (mimeType === 'application/pdf') {
    return await compressPDF(buffer)
  }
  
  // Para otros tipos, devolver sin cambios
  return buffer
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
