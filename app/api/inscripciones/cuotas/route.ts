import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { inscripcionRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'
import { compressFile } from '@/lib/file-compression'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json([])
  }

  try {
    const rows = await prisma.inscripcion.findMany({
      where: {
        tipoInscripcion: 'anual',
        OR: [
          { nombreJugador: { contains: q } },
          { apellidos: { contains: q } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        nombreJugador: true,
        apellidos: true,
        fechaNacimiento: true,
        categoria: true,
        modalidadPago: true,
        cuota1Pagada: true,
        cuota2Pagada: true,
      },
    })

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error al buscar inscripciones anuales para cuotas:', error)
    return NextResponse.json({ error: 'Error al buscar jugadores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const rateLimitError = inscripcionRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status, headers: { 'Retry-After': String(rateLimitError.retryAfter) } }
    )
  }

  try {
    const formData = await request.formData()
    const inscripcionId = String(formData.get('inscripcionId') || '')
    const cuota = String(formData.get('cuota') || '')
    // Compatibilidad: aceptamos ambos nombres de campo por posibles bundles en caché.
    const justificanteRaw =
      formData.get('justificantePago') ??
      formData.get('justificante')
    const justificanteFile =
      justificanteRaw instanceof File && justificanteRaw.size > 0 ? justificanteRaw : null

    if (!inscripcionId) {
      return NextResponse.json({ error: 'Falta la inscripción' }, { status: 400 })
    }
    if (cuota !== '2') {
      return NextResponse.json({ error: 'Cuota inválida (solo cuota 2)' }, { status: 400 })
    }
    if (!justificanteFile) {
      return NextResponse.json({ error: 'Debes adjuntar el justificante' }, { status: 400 })
    }

    const fileValidation = await validateFile(justificanteFile, 10)
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error || 'Archivo no válido' }, { status: 400 })
    }

    const bytes = await justificanteFile.arrayBuffer()
    let buffer = Buffer.from(bytes)
    const compressResult = await compressFile(buffer, fileValidation.type || justificanteFile.type, 900)
    buffer = Buffer.from(compressResult.buffer)

    const existing = await prisma.inscripcion.findUnique({
      where: { id: inscripcionId },
      select: { id: true, tipoInscripcion: true, modalidadPago: true, cuota1Pagada: true },
    })

    if (!existing || existing.tipoInscripcion !== 'anual') {
      return NextResponse.json({ error: 'Jugador anual no encontrado' }, { status: 404 })
    }
    if (existing.modalidadPago === 'unico' || existing.modalidadPago === 'anual') {
      return NextResponse.json({ error: 'Este jugador tiene modalidad de pago único' }, { status: 400 })
    }

    const data = {
      justificantePagoCuota2: buffer.toString('base64'),
      justificantePagoCuota2MimeType: compressResult.mimeType,
      nombreArchivoJustificanteCuota2: justificanteFile.name,
      cuota2Pagada: true,
      // En fraccionado, queda pagada cuando cuota1 y cuota2 están en true.
      pagada: !!existing.cuota1Pagada,
    }

    await prisma.inscripcion.update({
      where: { id: inscripcionId },
      data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al subir justificante de cuota:', error)
    return NextResponse.json({ error: 'Error al guardar justificante de cuota' }, { status: 500 })
  }
}
