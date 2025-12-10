/**
 * Validación avanzada de archivos usando magic numbers
 */

interface FileSignature {
  mime: string
  signatures: number[][]
  extension: string
}

// Magic numbers para tipos de archivo permitidos
const FILE_SIGNATURES: FileSignature[] = [
  // JPEG
  {
    mime: 'image/jpeg',
    signatures: [
      [0xFF, 0xD8, 0xFF, 0xE0],
      [0xFF, 0xD8, 0xFF, 0xE1],
      [0xFF, 0xD8, 0xFF, 0xE2],
      [0xFF, 0xD8, 0xFF, 0xE3],
      [0xFF, 0xD8, 0xFF, 0xE8]
    ],
    extension: 'jpg'
  },
  // PNG
  {
    mime: 'image/png',
    signatures: [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    extension: 'png'
  },
  // WEBP
  {
    mime: 'image/webp',
    signatures: [[0x52, 0x49, 0x46, 0x46]], // "RIFF"
    extension: 'webp'
  },
  // HEIC/HEIF (iPhone)
  {
    mime: 'image/heic',
    signatures: [[0x00, 0x00, 0x00]], // Simplificado para HEIC
    extension: 'heic'
  },
  {
    mime: 'image/heif',
    signatures: [[0x00, 0x00, 0x00]], // Simplificado para HEIF
    extension: 'heif'
  },
  // PDF
  {
    mime: 'application/pdf',
    signatures: [[0x25, 0x50, 0x44, 0x46]], // "%PDF"
    extension: 'pdf'
  }
]

/**
 * Valida el tipo de archivo usando magic numbers (primeros bytes)
 */
export async function validateFileType(file: File): Promise<{ valid: boolean; type?: string; error?: string }> {
  try {
    // Leer los primeros 12 bytes del archivo
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer).slice(0, 12)
    
    // Verificar contra las firmas conocidas
    for (const fileType of FILE_SIGNATURES) {
      for (const signature of fileType.signatures) {
        let matches = true
        for (let i = 0; i < signature.length; i++) {
          if (bytes[i] !== signature[i]) {
            matches = false
            break
          }
        }
        
        if (matches) {
          // Para HEIC/HEIF, ser más permisivo con el MIME type (iPhone a veces no lo reporta bien)
          if (fileType.mime.includes('heic') || fileType.mime.includes('heif')) {
            return {
              valid: true,
              type: fileType.mime
            }
          }
          
          // Verificar que el MIME type declarado coincida para otros formatos
          if (file.type !== fileType.mime && file.type !== '') {
            return {
              valid: false,
              error: `El tipo de archivo no coincide. Archivo real: ${fileType.mime}, declarado: ${file.type}`
            }
          }
          
          return {
            valid: true,
            type: fileType.mime
          }
        }
      }
    }
    
    return {
      valid: false,
      error: 'Tipo de archivo no permitido o no reconocido'
    }
  } catch {
    return {
      valid: false,
      error: 'Error al validar el archivo'
    }
  }
}

/**
 * Valida el tamaño del archivo
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Máximo ${maxSizeMB}MB`
    }
  }
  
  if (file.size === 0) {
    return {
      valid: false,
      error: 'El archivo está vacío'
    }
  }
  
  return { valid: true }
}

/**
 * Validación completa del archivo
 */
export async function validateFile(file: File, maxSizeMB: number = 10): Promise<{ valid: boolean; error?: string }> {
  // Validar tamaño
  const sizeValidation = validateFileSize(file, maxSizeMB)
  if (!sizeValidation.valid) {
    return sizeValidation
  }
  
  // Validar tipo usando magic numbers
  const typeValidation = await validateFileType(file)
  if (!typeValidation.valid) {
    return typeValidation
  }
  
  return { valid: true }
}

