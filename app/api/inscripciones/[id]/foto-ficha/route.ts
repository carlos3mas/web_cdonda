import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { binaryResponse } from '@/lib/binary-response'
import { withDbRetry } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Sirve la foto de ficha de un jugador. Solo administradores autenticados.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const inscripcion = await withDbRetry((db) =>
      db.inscripcion.findUnique({
        where: { id: params.id },
        select: {
          fotoFicha: true,
          fotoFichaMimeType: true,
          nombreArchivoFotoFicha: true,
        },
      })
    )

    if (!inscripcion?.fotoFicha) {
      return NextResponse.json({ error: 'Foto de ficha no encontrada' }, { status: 404 })
    }

    const fileBuffer = Buffer.from(inscripcion.fotoFicha, 'base64')
    const contentType = inscripcion.fotoFichaMimeType || 'image/jpeg'
    const originalFilename = inscripcion.nombreArchivoFotoFicha || 'foto-ficha.jpg'

    return binaryResponse(fileBuffer, {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${originalFilename}"`,
      'Cache-Control': 'private, no-store',
    })
  } catch (error) {
    console.error('Error al servir foto de ficha:', error)
    return NextResponse.json({ error: 'Error al obtener la foto de ficha' }, { status: 500 })
  }
}
