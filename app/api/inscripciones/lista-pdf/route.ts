import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { requireAuth } from '@/lib/auth-middleware'
import { generateListaInscripcionesPDF } from '@/lib/pdfGenerator'

export async function GET(request: NextRequest) {
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const tipoInscripcion = searchParams.get('tipo')
    const estado = searchParams.get('estado') // 'pagados' o 'pendientes'
    const tipoFiltro = searchParams.get('tipoFiltro') // Tipo específico si hay filtro adicional
    const busqueda = searchParams.get('busqueda') // Búsqueda de texto

    // Construir el objeto where con todos los filtros
    const where: Prisma.InscripcionWhereInput = {}

    // Filtro por tipo de inscripción
    if (tipoInscripcion && tipoInscripcion !== 'todos') {
      where.tipoInscripcion = tipoInscripcion
    }

    // Filtro por tipo específico si existe (cuando showTipoFilter está activado)
    if (tipoFiltro && tipoFiltro !== 'todos') {
      where.tipoInscripcion = tipoFiltro
    }

    // Filtro por estado de pago
    if (estado === 'pagados') {
      where.pagada = true
    } else if (estado === 'pendientes') {
      where.pagada = false
    }

    // Obtener todas las inscripciones que coincidan con los filtros
    let inscripciones = await prisma.inscripcion.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Aplicar filtro de búsqueda si existe (búsqueda en memoria porque es más flexible)
    if (busqueda && busqueda.trim()) {
      const query = busqueda.toLowerCase().trim()
      inscripciones = inscripciones.filter((inscripcion) => {
        return (
          inscripcion.nombreJugador.toLowerCase().includes(query) ||
          inscripcion.apellidos.toLowerCase().includes(query) ||
          inscripcion.dni.toLowerCase().includes(query) ||
          inscripcion.nombreTutor.toLowerCase().includes(query) ||
          inscripcion.telefono1.toLowerCase().includes(query) ||
          (inscripcion.telefono2 && inscripcion.telefono2.toLowerCase().includes(query))
        )
      })
    }

    if (inscripciones.length === 0) {
      return NextResponse.json(
        { error: 'No hay inscripciones para generar el PDF' },
        { status: 404 }
      )
    }

    // Generar el PDF con la lista
    const pdfBytes = await generateListaInscripcionesPDF(inscripciones)

    // Nombre del archivo
    const tipoLabel = tipoInscripcion && tipoInscripcion !== 'todos'
      ? tipoInscripcion.replace('-', '_')
      : 'todas'
    const fileName = `lista_inscripciones_${tipoLabel}_${new Date().toISOString().split('T')[0]}.pdf`

    // Devolver el PDF (convertir Uint8Array a Buffer)
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Error al generar PDF de lista:', error)
    return NextResponse.json(
      { error: 'Error al generar PDF de lista' },
      { status: 500 }
    )
  }
}

