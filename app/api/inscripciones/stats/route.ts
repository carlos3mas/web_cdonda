import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/types'
import { requireAuth } from '@/lib/auth-middleware'
import { apiRateLimit } from '@/lib/rate-limit'

// Deshabilitar cache para esta ruta
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  // Deshabilitar cache para asegurar datos frescos
  const headers = new Headers()
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  headers.set('Pragma', 'no-cache')
  headers.set('Expires', '0')
  
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError
  
  // Rate limiting
  const rateLimitError = apiRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status }
    )
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const tipoInscripcion = searchParams.get('tipo')

    const where = tipoInscripcion && tipoInscripcion !== 'todos' 
      ? { tipoInscripcion } 
      : {}

    const totalInscripciones = await prisma.inscripcion.count({ where })
    const inscripcionesPagadas = await prisma.inscripcion.count({
      where: { ...where, pagada: true }
    })
    const inscripcionesPendientes = await prisma.inscripcion.count({
      where: { ...where, pagada: false }
    })

    const stats: DashboardStats = {
      totalInscripciones,
      inscripcionesPagadas,
      inscripcionesPendientes
    }

    // Log para diagnóstico en producción
    console.log(`📊 Stats obtenidas: ${totalInscripciones} total, ${inscripcionesPagadas} pagadas, ${inscripcionesPendientes} pendientes (tipo: ${tipoInscripcion || 'todos'})`)

    return NextResponse.json(stats, { headers })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}

