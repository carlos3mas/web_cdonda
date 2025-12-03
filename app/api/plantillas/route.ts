import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireAuth } from '@/lib/auth-middleware'
import { uploadRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'

// GET - Obtener todas las plantillas o una específica por tipo
export async function GET(request: NextRequest) {
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError
  
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    if (tipo) {
      const plantilla = await prisma.plantillaPDF.findUnique({
        where: { tipoInscripcion: tipo }
      })
      return NextResponse.json(plantilla)
    }

    const plantillas = await prisma.plantillaPDF.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(plantillas)
  } catch (error) {
    console.error('Error al obtener plantillas:', error)
    return NextResponse.json(
      { error: 'Error al obtener plantillas' },
      { status: 500 }
    )
  }
}

// POST - Subir una nueva plantilla
export async function POST(request: NextRequest) {
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError
  
  // Rate limiting para subidas de archivos
  const rateLimitError = uploadRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status }
    )
  }
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tipoInscripcion = formData.get('tipoInscripcion') as string

    if (!file || !tipoInscripcion) {
      return NextResponse.json(
        { error: 'Faltan archivo o tipo de inscripción' },
        { status: 400 }
      )
    }

    // Validar que sea un PDF válido
    const fileValidation = await validateFile(file, 10) // Max 10MB para plantillas
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error || 'Archivo PDF no válido' },
        { status: 400 }
      )
    }

    // Validar que sea PDF específicamente
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Solo se permiten archivos PDF' },
        { status: 400 }
      )
    }

    // Crear directorio si no existe
    const templatesDir = join(process.cwd(), 'public', 'templates')
    if (!existsSync(templatesDir)) {
      await mkdir(templatesDir, { recursive: true })
    }

    // Generar nombre de archivo
    const fileName = `${tipoInscripcion}.pdf`
    const filePath = join(templatesDir, fileName)
    const rutaArchivo = `/templates/${fileName}`

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Verificar si ya existe una plantilla para este tipo
    const existingPlantilla = await prisma.plantillaPDF.findUnique({
      where: { tipoInscripcion }
    })

    let plantilla
    if (existingPlantilla) {
      // Actualizar plantilla existente
      plantilla = await prisma.plantillaPDF.update({
        where: { tipoInscripcion },
        data: {
          nombreArchivo: file.name,
          rutaArchivo,
          activa: true,
          updatedAt: new Date()
        }
      })
    } else {
      // Crear nueva plantilla
      plantilla = await prisma.plantillaPDF.create({
        data: {
          tipoInscripcion,
          nombreArchivo: file.name,
          rutaArchivo,
          activa: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      plantilla,
      message: 'Plantilla subida correctamente'
    })
  } catch (error) {
    console.error('Error al subir plantilla:', error)
    return NextResponse.json(
      { error: 'Error al subir plantilla' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar una plantilla
export async function DELETE(request: NextRequest) {
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError
  
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    if (!tipo) {
      return NextResponse.json(
        { error: 'Tipo de inscripción requerido' },
        { status: 400 }
      )
    }

    await prisma.plantillaPDF.delete({
      where: { tipoInscripcion: tipo }
    })

    return NextResponse.json({
      success: true,
      message: 'Plantilla eliminada correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar plantilla:', error)
    return NextResponse.json(
      { error: 'Error al eliminar plantilla' },
      { status: 500 }
    )
  }
}

