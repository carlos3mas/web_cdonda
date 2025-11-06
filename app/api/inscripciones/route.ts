import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireAuth } from '@/lib/auth-middleware'
import { inscripcionRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'

// GET - Obtener todas las inscripciones (opcionalmente filtradas por tipo)
export async function GET(request: NextRequest) {
  // Proteger con autenticación
  const authError = await requireAuth(request)
  if (authError) return authError
  
  // Rate limiting
  const rateLimitError = apiRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status, headers: { 'Retry-After': String(rateLimitError.retryAfter) } }
    )
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const tipoInscripcion = searchParams.get('tipo')

    const where = tipoInscripcion && tipoInscripcion !== 'todos' 
      ? { tipoInscripcion } 
      : {}

    const inscripciones = await prisma.inscripcion.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(inscripciones)
  } catch (error) {
    console.error('Error al obtener inscripciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener inscripciones' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva inscripción
export async function POST(request: NextRequest) {
  // Rate limiting más restrictivo para inscripciones
  const rateLimitError = inscripcionRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status, headers: { 'Retry-After': String(rateLimitError.retryAfter) } }
    )
  }
  
  try {
    const formData = await request.formData()
    
    // Extraer datos del formulario
    const tipoInscripcion = formData.get('tipoInscripcion') as string
    const nombreJugador = formData.get('nombreJugador') as string
    const apellidos = formData.get('apellidos') as string
    const fechaNacimiento = formData.get('fechaNacimiento') as string
    const dni = formData.get('dni') as string
    const nombreTutor = formData.get('nombreTutor') as string
    const telefono1 = formData.get('telefono1') as string
    const telefono2 = formData.get('telefono2') as string
    const email = formData.get('email') as string
    const tieneHermanos = formData.get('tieneHermanos') as string
    const alergias = formData.get('alergias') as string
    const observaciones = formData.get('observaciones') as string
    const derechosImagen = formData.get('derechosImagen') as string
    const justificanteFile = formData.get('justificantePago') as File | null

    // Validar campos requeridos
    if (!nombreJugador || !apellidos || !fechaNacimiento || 
        !dni || !nombreTutor || !telefono1 || !email) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Validar que se haya adjuntado el justificante
    if (!justificanteFile) {
      return NextResponse.json(
        { error: 'Debes adjuntar el justificante de pago' },
        { status: 400 }
      )
    }

    // Validar el archivo con magic numbers y tamaño
    const fileValidation = await validateFile(justificanteFile, 5)
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error || 'Archivo no válido' },
        { status: 400 }
      )
    }

    let justificantePath: string | null = null
    let nombreArchivoJustificante: string | null = null

    // Guardar el archivo del justificante en carpeta PRIVADA
    if (justificanteFile && justificanteFile.size > 0) {
      // Crear directorio PRIVADO si no existe
      const justificantesDir = join(process.cwd(), 'storage', 'justificantes')
      if (!existsSync(justificantesDir)) {
        await mkdir(justificantesDir, { recursive: true })
      }

      // Generar nombre único y seguro para el archivo
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const extension = justificanteFile.name.split('.').pop()
      const fileName = `justificante-${timestamp}-${randomStr}.${extension}`
      const filePath = join(justificantesDir, fileName)
      justificantePath = fileName // Solo guardamos el nombre, no la ruta pública
      nombreArchivoJustificante = justificanteFile.name

      // Guardar archivo
      const bytes = await justificanteFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)
    }

    // Crear inscripción en la base de datos
    const inscripcion = await prisma.inscripcion.create({
      data: {
        tipoInscripcion: tipoInscripcion || 'campus-navidad',
        nombreJugador,
        apellidos,
        fechaNacimiento: new Date(fechaNacimiento),
        dni,
        nombreTutor,
        telefono1,
        telefono2: telefono2 || null,
        email,
        tieneHermanos: tieneHermanos === 'si',
        alergias: alergias || null,
        observaciones: observaciones || null,
        pagada: false,
        justificantePago: justificantePath,
        nombreArchivoJustificante,
        derechosImagen: derechosImagen === 'true'
      }
    })

    return NextResponse.json({
      success: true,
      inscripcionId: inscripcion.id,
      message: 'Inscripción creada correctamente'
    })
  } catch (error) {
    console.error('Error al crear inscripción:', error)
    return NextResponse.json(
      { error: 'Error al procesar la inscripción' },
      { status: 500 }
    )
  }
}

