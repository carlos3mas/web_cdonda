import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DashboardStats } from '@/types'

export async function GET() {
  try {
    const totalInscripciones = await prisma.inscripcion.count()
    const inscripcionesPagadas = await prisma.inscripcion.count({
      where: { pagada: true }
    })
    const inscripcionesPendientes = await prisma.inscripcion.count({
      where: { pagada: false }
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

