import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
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
    
    // El filename es el ID de la inscripción
    const inscripcionId = filename
    
    // Buscar la inscripción en la base de datos
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: inscripcionId },
      select: {
        justificantePago: true,
        justificantePagoMimeType: true,
        nombreArchivoJustificante: true,
      },
    })
    
    if (!inscripcion || !inscripcion.justificantePago) {
      return NextResponse.json(
        { error: 'Justificante no encontrado' },
        { status: 404 }
      )
    }
    
    // Convertir base64 a buffer
    const fileBuffer = Buffer.from(inscripcion.justificantePago, 'base64')
    
    // Usar el MIME type guardado en la BD
    const contentType = inscripcion.justificantePagoMimeType || 'application/octet-stream'
    const originalFilename = inscripcion.nombreArchivoJustificante || 'justificante'
    
    // Devolver el archivo con headers apropiados
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${originalFilename}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error al servir justificante:', error)
    return NextResponse.json(
      { error: 'Error al obtener el archivo' },
      { status: 500 }
    )
  }
}

