import { NextRequest, NextResponse } from 'next/server'
import { withDbRetry } from '@/lib/prisma'
import { fotoFichaUploadRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'
import { compressFile } from '@/lib/file-compression'
import { getFormDataUploadFile } from '@/lib/form-data-file'
import { getFotoFichaUploadErrorMessage } from '@/lib/db-errors'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 120

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json([])
  }

  try {
    const rows = await withDbRetry((db) =>
      db.inscripcion.findMany({
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
          sexo: true,
          nombreArchivoFotoFicha: true,
          fotoFichaMimeType: true,
        },
      })
    )

    return NextResponse.json(
      rows.map((row) => ({
        id: row.id,
        nombreJugador: row.nombreJugador,
        apellidos: row.apellidos,
        fechaNacimiento: row.fechaNacimiento,
        categoria: row.categoria,
        sexo: row.sexo,
        nombreArchivoFotoFicha: row.nombreArchivoFotoFicha,
        tieneFotoFicha: Boolean(row.nombreArchivoFotoFicha || row.fotoFichaMimeType),
      }))
    )
  } catch (error) {
    console.error('Error al buscar inscripciones anuales para foto ficha:', error)
    return NextResponse.json({ error: 'Error al buscar jugadores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const rateLimitError = fotoFichaUploadRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status, headers: { 'Retry-After': String(rateLimitError.retryAfter) } }
    )
  }

  try {
    const formData = await request.formData()
    const inscripcionId = String(formData.get('inscripcionId') || '')
    const fotoFile = getFormDataUploadFile(formData.get('fotoFicha') ?? formData.get('foto'))

    if (!inscripcionId) {
      return NextResponse.json({ error: 'Falta la inscripción' }, { status: 400 })
    }
    if (!fotoFile) {
      return NextResponse.json({ error: 'Debes adjuntar la foto de ficha' }, { status: 400 })
    }

    if (!fotoFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'La foto de ficha debe ser una imagen (JPG, PNG o WEBP).' },
        { status: 400 }
      )
    }

    const fileValidation = await validateFile(fotoFile, 8)
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error || 'Archivo no válido' }, { status: 400 })
    }

    const bytes = await fotoFile.arrayBuffer()
    let buffer = Buffer.from(bytes)
    const mimeType = fileValidation.type || fotoFile.type || 'image/jpeg'
    let outputMimeType = mimeType

    try {
      const compressResult = await compressFile(buffer, mimeType, 700)
      buffer = Buffer.from(compressResult.buffer)
      outputMimeType = compressResult.mimeType
    } catch (compressError) {
      console.warn('No se pudo comprimir la foto de ficha, se guarda el original:', compressError)
    }

    const existing = await withDbRetry((db) =>
      db.inscripcion.findUnique({
        where: { id: inscripcionId },
        select: {
          id: true,
          tipoInscripcion: true,
          nombreArchivoFotoFicha: true,
        },
      })
    )

    if (!existing || existing.tipoInscripcion !== 'anual') {
      return NextResponse.json({ error: 'Jugador anual no encontrado' }, { status: 404 })
    }

    const archivoNombre = fotoFile.name || 'foto-ficha.jpg'

    await withDbRetry((db) =>
      db.inscripcion.update({
        where: { id: inscripcionId },
        data: {
          fotoFicha: buffer.toString('base64'),
          fotoFichaMimeType: outputMimeType,
          nombreArchivoFotoFicha: archivoNombre,
        },
        select: { id: true },
      })
    )

    return NextResponse.json({
      success: true,
      reemplazado: Boolean(existing.nombreArchivoFotoFicha),
    })
  } catch (error) {
    console.error('Error al subir foto de ficha:', error)
    const { status, message } = getFotoFichaUploadErrorMessage(error)
    return NextResponse.json({ error: message }, { status })
  }
}
