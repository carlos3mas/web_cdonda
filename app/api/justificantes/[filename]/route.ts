import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireAuth } from '@/lib/auth-middleware'

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
    
    // Validar que el nombre del archivo sea seguro (sin path traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Nombre de archivo no válido' },
        { status: 400 }
      )
    }
    
    // Ruta al archivo en storage privado
    const filePath = join(process.cwd(), 'storage', 'justificantes', filename)
    
    // Verificar que el archivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      )
    }
    
    // Leer el archivo
    const fileBuffer = await readFile(filePath)
    
    // Determinar el tipo MIME basado en la extensión
    const extension = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case 'pdf':
        contentType = 'application/pdf'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }
    
    // Devolver el archivo con headers apropiados
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
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

