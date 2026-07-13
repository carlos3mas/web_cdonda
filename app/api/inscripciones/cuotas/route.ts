import { NextRequest, NextResponse } from 'next/server'
import { withDbRetry } from '@/lib/prisma'
import { cuotaUploadRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'
import { compressFile } from '@/lib/file-compression'
import { isPagoUnico } from '@/lib/anualConfig'
import { getFormDataUploadFile } from '@/lib/form-data-file'
import { getCuotaUploadErrorMessage } from '@/lib/db-errors'

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
          modalidadPago: true,
          cuota1Pagada: true,
          cuota2Pagada: true,
          pagada: true,
          nombreArchivoJustificante: true,
          nombreArchivoJustificanteCuota2: true,
        },
      })
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error al buscar inscripciones anuales para cuotas:', error)
    return NextResponse.json({ error: 'Error al buscar jugadores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const rateLimitError = cuotaUploadRateLimit(request)
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
    const justificanteFile = getFormDataUploadFile(
      formData.get('justificantePago') ?? formData.get('justificante')
    )

    if (!inscripcionId) {
      return NextResponse.json({ error: 'Falta la inscripción' }, { status: 400 })
    }
    if (cuota !== '1' && cuota !== '2') {
      return NextResponse.json({ error: 'Cuota inválida' }, { status: 400 })
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
    const mimeType = fileValidation.type || justificanteFile.type || 'application/octet-stream'
    let outputMimeType = mimeType

    try {
      const compressResult = await compressFile(buffer, mimeType, 900)
      buffer = Buffer.from(compressResult.buffer)
      outputMimeType = compressResult.mimeType
    } catch (compressError) {
      console.warn('No se pudo comprimir el justificante, se guarda el original:', compressError)
    }

    const existing = await withDbRetry((db) =>
      db.inscripcion.findUnique({
        where: { id: inscripcionId },
        select: {
          id: true,
          tipoInscripcion: true,
          modalidadPago: true,
          cuota1Pagada: true,
          cuota2Pagada: true,
        },
      })
    )

    if (!existing || existing.tipoInscripcion !== 'anual') {
      return NextResponse.json({ error: 'Jugador anual no encontrado' }, { status: 404 })
    }

    const pagoUnico = isPagoUnico(existing.modalidadPago)
    const esFraccionado =
      existing.modalidadPago === 'fraccionado' || existing.modalidadPago == null
    const archivoNombre = justificanteFile.name || 'justificante'

    if (cuota === '1') {
      if (!pagoUnico && !esFraccionado) {
        return NextResponse.json(
          { error: 'Modalidad de pago no válida para cuota 1. Contacta con el club si el problema continúa.' },
          { status: 400 }
        )
      }

      await withDbRetry((db) =>
        db.inscripcion.update({
          where: { id: inscripcionId },
          data: {
            justificantePago: buffer.toString('base64'),
            justificantePagoMimeType: outputMimeType,
            nombreArchivoJustificante: archivoNombre,
            cuota1Pagada: true,
            pagada: pagoUnico ? true : !!existing.cuota2Pagada,
          },
          select: { id: true },
        })
      )

      return NextResponse.json({ success: true, cuota: '1', reemplazado: true })
    }

    if (pagoUnico) {
      return NextResponse.json(
        { error: 'Este jugador tiene pago único. Sube el justificante como pago único (cuota 1).' },
        { status: 400 }
      )
    }
    if (!esFraccionado) {
      return NextResponse.json(
        { error: 'Modalidad de pago no válida para cuota 2.' },
        { status: 400 }
      )
    }

    await withDbRetry((db) =>
      db.inscripcion.update({
        where: { id: inscripcionId },
        data: {
          justificantePagoCuota2: buffer.toString('base64'),
          justificantePagoCuota2MimeType: outputMimeType,
          nombreArchivoJustificanteCuota2: archivoNombre,
          cuota2Pagada: true,
          pagada: !!existing.cuota1Pagada,
        },
        select: { id: true },
      })
    )

    return NextResponse.json({ success: true, cuota: '2', reemplazado: true })
  } catch (error) {
    console.error('Error al subir justificante de cuota:', error)
    const { status, message } = getCuotaUploadErrorMessage(error)
    return NextResponse.json({ error: message }, { status })
  }
}
