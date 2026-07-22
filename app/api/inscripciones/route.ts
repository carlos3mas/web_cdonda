import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { inscripcionRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { getInscripcionesForAdminList } from '@/lib/inscripciones-admin'
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
import { generateClausulaDerechosImagenDocument } from '@/lib/anualDocuments'
import { Prisma } from '@prisma/client'

const ANUAL_OPTIONAL_SCHEMA_FIELDS = [
  'dniJugador',
  'documentoDerechosImagen',
  'documentoDerechosImagenMimeType',
  'nombreArchivoDerechosImagen',
] as const

function stripAnualOptionalFields<T extends Record<string, unknown>>(data: T) {
  const result = { ...data }
  for (const key of ANUAL_OPTIONAL_SCHEMA_FIELDS) {
    delete result[key]
  }
  return result
}

function isPrismaSchemaMismatch(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    (error instanceof Error && error.name === 'PrismaClientValidationError') ||
    message.includes('Unknown argument') ||
    normalized.includes('no such column') ||
    normalized.includes('no column named') ||
    normalized.includes('has no column named') ||
    normalized.includes('sqlite_error') ||
    normalized.includes('sqlite_unknown')
  )
}

function isMissingPadresSeparadosColumn(error: unknown): boolean {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase()
  return message.includes('padresseparados')
}

async function createAnualInscripcion(createData: Prisma.InscripcionCreateInput) {
  try {
    return await prisma.inscripcion.create({ data: createData })
  } catch (error) {
    if (isMissingPadresSeparadosColumn(error)) {
      const migrationError = new Error(
        'Falta la columna padresSeparados en Turso. Ejecuta npm run db:apply-migrations en el servidor.'
      )
      migrationError.name = 'SchemaMigrationRequired'
      throw migrationError
    }

    if (!isPrismaSchemaMismatch(error)) throw error

    const shortMsg = shortenPrismaErrorMessage(
      error instanceof Error ? error.message : String(error)
    )
    console.warn(
      '⚠️ Reintentando inscripción anual sin otros campos opcionales:',
      shortMsg
    )

    return await prisma.inscripcion.create({
      data: stripAnualOptionalFields(createData) as Prisma.InscripcionCreateInput,
    })
  }
}

function shortenPrismaErrorMessage(message: string): string {
  return message
    .replace(/justificantePago:\s*"[^"]{100,}"/g, 'justificantePago: "<truncado>"')
    .replace(/firma:\s*"[^"]{100,}"/g, 'firma: "<truncado>"')
    .replace(/documentoDerechosImagen:\s*"[^"]{100,}"/g, 'documentoDerechosImagen: "<truncado>"')
    .replace(/dniFrontalEncriptado:\s*"[^"]{100,}"/g, 'dniFrontalEncriptado: "<truncado>"')
    .replace(/dniReversoEncriptado:\s*"[^"]{100,}"/g, 'dniReversoEncriptado: "<truncado>"')
    .replace(/fotoFicha:\s*"[^"]{100,}"/g, 'fotoFicha: "<truncado>"')
    .slice(0, 1500)
}

