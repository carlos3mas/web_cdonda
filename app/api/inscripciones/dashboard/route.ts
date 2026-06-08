import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { apiRateLimit } from '@/lib/rate-limit'
import {
  getInscripcionStats,
  getInscripcionesForAdminList,
} from '@/lib/inscripciones-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const headers = new Headers()
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  headers.set('Pragma', 'no-cache')
  headers.set('Expires', '0')

  const authError = await requireAuth(request)
  if (authError) return authError

  const rateLimitError = apiRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status, headers: { 'Retry-After': String(rateLimitError.retryAfter) } }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.max(1, Math.min(200, Number(limitParam))) : 50

    const [stats, inscripciones] = await Promise.all([
      getInscripcionStats(tipo),
      getInscripcionesForAdminList(tipo, limit),
    ])

    console.log(
      `📊 Dashboard: ${inscripciones.length} inscripciones (tipo: ${tipo || 'todos'}, limit: ${limit})`
    )

    return NextResponse.json({ stats, inscripciones }, { headers })
  } catch (error) {
    console.error('Error al cargar dashboard de inscripciones:', error)
    return NextResponse.json(
      { error: 'Error al cargar inscripciones' },
      { status: 500 }
    )
  }
}
