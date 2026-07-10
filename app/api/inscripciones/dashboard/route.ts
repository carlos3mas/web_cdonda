import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { apiRateLimit } from '@/lib/rate-limit'
import { getAdminTabData } from '@/lib/inscripciones-admin'

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
    const offsetParam = searchParams.get('offset')
    const estado = searchParams.get('estado')
    const busqueda = searchParams.get('busqueda')
    const sexo = searchParams.get('sexo')
    const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : 50
    const offset = offsetParam ? Math.max(0, Number(offsetParam)) : 0

    const data = await getAdminTabData(
      {
        tipo,
        estado: estado === 'pagados' || estado === 'pendientes' ? estado : null,
        busqueda,
        sexo: sexo === 'M' || sexo === 'F' ? sexo : null,
      },
      limit,
      offset
    )

    console.log(
      `📊 Dashboard [${tipo || 'todos'}]: ${data.inscripciones.length} filas (offset ${offset}, total ${data.pagination.total})`
    )

    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('Error al cargar dashboard de inscripciones:', error)
    return NextResponse.json(
      { error: 'Error al cargar inscripciones' },
      { status: 500 }
    )
  }
}
