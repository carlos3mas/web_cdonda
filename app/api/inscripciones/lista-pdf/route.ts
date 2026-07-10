import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { getInscripcionesForListaPDF } from '@/lib/inscripciones-admin'
import { generateListaInscripcionesPDF } from '@/lib/pdfGenerator'
import { binaryResponse } from '@/lib/binary-response'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const tipoInscripcion = searchParams.get('tipo')
    const estado = searchParams.get('estado')
    const busqueda = searchParams.get('busqueda')
    const sexo = searchParams.get('sexo')
    const idsParam = searchParams.get('ids')
    const ids = idsParam
      ? idsParam.split(',').map((id) => id.trim()).filter(Boolean)
      : null

    const inscripciones = await getInscripcionesForListaPDF({
      tipo: tipoInscripcion,
      estado: estado === 'pagados' || estado === 'pendientes' ? estado : null,
      busqueda,
      sexo: sexo === 'M' || sexo === 'F' ? sexo : null,
      ids,
    })

    if (inscripciones.length === 0) {
      return NextResponse.json(
        { error: 'No hay inscripciones para generar el PDF' },
        { status: 404 }
      )
    }

    const pdfBytes = await generateListaInscripcionesPDF(inscripciones)

    const tipoLabel =
      tipoInscripcion && tipoInscripcion !== 'todos'
        ? tipoInscripcion.replace('-', '_')
        : 'todas'
    const fileName = `lista_inscripciones_${tipoLabel}_${new Date().toISOString().split('T')[0]}.pdf`

    return binaryResponse(Buffer.from(pdfBytes), {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    })
  } catch (error) {
    console.error('Error al generar PDF de lista:', error)
    return NextResponse.json(
      { error: 'Error al generar PDF de lista' },
      { status: 500 }
    )
  }
}
