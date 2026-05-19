import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { inscripcionRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'
import { compressFile, getFileInfo } from '@/lib/file-compression'
import sharp from 'sharp'
import {
  formatValidationIssues,
  getInscripcionSchema,
  type InscripcionValidationPayload,
} from '@/lib/inscripcionValidation'

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
    const direccion = formData.get('direccion') as string
    const localidad = formData.get('localidad') as string
    const codigoPostal = formData.get('codigoPostal') as string
    const semanasCampus = formData.get('semanasCampus') as string
    const diasSueltos = formData.get('diasSueltos') as string
    const nombreTutor = formData.get('nombreTutor') as string
    const telefono1 = formData.get('telefono1') as string
    const telefono2 = formData.get('telefono2') as string
    const enfermedad = formData.get('enfermedad') as string
    const medicacion = formData.get('medicacion') as string
    const alergico = formData.get('alergico') as string
    const numeroSeguridadSocial = formData.get('numeroSeguridadSocial') as string
    const derechosImagen = formData.get('derechosImagen') as string
    const comentarios = formData.get('comentarios') as string
    const tallaCamiseta = formData.get('tallaCamiseta') as string
    const tallaPantalon = formData.get('tallaPantalon') as string
    const tallaCalcetines = formData.get('tallaCalcetines') as string
    const justificanteFile = formData.get('justificantePago') as File | null
    const firmaFile = formData.get('firmaTutor') as File | null

    const tipo = tipoInscripcion || 'campus-verano'
    const isCampusVerano = tipo === 'campus-verano'

    const schema = getInscripcionSchema(isCampusVerano)
    const payload: InscripcionValidationPayload = {
      tipoInscripcion: tipo,
      nombreJugador,
      apellidos,
      fechaNacimiento,
      dni,
      direccion: direccion || undefined,
      localidad: localidad || undefined,
      codigoPostal: codigoPostal || undefined,
      semanasCampus: semanasCampus || undefined,
      diasSueltos: diasSueltos || undefined,
      nombreTutor,
      telefono1,
      telefono2: telefono2 || undefined,
      enfermedad: enfermedad || undefined,
      medicacion: medicacion || undefined,
      alergico: alergico || undefined,
      numeroSeguridadSocial: numeroSeguridadSocial || undefined,
      tallaCamiseta: tallaCamiseta || undefined,
      tallaPantalon: tallaPantalon || undefined,
      tallaCalcetines: tallaCalcetines || undefined,
      derechosImagen: derechosImagen || undefined,
      comentarios: comentarios || undefined
    }

    // Log para diagnóstico
    console.log('📋 Payload recibido:', JSON.stringify(payload, null, 2))

    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path,
        message: i.message,
      }))
      console.error('❌ Error de validación:', JSON.stringify(issues, null, 2))
      return NextResponse.json(
        {
          error: formatValidationIssues(issues),
          issues,
        },
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

    let justificanteBase64: string | null = null
    let justificanteMimeType: string | null = null
    let nombreArchivoJustificante: string | null = null
    let firmaBase64: string | null = null
    let firmaMimeType: string | null = null
    let nombreArchivoFirma: string | null = null

    // Convertir el justificante a base64 y guardarlo en BD
    if (justificanteFile && justificanteFile.size > 0) {
      // Obtener buffer del archivo
      const bytes = await justificanteFile.arrayBuffer()
      let buffer: Buffer = Buffer.from(bytes as ArrayBuffer)

      // Log del tamaño original
      const originalInfo = getFileInfo(buffer, justificanteFile.name)
      console.log(`📎 Justificante original: ${originalInfo.sizeFormatted}`)

      // Comprimir archivo si es imagen (el tipo prioritario es el detectado por magic numbers o el del formData)
      const compressResult = await compressFile(buffer, fileValidation.type || justificanteFile.type, 800)
      buffer = compressResult.buffer
      justificanteMimeType = compressResult.mimeType

      // Convertir a base64
      justificanteBase64 = buffer.toString('base64')
      nombreArchivoJustificante = justificanteFile.name

      const finalInfo = getFileInfo(buffer, justificanteFile.name)
      console.log(`💾 Justificante convertido a base64: ${finalInfo.sizeFormatted}`)
    }

    // Convertir la firma a base64 y guardarla en BD
    if (firmaFile && firmaFile.size > 0) {
      // Obtener buffer del archivo
      const bytes = await firmaFile.arrayBuffer()
      let buffer: Buffer = Buffer.from(bytes as ArrayBuffer)

      // Log del tamaño original
      const originalInfo = getFileInfo(buffer, 'firma.png')
      console.log(`✍️  Firma original: ${originalInfo.sizeFormatted}`)

      // Comprimir firma en PNG (pdf-lib no soporta WebP)
      buffer = await sharp(buffer)
        .png({ compressionLevel: 9 })
        .resize(800, 400, { fit: 'inside', withoutEnlargement: true })
        .toBuffer()
      firmaMimeType = 'image/png'

      // Convertir a base64
      firmaBase64 = buffer.toString('base64')
      nombreArchivoFirma = firmaFile.name || 'firma.png'

      const finalInfo = getFileInfo(buffer, 'firma.png')
      console.log(`💾 Firma convertida a base64: ${finalInfo.sizeFormatted}`)
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
          direccion: direccion || null,
          localidad: localidad || null,
          codigoPostal: codigoPostal || null,
          semanasCampus: semanasCampus || null,
          diasSueltos: diasSueltos || null,
          tallaCamiseta: tallaCamiseta || null,
          tallaPantalon: tallaPantalon || null,
          tallaCalcetines: tallaCalcetines || null,
          nombreTutor,
          telefono1,
          telefono2: telefono2 || null,
          enfermedad: enfermedad || null,
          medicacion: medicacion || null,
          alergico: alergico || null,
          numeroSeguridadSocial: numeroSeguridadSocial || null,
          pagada: false,
          justificantePago: justificanteBase64,
          justificantePagoMimeType: justificanteMimeType,
          nombreArchivoJustificante,
          firma: firmaBase64,
          firmaMimeType: firmaMimeType,
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

