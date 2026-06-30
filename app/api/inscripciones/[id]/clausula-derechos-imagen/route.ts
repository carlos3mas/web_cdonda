import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { binaryResponse } from '@/lib/binary-response'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: params.id },
      select: {
        documentoDerechosImagen: true,
        documentoDerechosImagenMimeType: true,
        nombreArchivoDerechosImagen: true,
      },
    })

    if (!inscripcion?.documentoDerechosImagen) {
      return NextResponse.json(
        { error: 'Documento de derechos de imagen no encontrado' },
        { status: 404 }
      )
    }

    const fileBuffer = Buffer.from(inscripcion.documentoDerechosImagen, 'base64')
    const fileName =
      inscripcion.nombreArchivoDerechosImagen || 'clausula-derechos-imagen.pdf'

    return binaryResponse(fileBuffer, {
      'Content-Type': inscripcion.documentoDerechosImagenMimeType || 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'private, max-age=3600, no-transform',
    })
  } catch (error) {
    console.error('Error al servir cláusula de derechos de imagen:', error)
    return NextResponse.json({ error: 'Error al obtener el documento' }, { status: 500 })
  }
}
