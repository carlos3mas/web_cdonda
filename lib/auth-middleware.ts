import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

/**
 * Middleware para proteger rutas de API que requieren autenticación
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado. Debes iniciar sesión.' },
      { status: 401 }
    )
  }
  
  return null // null significa que está autenticado
}

/**
 * Wrapper para rutas protegidas
 */
export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const authError = await requireAuth(request)
    if (authError) return authError
    
    return handler(request, ...args)
  }
}

