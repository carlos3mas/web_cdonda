import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith('https://') ?? process.env.NODE_ENV === 'production'

/**
 * Middleware para proteger rutas de API que requieren autenticación.
 * Usa getToken con la request para leer la cookie de sesión en App Router.
 */
export async function requireAuth(request: NextRequest) {
  if (!request) {
    return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión.' }, { status: 401 })
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: useSecureCookies,
  })

  if (!token) {
    return NextResponse.json(
      { error: 'No autorizado. Debes iniciar sesión.' },
      { status: 401 }
    )
  }

  return null
}

/**
 * Wrapper para rutas protegidas
 */
export function withAuth(handler: (request: NextRequest, ...args: unknown[]) => Promise<unknown>) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const authError = await requireAuth(request)
    if (authError) return authError

    return handler(request, ...args)
  }
}
