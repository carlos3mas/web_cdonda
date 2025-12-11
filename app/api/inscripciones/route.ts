import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { requireAuth } from '@/lib/auth-middleware'
import { inscripcionRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'
import { compressFile, getFileInfo } from '@/lib/file-compression'
import { z } from 'zod'

// Deshabilitar cache para estas rutas
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Obtener todas las inscripciones (opcionalmente filtradas por tipo)
export async function GET(request: NextRequest) {
  // Deshabilitar cache para asegurar datos frescos
  const headers = new Headers()
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  headers.set('Pragma', 'no-cache')
  headers.set('Expires', '0')
  
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
    
    // Log para diagnóstico en producción
    console.log(`📊 Inscripciones obtenidas: ${inscripciones.length} (tipo: ${tipoInscripcion || 'todos'})`)
    
    return NextResponse.json(inscripciones, { headers })
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
    const enfermedad = formData.get('enfermedad') as string
    const medicacion = formData.get('medicacion') as string
    const alergico = formData.get('alergico') as string
    const numeroSeguridadSocial = formData.get('numeroSeguridadSocial') as string
    const derechosImagen = formData.get('derechosImagen') as string
    const comentarios = formData.get('comentarios') as string
    const justificanteFile = formData.get('justificantePago') as File | null
    const firmaFile = formData.get('firmaTutor') as File | null

    const schema = z.object({
      tipoInscripcion: z.enum(['campus-navidad','campus-pascua','campus-verano','anual']).optional(),
      nombreJugador: z.string().min(2),
      apellidos: z.string().min(2),
      fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dni: z.string().min(8).max(20),
      nombreTutor: z.string().min(2),
      telefono1: z.string().min(9).max(20),
      telefono2: z.string().optional().refine((v) => !v || (v.length >= 9 && v.length <= 20)),
      enfermedad: z.string().optional(),
      medicacion: z.string().optional(),
      alergico: z.string().optional(),
      numeroSeguridadSocial: z.string().optional(),
      derechosImagen: z.string().optional(),
      comentarios: z.string().optional()
    })
    const payload = {
      tipoInscripcion,
      nombreJugador,
      apellidos,
      fechaNacimiento,
      dni,
      nombreTutor,
      telefono1,
      telefono2: telefono2 || undefined,
      enfermedad: enfermedad || undefined,
      medicacion: medicacion || undefined,
      alergico: alergico || undefined,
      numeroSeguridadSocial: numeroSeguridadSocial || undefined,
      derechosImagen: derechosImagen || undefined,
      comentarios: comentarios || undefined
    }
    
    // Log para diagnóstico
    console.log('📋 Payload recibido:', JSON.stringify(payload, null, 2))
    
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      console.error('❌ Error de validación:', JSON.stringify(parsed.error.issues, null, 2))
      return NextResponse.json(
        { error: 'Datos inválidos', issues: parsed.error.issues.map(i => ({ path: i.path, message: i.message })) },
        { status: 400 }
      )
    }

    // Validar campos requeridos
    

    // Validar que se haya adjuntado el justificante
    if (!justificanteFile) {
      return NextResponse.json(
        { error: 'Debes adjuntar el justificante de pago' },
        { status: 400 }
      )
    }

    // Validar que se haya adjuntado la firma
    if (!firmaFile || firmaFile.size === 0) {
      return NextResponse.json(
        { error: 'La firma del tutor es obligatoria y no se ha recibido correctamente. Por favor, inténtalo de nuevo.' },
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
    let firmaPath: string | null = null
    let nombreArchivoFirma: string | null = null

    // Guardar el archivo del justificante en carpeta PRIVADA
    if (justificanteFile && justificanteFile.size > 0) {
      // Crear directorio PRIVADO si no existe
      const justificantesDir = join(process.cwd(), 'storage', 'justificantes')
      if (!existsSync(justificantesDir)) {
        await mkdir(justificantesDir, { recursive: true })
      }

      // Obtener buffer del archivo (asegurando tipo Buffer de Node.js)
      const bytes = await justificanteFile.arrayBuffer()
      let buffer: Buffer = Buffer.from(bytes as ArrayBuffer)
      
      // Log del tamaño original
      const originalInfo = getFileInfo(buffer, justificanteFile.name)
      console.log(`📎 Justificante original: ${originalInfo.sizeFormatted}`)
      
      // Comprimir archivo si es imagen
      buffer = (await compressFile(buffer, justificanteFile.type, 800)) as Buffer // Max 800KB
      
      // Generar nombre único y seguro para el archivo
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const extension = justificanteFile.name.split('.').pop()
      const fileName = `justificante-${timestamp}-${randomStr}.${extension}`
      const filePath = join(justificantesDir, fileName)
      justificantePath = fileName // Solo guardamos el nombre, no la ruta pública
      nombreArchivoJustificante = justificanteFile.name

      // Guardar archivo comprimido
      await writeFile(filePath, buffer)
      
      const finalInfo = getFileInfo(buffer, fileName)
      console.log(`💾 Justificante guardado: ${finalInfo.sizeFormatted}`)
    }

    if (firmaFile && firmaFile.size > 0) {
      const firmasDir = join(process.cwd(), 'storage', 'firmas')
      if (!existsSync(firmasDir)) {
        await mkdir(firmasDir, { recursive: true })
      }

      // Obtener buffer del archivo (asegurando tipo Buffer de Node.js)
      const bytes = await firmaFile.arrayBuffer()
      let buffer: Buffer = Buffer.from(bytes as ArrayBuffer)
      
      // Log del tamaño original
      const originalInfo = getFileInfo(buffer, 'firma.png')
      console.log(`✍️  Firma original: ${originalInfo.sizeFormatted}`)
      
      // Comprimir firma (las firmas suelen ser PNG grandes)
      buffer = (await compressFile(buffer, 'image/png', 200)) as Buffer // Max 200KB para firmas
      
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(7)
      const extension = 'png'
      const fileName = `firma-${timestamp}-${randomStr}.${extension}`
      const filePath = join(firmasDir, fileName)
      firmaPath = fileName
      nombreArchivoFirma = firmaFile.name || 'firma.png'

      // Guardar firma comprimida
      await writeFile(filePath, buffer)
      
      const finalInfo = getFileInfo(buffer, fileName)
      console.log(`💾 Firma guardada: ${finalInfo.sizeFormatted}`)
    }

    // Crear inscripción en la base de datos
    console.log('🔄 [INSCRIPCIÓN] Iniciando proceso de guardado en base de datos...')
    console.log('📝 [INSCRIPCIÓN] Datos a guardar:', {
      tipoInscripcion: tipoInscripcion || 'campus-navidad',
      nombreJugador,
      apellidos,
      dni,
      nombreTutor
    })
    
    // Usar una transacción explícita para asegurar que se confirme correctamente
    const inscripcion = await prisma.$transaction(async (tx) => {
      console.log('💾 [INSCRIPCIÓN] Ejecutando transacción de base de datos...')
      
      const nuevaInscripcion = await tx.inscripcion.create({
        data: {
          tipoInscripcion: (parsed.data.tipoInscripcion || 'campus-navidad'),
          nombreJugador,
          apellidos,
          fechaNacimiento: new Date(fechaNacimiento),
          dni,
          nombreTutor,
          telefono1,
          telefono2: telefono2 || null,
          enfermedad: enfermedad || null,
          medicacion: medicacion || null,
          alergico: alergico || null,
          numeroSeguridadSocial: numeroSeguridadSocial || null,
          pagada: false,
          justificantePago: justificantePath,
          nombreArchivoJustificante,
          firma: firmaPath,
          nombreArchivoFirma,
          derechosImagen: derechosImagen === 'true',
          comentarios: comentarios || null
        }
      })
      
      console.log('✅ [INSCRIPCIÓN] Registro creado en base de datos con ID:', nuevaInscripcion.id)
      
      // Verificar que la inscripción se creó correctamente
      console.log('🔍 [INSCRIPCIÓN] Verificando que el registro se guardó correctamente...')
      const verificacion = await tx.inscripcion.findUnique({
        where: { id: nuevaInscripcion.id }
      })
      
      if (!verificacion) {
        console.error('❌ [INSCRIPCIÓN] ERROR: El registro no se encontró después de crearse')
        throw new Error('La inscripción no se pudo verificar después de crearse')
      }
      
      console.log('✅ [INSCRIPCIÓN] Verificación exitosa - Registro confirmado en base de datos')
      return nuevaInscripcion
    })

    // Log para producción - verificar que se guardó
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ [INSCRIPCIÓN] INSCRIPCIÓN GUARDADA EXITOSAMENTE EN BASE DE DATOS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 [INSCRIPCIÓN] Detalles:', {
      id: inscripcion.id,
      nombreJugador: inscripcion.nombreJugador,
      apellidos: inscripcion.apellidos,
      tipoInscripcion: inscripcion.tipoInscripcion,
      createdAt: inscripcion.createdAt,
      pagada: inscripcion.pagada
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return NextResponse.json({
      success: true,
      inscripcionId: inscripcion.id,
      message: 'Inscripción creada correctamente'
    })
  } catch (error) {
    console.error('❌ Error al crear inscripción:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log detallado para diagnóstico en producción
    console.error('Detalles del error:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : undefined,
      // Log de Prisma si es un error de Prisma
      ...(error && typeof error === 'object' && 'code' in error ? { prismaCode: error.code } : {})
    })
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la inscripción', 
        details: process.env.NODE_ENV === 'production' 
          ? 'Error interno del servidor' 
          : errorMessage 
      },
      { status: 500 }
    )
  }
}

