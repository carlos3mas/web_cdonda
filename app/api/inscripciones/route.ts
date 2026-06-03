import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { inscripcionRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { validateFile } from '@/lib/file-validation'
import { compressFile, getFileInfo } from '@/lib/file-compression'
import sharp from 'sharp'
import { encrypt } from '@/lib/encryption'
import {
  formatValidationIssues,
  getInscripcionSchema,
  getInscripcionAnualSchema,
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
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.max(1, Math.min(500, Number(limitParam))) : 200

    const where = tipoInscripcion && tipoInscripcion !== 'todos'
      ? { tipoInscripcion }
      : {}

    // Importante: para el panel admin NO devolvemos blobs base64 (justificante/firma),
    // solo metadatos y campos de tabla. Esto reduce muchísimo el tiempo de respuesta.
    const rawInscripciones = await prisma.inscripcion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        tipoInscripcion: true,
        nombreJugador: true,
        apellidos: true,
        fechaNacimiento: true,
        dni: true,
        direccion: true,
        localidad: true,
        codigoPostal: true,
        semanasCampus: true,
        diasSueltos: true,
        tallaCamiseta: true,
        tallaPantalon: true,
        tallaCalcetines: true,
        nombreTutor: true,
        telefono1: true,
        telefono2: true,
        enfermedad: true,
        medicacion: true,
        alergico: true,
        numeroSeguridadSocial: true,
        pagada: true,
        cuota1Pagada: true,
        cuota2Pagada: true,
        cuota3Pagada: true,
        nombreArchivoJustificante: true,
        nombreArchivoJustificanteCuota2: true,
        nombreArchivoJustificanteCuota3: true,
        justificantePagoMimeType: true,
        firmaMimeType: true,
        nombreArchivoFirma: true,
        derechosImagen: true,
        comentarios: true,
        email: true,
        sexo: true,
        categoria: true,
        modalidadPago: true,
        descuentoHermanos: true,
        dniFrontalEncriptado: true,
        dniReversoEncriptado: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Eliminamos los blobs cifrados del DNI y añadimos flags booleanos
    const inscripciones = rawInscripciones.map(({ dniFrontalEncriptado, dniReversoEncriptado, ...rest }) => ({
      ...rest,
      tieneDniFrontal: !!dniFrontalEncriptado,
      tieneDniReverso: !!dniReversoEncriptado,
    }))

    // Log para diagnóstico en producción
    console.log(`📊 Inscripciones obtenidas: ${inscripciones.length} (tipo: ${tipoInscripcion || 'todos'}, limit: ${limit})`)

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
    const isAnual = tipo === 'anual'
    const isCampusVerano = tipo === 'campus-verano'

    // ── Rama inscripción anual ────────────────────────────────────────────────
    if (isAnual) {
      const email = formData.get('email') as string
      const sexo = formData.get('sexo') as string
      const categoria = formData.get('categoria') as string
      const modalidadPago = formData.get('modalidadPago') as string
      const descuentoHermanos = formData.get('descuentoHermanos') as string
      const relacionTutor = formData.get('relacionTutor') as string
      const dniFrontalFile = formData.get('dniFrontal') as File | null
      const dniReversoFile = formData.get('dniReverso') as File | null

      const anualPayload = {
        nombreJugador, apellidos, fechaNacimiento, sexo, email,
        direccion: direccion || '', localidad: localidad || '',
        codigoPostal: codigoPostal || '', categoria,
        nombreTutor, dni, relacionTutor: relacionTutor || undefined,
        telefono1, telefono2: telefono2 || undefined,
        enfermedad: enfermedad || undefined, medicacion: medicacion || undefined,
        alergico: alergico || undefined,
        numeroSeguridadSocial: numeroSeguridadSocial || undefined,
        tallaCamiseta: tallaCamiseta || '',
        tallaPantalon: tallaPantalon || '',
        tallaCalcetines: tallaCalcetines || '',
        modalidadPago,
        descuentoHermanos: descuentoHermanos || 'no',
        derechosImagen: derechosImagen || undefined,
        comentarios: comentarios || undefined,
      }

      const parsedAnual = getInscripcionAnualSchema().safeParse(anualPayload)
      if (!parsedAnual.success) {
        const issues = parsedAnual.error.issues.map((i) => ({ path: i.path, message: i.message }))
        return NextResponse.json({ error: formatValidationIssues(issues), issues }, { status: 400 })
      }

      if (!justificanteFile) {
        return NextResponse.json({ error: 'Debes adjuntar el justificante de pago' }, { status: 400 })
      }
      if (!firmaFile || firmaFile.size === 0) {
        return NextResponse.json({ error: 'La firma del tutor es obligatoria' }, { status: 400 })
      }

      // Procesar justificante
      const justFileValidation = await validateFile(justificanteFile, 10)
      if (!justFileValidation.valid) {
        return NextResponse.json({ error: justFileValidation.error || 'Justificante no válido' }, { status: 400 })
      }
      const justBytes = await justificanteFile.arrayBuffer()
      let justBuffer = Buffer.from(justBytes)
      const justCompress = await compressFile(justBuffer, justFileValidation.type || justificanteFile.type, 800)
      justBuffer = Buffer.from(justCompress.buffer)

      // Procesar firma
      const firmaBytes = await firmaFile.arrayBuffer()
      let firmaBuffer = Buffer.from(firmaBytes)
      firmaBuffer = Buffer.from(
        await sharp(firmaBuffer)
          .png({ compressionLevel: 9 })
          .resize(800, 400, { fit: 'inside', withoutEnlargement: true })
          .toBuffer()
      )

      // Procesar y cifrar fotos DNI
      let dniFrontalEncriptado: string | null = null
      let dniFrontalMimeType: string | null = null
      let dniReversoEncriptado: string | null = null
      let dniReversoMimeType: string | null = null

      const needsDniEncryption =
        (dniFrontalFile && dniFrontalFile.size > 0) ||
        (dniReversoFile && dniReversoFile.size > 0)
      if (needsDniEncryption && !process.env.DNI_ENCRYPTION_KEY) {
        console.error('❌ DNI_ENCRYPTION_KEY no configurada')
        return NextResponse.json(
          {
            error:
              'El servidor no puede almacenar las fotos del DNI. Contacta con el club.',
            details:
              process.env.NODE_ENV === 'production'
                ? undefined
                : 'Falta DNI_ENCRYPTION_KEY en las variables de entorno (64 caracteres hex)',
          },
          { status: 503 }
        )
      }

      if (dniFrontalFile && dniFrontalFile.size > 0) {
        const dniValidation = await validateFile(dniFrontalFile, 10)
        if (!dniValidation.valid) {
          return NextResponse.json({ error: `DNI frontal: ${dniValidation.error}` }, { status: 400 })
        }
        const dniBytes = await dniFrontalFile.arrayBuffer()
        let dniBuffer = Buffer.from(dniBytes)
        if (dniValidation.type?.startsWith('image/')) {
          const compressed = await compressFile(dniBuffer, dniValidation.type, 1200)
          dniBuffer = Buffer.from(compressed.buffer)
          dniFrontalMimeType = compressed.mimeType
        } else {
          dniFrontalMimeType = dniValidation.type || dniFrontalFile.type
        }
        dniFrontalEncriptado = encrypt(dniBuffer)
        console.log(`🔐 DNI frontal cifrado (${getFileInfo(dniBuffer, 'dni').sizeFormatted})`)
      }

      if (dniReversoFile && dniReversoFile.size > 0) {
        const dniValidation = await validateFile(dniReversoFile, 10)
        if (!dniValidation.valid) {
          return NextResponse.json({ error: `DNI reverso: ${dniValidation.error}` }, { status: 400 })
        }
        const dniBytes = await dniReversoFile.arrayBuffer()
        let dniBuffer = Buffer.from(dniBytes)
        if (dniValidation.type?.startsWith('image/')) {
          const compressed = await compressFile(dniBuffer, dniValidation.type, 1200)
          dniBuffer = Buffer.from(compressed.buffer)
          dniReversoMimeType = compressed.mimeType
        } else {
          dniReversoMimeType = dniValidation.type || dniReversoFile.type
        }
        dniReversoEncriptado = encrypt(dniBuffer)
        console.log(`🔐 DNI reverso cifrado (${getFileInfo(dniBuffer, 'dni').sizeFormatted})`)
      }

      const baseData = {
        tipoInscripcion: 'anual' as const,
        nombreJugador,
        apellidos,
        fechaNacimiento: new Date(fechaNacimiento),
        dni: dni || '',
        email: email || null,
        sexo: sexo || null,
        categoria: categoria || null,
        modalidadPago: modalidadPago || null,
        direccion: direccion || null,
        localidad: localidad || null,
        codigoPostal: codigoPostal || null,
        nombreTutor,
        telefono1,
        telefono2: telefono2 || null,
        enfermedad: enfermedad || null,
        medicacion: medicacion || null,
        alergico: alergico || null,
        numeroSeguridadSocial: numeroSeguridadSocial || null,
        tallaCamiseta: tallaCamiseta || null,
        tallaPantalon: tallaPantalon || null,
        tallaCalcetines: tallaCalcetines || null,
        pagada: modalidadPago === 'unico',
        justificantePago: justBuffer.toString('base64'),
        justificantePagoMimeType: justCompress.mimeType,
        nombreArchivoJustificante: justificanteFile.name,
        firma: firmaBuffer.toString('base64'),
        firmaMimeType: 'image/png',
        nombreArchivoFirma: 'firma.png',
        derechosImagen: derechosImagen === 'true',
        comentarios: comentarios || null,
        dniFrontalEncriptado,
        dniFrontalMimeType,
        dniReversoEncriptado,
        dniReversoMimeType,
      }

      let inscripcionAnual
      try {
        inscripcionAnual = await prisma.inscripcion.create({
          data: {
            ...baseData,
            descuentoHermanos: descuentoHermanos || 'no',
            cuota1Pagada: true,
            cuota2Pagada: false,
            cuota3Pagada: false,
          } as any,
        })
      } catch (error) {
        // Compatibilidad temporal: si el cliente/BD aún no tienen columnas nuevas, guarda sin ellas.
        const message = error instanceof Error ? error.message : String(error)
        const canFallback =
          message.includes('Unknown argument') ||
          message.includes('no such column') ||
          message.includes('column')

        if (!canFallback) throw error

        console.warn('⚠️ Guardado anual en modo compatibilidad (faltan columnas nuevas):', message)
        inscripcionAnual = await prisma.inscripcion.create({ data: baseData as any })
      }

      console.log('✅ Inscripción anual guardada:', inscripcionAnual.id)
      return NextResponse.json({ success: true, inscripcionId: inscripcionAnual.id, message: 'Inscripción anual creada correctamente' })
    }
    // ── Fin rama anual ────────────────────────────────────────────────────────

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
      buffer = Buffer.from(compressResult.buffer)
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
      buffer = Buffer.from(
        await sharp(buffer)
          .png({ compressionLevel: 9 })
          .resize(800, 400, { fit: 'inside', withoutEnlargement: true })
          .toBuffer()
      )
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
        where: { id: nuevaInscripcion.id },
        select: { id: true },
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