// Deshabilitar cache para estas rutas
export const dynamic = 'force-dynamic'
export const maxDuration = 120
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
    const offsetParam = searchParams.get('offset')
    const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : 50
    const offset = offsetParam ? Math.max(0, Number(offsetParam)) : 0

    const inscripciones = await getInscripcionesForAdminList(
      { tipo: tipoInscripcion },
      limit,
      offset
    )

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
      const padresSeparados = formData.get('padresSeparados') as string
      const relacionTutor = formData.get('relacionTutor') as string
      const dniJugador = (formData.get('dniJugador') as string) || ''
      const dniFrontalFile = formData.get('dniFrontal') as File | null
      const dniReversoFile = formData.get('dniReverso') as File | null
      const fotoFichaFile = formData.get('fotoFicha') as File | null

      const anualPayload = {
        nombreJugador, apellidos, dniJugador, fechaNacimiento, sexo, email,
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
        padresSeparados: padresSeparados || undefined,
        derechosImagen: derechosImagen || undefined,
        comentarios: comentarios || undefined,
      }

      const parsedAnual = getInscripcionAnualSchema().safeParse(anualPayload)
      if (!parsedAnual.success) {
        const issues = parsedAnual.error.issues.map((i) => ({ path: i.path, message: i.message }))
        return NextResponse.json({ error: formatValidationIssues(issues), issues }, { status: 400 })
      }

      if (!justificanteFile || justificanteFile.size === 0) {
        if (modalidadPago !== 'unico') {
          return NextResponse.json({ error: 'Debes adjuntar el justificante de pago' }, { status: 400 })
        }
      }
      if (!firmaFile || firmaFile.size === 0) {
        return NextResponse.json({ error: 'La firma del tutor es obligatoria' }, { status: 400 })
      }

      let justBuffer: Buffer | null = null
      let justCompressMimeType: string | null = null
      let justificanteFileName: string | null = null

      if (justificanteFile && justificanteFile.size > 0) {
        const justFileValidation = await validateFile(justificanteFile, 10)
        if (!justFileValidation.valid) {
          return NextResponse.json({ error: justFileValidation.error || 'Justificante no válido' }, { status: 400 })
        }
        const justBytes = await justificanteFile.arrayBuffer()
        justBuffer = Buffer.from(justBytes)
        const justCompress = await compressFile(
          justBuffer,
          justFileValidation.type || justificanteFile.type,
          800
        )
        justBuffer = Buffer.from(justCompress.buffer)
        justCompressMimeType = justCompress.mimeType
        justificanteFileName = justificanteFile.name
      }

      // Procesar firma
      const firmaBytes = await firmaFile.arrayBuffer()
      let firmaBuffer = Buffer.from(firmaBytes)
      firmaBuffer = Buffer.from(
        await sharp(firmaBuffer)
          .png({ compressionLevel: 9 })
          .resize(800, 400, { fit: 'inside', withoutEnlargement: true })
          .toBuffer()
      )

      let documentoDerechosImagen: string | null = null
      let documentoDerechosImagenMimeType: string | null = null
      let nombreArchivoDerechosImagen: string | null = null

      try {
        const clausula = await generateClausulaDerechosImagenDocument({
          nombreJugador,
          apellidos,
          nombreTutor,
          dniJugador: dniJugador || '',
          dniTutor: dni || '',
          fechaInscripcion: new Date(),
          derechosImagen: derechosImagen === 'true',
          firmaPngBuffer: firmaBuffer,
        })
        documentoDerechosImagen = clausula.base64
        documentoDerechosImagenMimeType = clausula.mimeType
        nombreArchivoDerechosImagen = clausula.fileName
      } catch (error) {
        console.error('Error al generar cláusula de derechos de imagen:', error)
        return NextResponse.json(
          {
            error:
              'No se pudo generar la cláusula de derechos de imagen. Contacta con el club.',
          },
          { status: 503 }
        )
      }

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

      let fotoFichaBase64: string | null = null
      let fotoFichaMimeType: string | null = null
      let nombreArchivoFotoFicha: string | null = null

      if (fotoFichaFile && fotoFichaFile.size > 0) {
        if (!fotoFichaFile.type.startsWith('image/')) {
          return NextResponse.json(
            { error: 'La foto de ficha debe ser una imagen (JPG, PNG o WEBP).' },
            { status: 400 }
          )
        }
        const fotoValidation = await validateFile(fotoFichaFile, 8)
        if (!fotoValidation.valid) {
          return NextResponse.json(
            { error: `Foto de ficha: ${fotoValidation.error || 'archivo no válido'}` },
            { status: 400 }
          )
        }
        const fotoBytes = await fotoFichaFile.arrayBuffer()
        let fotoBuffer = Buffer.from(fotoBytes)
        try {
          const compressed = await compressFile(
            fotoBuffer,
            fotoValidation.type || fotoFichaFile.type,
            700
          )
          fotoBuffer = Buffer.from(compressed.buffer)
          fotoFichaMimeType = compressed.mimeType
        } catch {
          fotoFichaMimeType = fotoValidation.type || fotoFichaFile.type
        }
        fotoFichaBase64 = fotoBuffer.toString('base64')
        nombreArchivoFotoFicha = fotoFichaFile.name || 'foto-ficha.jpg'
      }

      const baseData = {
        tipoInscripcion: 'anual' as const,
        nombreJugador,
        apellidos,
        fechaNacimiento: new Date(fechaNacimiento),
        dni: dni || '',
        dniJugador: dniJugador || null,
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
        pagada: modalidadPago === 'unico' && !!justBuffer,
        justificantePago: justBuffer ? justBuffer.toString('base64') : null,
        justificantePagoMimeType: justCompressMimeType,
        nombreArchivoJustificante: justificanteFileName,
        firma: firmaBuffer.toString('base64'),
        firmaMimeType: 'image/png',
        nombreArchivoFirma: 'firma.png',
        derechosImagen: derechosImagen === 'true',
        padresSeparados: padresSeparados === 'true',
        comentarios: comentarios || null,
        dniFrontalEncriptado,
        dniFrontalMimeType,
        dniReversoEncriptado,
        dniReversoMimeType,
        documentoDerechosImagen,
        documentoDerechosImagenMimeType,
        nombreArchivoDerechosImagen,
        fotoFicha: fotoFichaBase64,
        fotoFichaMimeType,
        nombreArchivoFotoFicha,
      }

      const createData = {
        ...baseData,
        descuentoHermanos: descuentoHermanos || 'no',
        cuota1Pagada: !!justBuffer,
        cuota2Pagada: false,
        cuota3Pagada: false,
      }

      const inscripcionAnual = await createAnualInscripcion(createData)

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
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const shortMessage = shortenPrismaErrorMessage(errorMessage)

    console.error('❌ Error al crear inscripción:', {
      name: error instanceof Error ? error.name : undefined,
      message: shortMessage,
      ...(error && typeof error === 'object' && 'code' in error ? { prismaCode: error.code } : {}),
    })

    const isStaleClient =
      shortMessage.includes('Unknown argument') ||
      (error instanceof Error && error.name === 'PrismaClientValidationError')

    const needsMigration =
      error instanceof Error && error.name === 'SchemaMigrationRequired'

    return NextResponse.json(
      {
        error: needsMigration
          ? 'La base de datos necesita una actualización. El club está aplicando la migración; inténtalo de nuevo en unos minutos.'
          : isStaleClient
            ? 'El servidor necesita reiniciarse tras actualizar la base de datos. Cierra y vuelve a ejecutar npm run dev, o redeploy en producción.'
            : 'Error al procesar la inscripción',
        details:
          process.env.NODE_ENV === 'production' && !isStaleClient && !needsMigration
            ? 'Error interno del servidor'
            : shortMessage,
      },
      { status: needsMigration ? 503 : 500 }
    )
  }
}

