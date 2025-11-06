import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/types'
import { requireAuth } from '@/lib/auth-middleware'
import { apiRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
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

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}

