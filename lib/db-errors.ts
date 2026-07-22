export function isPrismaSchemaMismatch(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    (error instanceof Error && error.name === 'PrismaClientValidationError') ||
    message.includes('Unknown argument') ||
    normalized.includes('no such column') ||
    normalized.includes('no column named') ||
    normalized.includes('has no column named') ||
    normalized.includes('sqlite_error') ||
    normalized.includes('sqlite_unknown')
  )
}

export function isConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    normalized.includes('terminated') ||
    normalized.includes('fetch failed') ||
    normalized.includes('econnreset') ||
    normalized.includes('socket hang up')
  )
}

export function getCuotaUploadErrorMessage(error: unknown): { status: number; message: string } {
  if (isPrismaSchemaMismatch(error)) {
    return {
      status: 503,
      message:
        'La base de datos necesita una actualización. Contacta con el club o inténtalo más tarde.',
    }
  }
  if (isConnectionError(error)) {
    return {
      status: 503,
      message: 'Error de conexión al guardar. Espera unos segundos e inténtalo de nuevo.',
    }
  }
  return { status: 500, message: 'Error al guardar justificante de cuota' }
}

export function getFotoFichaUploadErrorMessage(error: unknown): { status: number; message: string } {
  if (isPrismaSchemaMismatch(error)) {
    return {
      status: 503,
      message:
        'La base de datos necesita una actualización. Contacta con el club o inténtalo más tarde.',
    }
  }
  if (isConnectionError(error)) {
    return {
      status: 503,
      message: 'Error de conexión al guardar. Espera unos segundos e inténtalo de nuevo.',
    }
  }
  return { status: 500, message: 'Error al guardar la foto de ficha' }
}
