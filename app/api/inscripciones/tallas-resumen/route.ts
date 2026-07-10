import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { apiRateLimit } from '@/lib/rate-limit'
import { getTallasResumenAnual } from '@/lib/inscripciones-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
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
    const categoria = searchParams.get('categoria')
    const resumen = await getTallasResumenAnual(categoria)
    return NextResponse.json(resumen)
  } catch (error) {
    console.error('Error al cargar resumen de tallas:', error)
    return NextResponse.json({ error: 'Error al cargar resumen de tallas' }, { status: 500 })
  }
}
