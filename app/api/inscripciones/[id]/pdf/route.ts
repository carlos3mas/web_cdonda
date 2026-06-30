import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDF_INSCRIPCION_SELECT } from '@/lib/inscripciones-admin'
import { generatePDFForInscripcion } from '@/lib/pdfGenerator'
import { binaryResponse } from '@/lib/binary-response'
import { Inscripcion } from '@/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const row = await prisma.inscripcion.findUnique({
      where: { id: params.id },
      select: PDF_INSCRIPCION_SELECT,
    })

    if (!row) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      )
    }

    const pdfBytes = await generatePDFForInscripcion(row as Inscripcion)

    return binaryResponse(Buffer.from(pdfBytes), {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="inscripcion-${row.id}.pdf"`,
    })
  } catch (error) {
    console.error('Error al generar PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    )
  }
}
