import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInscripcionPDF } from '@/lib/pdfGenerator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: params.id }
    })

    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      )
    }

    // Generar el PDF
    const pdfBytes = await generateInscripcionPDF(inscripcion)

    // Devolver el PDF
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="inscripcion-${inscripcion.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error al generar PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    )
  }
}

