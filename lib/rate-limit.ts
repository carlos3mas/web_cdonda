import { NextRequest } from 'next/server'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Limpiar entradas antiguas cada 10 minutos
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 10 * 60 * 1000)

interface RateLimitOptions {
  /** Identificador para no mezclar contadores entre distintos límites */
  name: string
  interval: number // en milisegundos
  maxRequests: number
}

/**
 * Rate limiter simple basado en IP
 */
export function rateLimit(options: RateLimitOptions) {
  return (request: NextRequest) => {
    const ip = request.ip || 
               request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const now = Date.now()
    const key = `${options.name}:${ip}`
    
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + options.interval
      }
      return null // null significa permitido
    }
    
    if (now > store[key].resetTime) {
      // Reset
      store[key] = {
        count: 1,
        resetTime: now + options.interval
      }
      return null
    }
    
    store[key].count++
    
    if (store[key].count > options.maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000)
      return {
        error: 'Demasiadas peticiones. Por favor, intenta más tarde.',
        retryAfter,
        status: 429
      }
    }
    
    return null
  }
}

/**
 * Rate limiter para inscripciones (más restrictivo)
 */
export const inscripcionRateLimit = rateLimit({
  name: 'inscripcion',
  interval: 60 * 60 * 1000, // 1 hora
  maxRequests: 5 // máximo 5 inscripciones por hora por IP
})

/**
 * Rate limiter para subida de archivos (restrictivo)
 */
export const uploadRateLimit = rateLimit({
  name: 'upload',
  interval: 60 * 1000, // 1 minuto
  maxRequests: 10 // máximo 10 subidas por minuto
})

/**
 * Rate limiter para justificantes de cuotas (pestaña pública)
 */
export const cuotaUploadRateLimit = rateLimit({
  name: 'cuota-upload',
  interval: 60 * 1000, // 1 minuto
  maxRequests: 15 // máximo 15 subidas por minuto
})

/**
 * Rate limiter para foto de ficha (pestaña pública)
 */
export const fotoFichaUploadRateLimit = rateLimit({
  name: 'foto-ficha-upload',
  interval: 60 * 1000, // 1 minuto
  maxRequests: 15 // máximo 15 subidas por minuto
})

/**
 * Rate limiter general para APIs
 */
export const apiRateLimit = rateLimit({
  name: 'api',
  interval: 60 * 1000, // 1 minuto
  maxRequests: 60 // máximo 60 peticiones por minuto
})

