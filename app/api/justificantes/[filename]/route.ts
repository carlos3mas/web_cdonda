import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { binaryResponse } from '@/lib/binary-response'
import { prisma } from '@/lib/prisma'

/**
 * API segura para servir justificantes de pago
 * Solo accesible por administradores autenticados
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError
  
  try {
    const { filename } = params
    const cuota = new URL(request.url).searchParams.get('cuota') || '1'
    
    // El filename es el ID de la inscripción
    const inscripcionId = filename
    
    // Buscar la inscripción en la base de datos
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: inscripcionId },
      select: {
        justificantePago: true,
        justificantePagoMimeType: true,
        nombreArchivoJustificante: true,
        justificantePagoCuota2: true,
        justificantePagoCuota2MimeType: true,
        nombreArchivoJustificanteCuota2: true,
        justificantePagoCuota3: true,
        justificantePagoCuota3MimeType: true,
        nombreArchivoJustificanteCuota3: true,
      },
    })
    
    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Justificante no encontrado' },
        { status: 404 }
      )
    }

    const payload =
      cuota === '2'
        ? {
            file: inscripcion.justificantePagoCuota2,
            mime: inscripcion.justificantePagoCuota2MimeType,
            name: inscripcion.nombreArchivoJustificanteCuota2,
          }
        : cuota === '3'
          ? {
              file: inscripcion.justificantePagoCuota3,
              mime: inscripcion.justificantePagoCuota3MimeType,
              name: inscripcion.nombreArchivoJustificanteCuota3,
            }
          : {
              file: inscripcion.justificantePago,
              mime: inscripcion.justificantePagoMimeType,
              name: inscripcion.nombreArchivoJustificante,
            }

    if (!payload.file) {
      return NextResponse.json(
        { error: `Justificante de cuota ${cuota} no encontrado` },
        { status: 404 }
      )
    }

    const fileBuffer = Buffer.from(payload.file, 'base64')
    const contentType = payload.mime || 'application/octet-stream'
    const originalFilename = payload.name || `justificante-cuota-${cuota}`
    
    return binaryResponse(fileBuffer, {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${originalFilename}"`,
      'Cache-Control': 'private, max-age=3600, no-transform',
    })
  } catch (error) {
    console.error('Error al servir justificante:', error)
    return NextResponse.json(
      { error: 'Error al obtener el archivo' },
      { status: 500 }
    )
  }
}

