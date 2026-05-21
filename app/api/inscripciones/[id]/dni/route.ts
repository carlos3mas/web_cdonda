import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { decrypt } from '@/lib/encryption'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAuth(request)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const lado = searchParams.get('lado')

  if (lado !== 'frontal' && lado !== 'reverso') {
    return NextResponse.json(
      { error: 'Parámetro "lado" debe ser "frontal" o "reverso"' },
      { status: 400 }
    )
  }

  try {
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: params.id },
      select: {
        tipoInscripcion: true,
        dniFrontalEncriptado: true,
        dniFrontalMimeType: true,
        dniReversoEncriptado: true,
        dniReversoMimeType: true,
      },
    })

    if (!inscripcion) {
      return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 })
    }

    if (!inscripcion.tipoInscripcion.startsWith('anual')) {
      return NextResponse.json(
        { error: 'Esta inscripción no tiene fotos de DNI' },
        { status: 400 }
      )
    }

    const encriptado =
      lado === 'frontal'
        ? inscripcion.dniFrontalEncriptado
        : inscripcion.dniReversoEncriptado
    const mimeType =
      lado === 'frontal'
        ? inscripcion.dniFrontalMimeType
        : inscripcion.dniReversoMimeType

    if (!encriptado) {
      return NextResponse.json(
        { error: `Foto de DNI (${lado}) no disponible` },
        { status: 404 }
      )
    }

    const imageBuffer = decrypt(encriptado)
    const body = new Uint8Array(imageBuffer)

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': mimeType || 'image/jpeg',
        'Content-Length': String(imageBuffer.length),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Error al servir foto DNI:', error)
    return NextResponse.json(
      { error: 'Error al recuperar la imagen' },
      { status: 500 }
    )
  }
}
