/** Reduce fotos del móvil antes de subirlas (menos timeout y errores de red). */
export async function compressImageFileForUpload(
  file: File,
  maxWidth = 1600,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality)
    })
    if (!blob) return file

    const base = file.name.replace(/\.[^.]+$/, '') || 'imagen'
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg' })
  } catch {
    return file
  }
}

/**
 * Prepara una foto tipo carnet (proporción 3:4) sobre fondo blanco.
 * Recorta centrado y exporta JPEG listo para ficha federativa.
 */
export async function prepareCarnetPhotoForUpload(
  file: File,
  options?: { width?: number; height?: number; quality?: number }
): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file
  }

  const targetWidth = options?.width ?? 600
  const targetHeight = options?.height ?? 800
  const quality = options?.quality ?? 0.88

  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return compressImageFileForUpload(file, targetWidth, quality)
    }

    // Fondo blanco obligatorio para foto carnet
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, targetWidth, targetHeight)

    const scale = Math.max(targetWidth / bitmap.width, targetHeight / bitmap.height)
    const drawWidth = bitmap.width * scale
    const drawHeight = bitmap.height * scale
    const offsetX = (targetWidth - drawWidth) / 2
    // Un poco más arriba del centro para priorizar el rostro
    const offsetY = (targetHeight - drawHeight) / 2 - targetHeight * 0.04

    ctx.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality)
    })
    if (!blob) return file

    const base = file.name.replace(/\.[^.]+$/, '') || 'foto-ficha'
    return new File([blob], `${base}-carnet.jpg`, { type: 'image/jpeg' })
  } catch {
    return compressImageFileForUpload(file, 900, quality)
  }
}
