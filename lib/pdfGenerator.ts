import { PDFDocument, PDFImage, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib'
import sharp from 'sharp'
import { Inscripcion } from '@/types'
import { formatDate } from './utils'
import { CAMPUS_VERANO_SEMANAS, formatSemanasCampus } from './campusVeranoConfig'
import { formatListaPdfTipoLabel } from './anualConfig'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mapeo de nombres de campos que deben usarse en los PDFs
// Nombres actualizados para la plantilla 2025: CAMPUS NAVIDAD HOJA INSCRIPCION 2025
const FIELD_ALIASES: Record<string, string[]> = {
  nombreJugador: ['NOMBRE', 'nombre', 'Nombre', 'nombreJugador', 'nombreJugador1'],
  apellidos: ['APELLIDOS', 'apellido', 'Apellidos', 'apellidos', 'mas iserte'],
  fechaNacimiento: ['FECHA NACIMIENTO', 'fechaNacimiento', 'Fecha Nacimiento', 'fechaNacimiento1'],
  dniTutor: ['DNI_TUTOR', 'DNI tutor', 'dni tutor'],
  dniJugador: ['DNI', 'DNI JUGADOR', 'DNI_JUGADOR', 'DNI jugador', 'dni jugador', 'dni', 'D.N.I.', 'D.N.I'],
  direccion: ['DIRECCIÓN', 'DIRECCION', 'direccion', 'Dirección'],
  localidad: ['LOCALIDAD', 'localidad', 'Localidad', 'Población', 'Poblacion', 'población', 'poblacion'],
  codigoPostal: ['CP', 'C.P.', 'C.P', 'codigoPostal', 'Código Postal'],
  nombreTutor: ['NOMBRE_TUTOR', 'NOMBRE PADRE/MADRE', 'NOMBRE JUGADOR', 'NOMBRE PADRE / MADRE', 'tutor', 'tutor del jugador', 'tutor del jugador/a', 'nombreTutor', 'madrePadreTutor', 'D.', 'D'],
  telefono1: [
    'TELEFONOS DE CONTACT1',
    'TELEFONOS DE CONTACT',
    'TFN MADRE/TUTORA',
    'TFN MADRE / TUTORA',
    'telefono1',
    'teléfono padre/tutor',
    'telefono madre/tutora',
    'telMadre',
    'telefonoMadre',
  ],
  telefono2: [
    'TELEFONOS DE CONTACT2',
    'TFN PADRE/TUTOR',
    'TFN PADRE / TUTOR',
    'telefono2',
    'telefonos madre/tutora',
    'telefono padre/tutor',
    'telPadre',
    'telefonoPadre',
  ],
  enfermedad: ['PADECE ALGUNA ENFERMEDAD', 'ENFERMEDAD', 'enfermedad', 'Padece alguna enfermedad'],
  medicacion: ['MEDICACIÓN', 'medicacion', 'Necesita medicación', 'Necesita  medicación no'],
  alergico: ['ALERGIAINTOLERANCIA', 'ALERGIA/INTOLERANCIA', 'ALERGIAS/INTOLERANCIAS', 'ALERGIAS / INTOLERANCIAS', 'alergias', 'Alérgico  Intolerante a', 'Alérgico / Intolerante a', 'Alergico  Intolerante a', 'alergico', 'Alergico'],
  diasSueltos: ['DIAS SUELTOS', 'diasSueltos', 'COMENTARIOS', 'comentarios'],
  tallaCamiseta: ['TALLA CAMISETA', 'CAMISETA', 'tallaCamiseta'],
  tallaPantalon: ['TALLA PANTALON', 'PANTALON', 'tallaPantalon'],
  tallaCalcetines: ['TALLA CALCETINES', 'CALCETINES', 'TALLA CALZAS', 'CALZAS', 'tallaCalcetines', 'tallaCalzas'],
  numeroSeguridadSocial: [
    'SIP',
    'Nº seguridad social del niñ@',
    'N° seguridad social del niñ@',
    'numeroSeguridadSocial',
    'Numero seguridad social del niñ@',
    'numSeguridadSocial',
    'nSeguridadSocial',
    'seguridadSocial',
    'sip'
  ],
  email: ['email', 'EMAIL', 'Correo Electrónico'],
  lugarNacimiento: ['Lugar', 'LUGAR'],
  nombreDelJugador: ['Nombre del jugador', 'NOMBRE DEL JUGADOR'],
  nombreTelefonoMadre: ['Nombre y Teléf madre'],
  nombreTelefonoPadre: ['Nombre y Teléf padre'],
  telefonoWhatsApp: ['Indicar teléfono para grupo de whatsapp'],
  telefonoSolo: ['teléfono', 'Telefono'],
  autorizacionDni: ['con DNI', 'con D.N.I', 'con D.N.I.'],
  tipoProcede: ['MARCAR SI PROCEDE'],
  fechaInscripcion: ['fechaInscripcion'],
  idInscripcion: ['idInscripcion'],
  firma: ['FIRMA', 'firma', 'Firma', 'firma jugador', 'firma tutor']
}

type FirmaRect = { x: number; y: number; width: number; height: number }

/** Índice de página donde está el widget del formulario (p. ej. FIRMA en página 2). */
function getWidgetPageIndex(
  pdfDoc: PDFDocument,
  widget: { P: () => unknown }
): number {
  const pages = pdfDoc.getPages()
  let pageRef: unknown
  try {
    pageRef = widget.P()
  } catch {
    return 0
  }
  for (let i = 0; i < pages.length; i++) {
    const ref = pages[i].ref
    if (ref === pageRef || String(ref) === String(pageRef)) return i
  }
  return 0
}

/** La firma se guarda en BD como base64; antes se usaba un archivo en storage/firmas. */
async function loadFirmaBytes(firma: string): Promise<Uint8Array | null> {
  const trimmed = firma.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('data:')) {
    const comma = trimmed.indexOf(',')
    if (comma === -1) return null
    return Uint8Array.from(Buffer.from(trimmed.slice(comma + 1), 'base64'))
  }

  const normalized = trimmed.replace(/\s/g, '')
  const isBase64Payload =
    normalized.length > 100 && /^[A-Za-z0-9+/=]+$/.test(normalized)

  if (isBase64Payload) {
    try {
      const decoded = Buffer.from(normalized, 'base64')
      if (decoded.length > 0) return Uint8Array.from(decoded)
    } catch {
      /* intentar como archivo */
    }
  }

  if (trimmed.length < 120 && (trimmed.includes('\\') || /\.[a-z0-9]+$/i.test(trimmed))) {
    const firmaPath = join(process.cwd(), 'storage', 'firmas', trimmed)
    if (existsSync(firmaPath)) {
      return readFile(firmaPath)
    }
  }

  return null
}

async function embedFirmaImage(
  pdfDoc: PDFDocument,
  bytes: Uint8Array,
  mimeType?: string | null
) {
  const mime = mimeType?.toLowerCase() ?? ''
  const isWebp =
    mime.includes('webp') ||
    (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46)

  if (mime.includes('jpeg') || mime.includes('jpg')) {
    return pdfDoc.embedJpg(bytes)
  }

  if (isWebp) {
    const pngBuffer = await sharp(Buffer.from(bytes)).png().toBuffer()
    return pdfDoc.embedPng(pngBuffer)
  }

  try {
    return await pdfDoc.embedPng(bytes)
  } catch {
    const pngBuffer = await sharp(Buffer.from(bytes)).png().toBuffer()
    return pdfDoc.embedPng(pngBuffer)
  }
}

function drawFirmaOnPage(
  page: ReturnType<PDFDocument['getPages']>[number],
  firmaImage: PDFImage,
  firmaRect: FirmaRect | null
) {
  if (firmaRect) {
    const imgRatio = firmaImage.width / firmaImage.height
    const boxRatio = firmaRect.width / firmaRect.height
    let drawWidth = firmaRect.width - 4
    let drawHeight = firmaRect.height - 4
    if (imgRatio > boxRatio) {
      drawHeight = drawWidth / imgRatio
    } else {
      drawWidth = drawHeight * imgRatio
    }
    const drawX = firmaRect.x + (firmaRect.width - drawWidth) / 2
    const drawY = firmaRect.y + (firmaRect.height - drawHeight) / 2
    page.drawImage(firmaImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    })
  } else {
    const firmaDims = firmaImage.scale(0.15)
    page.drawImage(firmaImage, {
      x: 50,
      y: 130,
      width: firmaDims.width,
      height: firmaDims.height,
    })
  }
}

// Función para rellenar un PDF con plantilla
export async function fillPDFTemplate(templatePath: string, inscripcion: Inscripcion): Promise<Uint8Array> {
  try {
    // Cargar la plantilla PDF
    const templateBytes = await readFile(templatePath)
    const pdfDoc = await PDFDocument.load(templateBytes)
    const form = pdfDoc.getForm()

    // Obtener todos los campos del formulario
    const fields = form.getFields()
    console.log(`Plantilla cargada. Campos disponibles: ${fields.length}`)

    // Función auxiliar para rellenar campo de texto (incluye vaciar el campo)
    const setTextField = (aliasKey: string, value: string) => {
      const candidates = FIELD_ALIASES[aliasKey] ?? [aliasKey]
      for (const candidate of candidates) {
        try {
          form.getTextField(candidate).setText(value)
          return
        } catch {
          continue
        }
      }
      if (value) {
        console.warn(`Campo '${aliasKey}' no encontrado en la plantilla (probados: ${candidates.join(', ')})`)
      }
    }

    const fillTextField = (aliasKey: string, value: string) => {
      if (!value) return
      setTextField(aliasKey, value)
    }

    const fillCheckBox = (fieldName: string) => {
      try {
        form.getCheckBox(fieldName).check()
      } catch {
        console.warn(`Checkbox '${fieldName}' no encontrado en la plantilla`)
      }
    }

    // Rellenar campos básicos
    fillTextField('nombreJugador', inscripcion.nombreJugador)
    fillTextField('apellidos', inscripcion.apellidos)
    fillTextField('fechaNacimiento', formatDate(inscripcion.fechaNacimiento))
    fillTextField('direccion', inscripcion.direccion || '')
    fillTextField('localidad', inscripcion.localidad || '')
    fillTextField('codigoPostal', inscripcion.codigoPostal || '')
    fillTextField('numeroSeguridadSocial', inscripcion.numeroSeguridadSocial || '')
    fillTextField('email', inscripcion.email || '')
    fillTextField('telefono1', inscripcion.telefono1 || '')
    fillTextField('telefono2', inscripcion.telefono2 || '')
    // Plantillas antiguas con un solo campo de teléfonos
    const telefonosCombinados = [inscripcion.telefono1, inscripcion.telefono2]
      .filter(Boolean)
      .join(' / ')
    if (telefonosCombinados) {
      try {
        form.getTextField('TELEFONOS DE CONTACT').setText(telefonosCombinados)
      } catch {
        /* campus-verano y otras usan CONTACT1/CONTACT2 */
      }
    }
    fillTextField('enfermedad', inscripcion.enfermedad || '')
    fillTextField('medicacion', inscripcion.medicacion || '')
    fillTextField('alergico', inscripcion.alergico || '')
    fillTextField('nombreTutor', inscripcion.nombreTutor)
    fillTextField('dniTutor', inscripcion.dni)
    fillTextField('dniJugador', inscripcion.dniJugador || '')
    setTextField('lugarNacimiento', '')

    if (inscripcion.tipoInscripcion === 'anual') {
      const nombreCompletoJugador = `${inscripcion.nombreJugador} ${inscripcion.apellidos}`.trim()
      const madreConTelefono = [inscripcion.nombreTutor, inscripcion.telefono1]
        .filter(Boolean)
        .join(' - ')
      const padreConTelefono = inscripcion.telefono2 || ''

      fillTextField('nombreDelJugador', nombreCompletoJugador)
      fillTextField('nombreTelefonoMadre', madreConTelefono)
      fillTextField('nombreTelefonoPadre', padreConTelefono)
      fillTextField('telefonoWhatsApp', inscripcion.telefono1 || inscripcion.telefono2 || '')
      fillTextField('telefonoSolo', inscripcion.telefono1 || inscripcion.telefono2 || '')
      fillTextField('autorizacionDni', inscripcion.dni || '')
      // Solo marcar "padres separados" si el tutor lo indica en el formulario
      setTextField('tipoProcede', inscripcion.padresSeparados ? 'X' : '')
    }

    const semanasLabels = formatSemanasCampus(inscripcion.semanasCampus)
    if (inscripcion.semanasCampus) {
      try {
        const ids = JSON.parse(inscripcion.semanasCampus) as string[]
        for (const semana of CAMPUS_VERANO_SEMANAS) {
          if (ids.includes(semana.id)) {
            fillCheckBox(semana.pdfFieldName)
          }
        }
      } catch {
        /* JSON inválido: solo texto en diasSueltos */
      }
    }
    const diasInfo = [semanasLabels, inscripcion.diasSueltos].filter(Boolean).join(' | ')
    fillTextField('diasSueltos', diasInfo)
    fillTextField('tallaCamiseta', inscripcion.tallaCamiseta || '')
    fillTextField('tallaPantalon', inscripcion.tallaPantalon || '')
    fillTextField('tallaCalcetines', inscripcion.tallaCalcetines || '')

    let firmaRectData: FirmaRect | null = null
    let firmaPageIndex = 0

    // Posición del campo FIRMA en la plantilla (ANTES de aplanar)
    if (inscripcion.firma) {
      const firmaCandidates = FIELD_ALIASES['firma'] || ['FIRMA', 'firma', 'Firma']
      for (const cand of firmaCandidates) {
        try {
          const field = form.getField(cand)
          const widgets = field.acroField.getWidgets()
          if (widgets.length > 0) {
            const widget = widgets[0]
            firmaRectData = widget.getRectangle()
            firmaPageIndex = getWidgetPageIndex(pdfDoc, widget)
            try {
              form.getTextField(cand).setText('')
            } catch {
              /* no es texto o ya vacío */
            }
            break
          }
        } catch {
          /* campo no encontrado */
        }
      }
    }

    // MUY IMPORTANTE: Aplanar el formulario para que los campos no sean editables,
    // ANTES de dibujar la firma. Si aplanamos después, el fondo blanco opaco del 
    // campo de texto tapará completamente la imagen.
    form.flatten()

    // Incrustar firma (base64 en BD) sobre la página correcta tras aplanar
    if (inscripcion.firma) {
      try {
        const firmaBytes = await loadFirmaBytes(inscripcion.firma)
        if (firmaBytes) {
          const firmaImage = await embedFirmaImage(
            pdfDoc,
            firmaBytes,
            inscripcion.firmaMimeType
          )
          const pages = pdfDoc.getPages()
          const targetPage = pages[firmaPageIndex] ?? pages[0]
          drawFirmaOnPage(targetPage, firmaImage, firmaRectData)
          console.log(
            `Firma incrustada en página ${firmaPageIndex + 1} del PDF (campo FIRMA)`
          )
        } else {
          console.warn('No se pudieron cargar los bytes de la firma')
        }
      } catch (error) {
        console.error('Error al incrustar la firma:', error)
      }
    }

    // Guardar el PDF
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error('Error al rellenar plantilla PDF:', error)
    throw error
  }
}

// Función original para generar PDF desde cero (fallback)
export async function generateInscripcionPDF(inscripcion: Inscripcion): Promise<Uint8Array> {
  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842]) // A4 size
  const { width, height } = page.getSize()

  // Cargar fuentes
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Colores
  const redColor = rgb(0.86, 0.15, 0.15) // #dc2626
  const blackColor = rgb(0, 0, 0)
  const grayColor = rgb(0.4, 0.4, 0.4)

  let yPosition = height - 60

  // Encabezado - Logo y título
  page.drawRectangle({
    x: 0,
    y: yPosition - 20,
    width: width,
    height: 80,
    color: redColor,
  })

  page.drawText('CLUB DEPORTIVO ONDA', {
    x: 50,
    y: yPosition,
    size: 24,
    font: fontBold,
    color: rgb(1, 1, 1),
  })

  page.drawText('Campus de Verano 2026', {
    x: 50,
    y: yPosition - 25,
    size: 16,
    font: font,
    color: rgb(1, 1, 1),
  })

  yPosition -= 100

  // Título del formulario
  page.drawText('FORMULARIO DE INSCRIPCIÓN', {
    x: 50,
    y: yPosition,
    size: 18,
    font: fontBold,
    color: blackColor,
  })

  yPosition -= 10
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 2,
    color: redColor,
  })

  yPosition -= 40

  // Sección: Datos del Jugador
  page.drawText('DATOS DEL JUGADOR', {
    x: 50,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: redColor,
  })

  yPosition -= 25

  const fields = [
    { label: 'Nombre:', value: inscripcion.nombreJugador },
    { label: 'Apellidos:', value: inscripcion.apellidos },
    { label: 'Fecha de Nacimiento:', value: formatDate(inscripcion.fechaNacimiento) },
  ]

  for (const field of fields) {
    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: blackColor,
    })

    page.drawText(field.value, {
      x: 200,
      y: yPosition,
      size: 11,
      font: font,
      color: blackColor,
    })

    yPosition -= 20
  }

  yPosition -= 20

  // Sección: Datos del Tutor
  page.drawText('DATOS DEL PADRE/MADRE/TUTOR', {
    x: 50,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: redColor,
  })

  yPosition -= 25

  const tutorFields = [
    { label: 'Nombre del Tutor:', value: inscripcion.nombreTutor },
    { label: 'DNI del Tutor:', value: inscripcion.dni },
    { label: 'Teléfono 1:', value: inscripcion.telefono1 },
    { label: 'Teléfono 2:', value: inscripcion.telefono2 || 'No especificado' },
  ]

  for (const field of tutorFields) {
    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: blackColor,
    })

    page.drawText(field.value, {
      x: 200,
      y: yPosition,
      size: 11,
      font: font,
      color: blackColor,
    })

    yPosition -= 20
  }

  yPosition -= 20

  // Sección: Información Médica
  page.drawText('INFORMACIÓN MÉDICA', {
    x: 50,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: redColor,
  })

  yPosition -= 25

  const infoMedica = [
    { label: 'Padece alguna enfermedad:', value: inscripcion.enfermedad },
    { label: 'Necesita medicación:', value: inscripcion.medicacion },
    { label: 'Alérgico / Intolerante a:', value: inscripcion.alergico },
    { label: 'SIP:', value: inscripcion.numeroSeguridadSocial },
  ]

  for (const field of infoMedica) {
    if (!field.value) continue

    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: blackColor,
    })

    yPosition -= 18

    const lines = wrapText(field.value, 70)
    for (const line of lines) {
      page.drawText(line, {
        x: 70,
        y: yPosition,
        size: 10,
        font: font,
        color: grayColor,
      })
      yPosition -= 15
    }

    yPosition -= 10
  }

  // Recuadro o imagen de firma
  page.drawText('Firma padre/madre o tutor:', {
    x: 50,
    y: yPosition,
    size: 11,
    font: fontBold,
    color: blackColor,
  })

  yPosition -= 70

  if (inscripcion.firma) {
    try {
      const firmaBytes = await loadFirmaBytes(inscripcion.firma)
      if (firmaBytes) {
        const firmaImage = await embedFirmaImage(
          pdfDoc,
          firmaBytes,
          inscripcion.firmaMimeType
        )
        const firmaDims = firmaImage.scale(0.5)
        page.drawImage(firmaImage, {
          x: 50,
          y: yPosition,
          width: Math.min(firmaDims.width, width - 100),
          height: Math.min(firmaDims.height, 60),
        })
      } else {
        throw new Error('Firma no disponible')
      }
    } catch (error) {
      console.error('No se pudo incrustar la firma, se dibuja un recuadro vacío:', error)
      page.drawRectangle({
        x: 50,
        y: yPosition,
        width: width - 100,
        height: 60,
        borderWidth: 1,
        borderColor: grayColor,
      })
    }
  } else {
    page.drawRectangle({
      x: 50,
      y: yPosition,
      width: width - 100,
      height: 60,
      borderWidth: 1,
      borderColor: grayColor,
    })
  }

  // Fecha de emisión
  yPosition = 100

  page.drawLine({
    start: { x: 50, y: yPosition + 20 },
    end: { x: width - 50, y: yPosition + 20 },
    thickness: 1,
    color: grayColor,
  })

  page.drawText(`Fecha de emisión: ${formatDate(inscripcion.createdAt)}`, {
    x: 50,
    y: yPosition,
    size: 9,
    font: font,
    color: grayColor,
  })

  page.drawText(`ID de Inscripción: ${inscripcion.id.substring(0, 8).toUpperCase()}`, {
    x: 350,
    y: yPosition,
    size: 9,
    font: font,
    color: grayColor,
  })

  // Pie de página
  page.drawText('Campus de Verano 2026 – Club Deportivo Onda', {
    x: width / 2 - 150,
    y: 60,
    size: 10,
    font: fontBold,
    color: redColor,
  })

  page.drawText('Vacaciones de verano 2026', {
    x: width / 2 - 95,
    y: 45,
    size: 9,
    font: font,
    color: grayColor,
  })

  page.drawText('www.cdonda.com | escolafut@gmail.com', {
    x: width / 2 - 95,
    y: 30,
    size: 8,
    font: font,
    color: grayColor,
  })

  // Generar el PDF
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

// Función principal que decide si usar plantilla o generar desde cero
export async function generatePDFForInscripcion(inscripcion: Inscripcion): Promise<Uint8Array> {
  try {
    const templateCandidates: string[] = []

    if (inscripcion.tipoInscripcion === 'anual') {
      const categoria = (inscripcion.categoria || '').toLowerCase()
      if (categoria === 'chupetines') templateCandidates.push('inscripcion-chupetines.pdf')
      if (categoria === 'querubines') templateCandidates.push('inscripcion-querubines.pdf')
      if (categoria === 'futbol-8') templateCandidates.push('inscripcion-f8.pdf')
      if (categoria === 'futbol-11') templateCandidates.push('inscripcion-f11.pdf')
      templateCandidates.push('anual.pdf')
    }

    templateCandidates.push(`${inscripcion.tipoInscripcion}.pdf`)

    for (const candidate of templateCandidates) {
      const templatePath = join(process.cwd(), 'public', 'templates', candidate)
      if (existsSync(templatePath)) {
        console.log(`Usando plantilla ${candidate} para ${inscripcion.tipoInscripcion}`)
        return await fillPDFTemplate(templatePath, inscripcion)
      }
    }

    console.log(`No se encontró plantilla para ${inscripcion.tipoInscripcion}, generando PDF por defecto`)
    return await generateInscripcionPDF(inscripcion)
  } catch (error) {
    console.error('Error al generar PDF, usando generador por defecto:', error)
    return await generateInscripcionPDF(inscripcion)
  }
}

// Función auxiliar para dividir texto largo en líneas
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

// Función auxiliar para truncar texto según ancho aproximado
function getListaPdfEstado(inscripcion: Inscripcion): 'Paga' | 'Pendi' {
  if (inscripcion.tipoInscripcion === 'anual') {
    const modalidad = inscripcion.modalidadPago
    if (modalidad === 'unico' || modalidad === 'anual') {
      return inscripcion.cuota1Pagada ? 'Paga' : 'Pendi'
    }
    return inscripcion.cuota1Pagada && inscripcion.cuota2Pagada ? 'Paga' : 'Pendi'
  }
  return inscripcion.pagada ? 'Paga' : 'Pendi'
}

function truncateToWidth(text: string, font: PDFFont, size: number, maxWidth: number): string {
  const safe = text.replace(/\s+/g, ' ').trim()
  if (!safe) return '—'
  if (font.widthOfTextAtSize(safe, size) <= maxWidth) return safe

  let truncated = safe
  while (truncated.length > 0 && font.widthOfTextAtSize(`${truncated}…`, size) > maxWidth) {
    truncated = truncated.slice(0, -1)
  }
  return truncated ? `${truncated}…` : '…'
}

function formatListaPdfTallas(inscripcion: Inscripcion): string {
  const parts = [
    inscripcion.tallaCamiseta,
    inscripcion.tallaPantalon,
    inscripcion.tallaCalcetines,
  ].filter(Boolean)
  return parts.length ? parts.join(' / ') : '—'
}

type ListaPdfColumn = {
  label: string
  width: number
  align?: 'left' | 'center' | 'right'
}

function buildListaPdfColumns(tableWidth: number): ListaPdfColumn[] {
  const columns: ListaPdfColumn[] = [
    { label: 'Nº', width: 28, align: 'center' },
    { label: 'Tipo', width: 40, align: 'center' },
    { label: 'Jugador', width: 132 },
    { label: 'DNI', width: 76, align: 'center' },
    { label: 'Tutor', width: 158 },
    { label: 'Tel.', width: 78, align: 'center' },
    { label: 'Nac.', width: 56, align: 'center' },
    { label: 'Tallas', width: 92, align: 'center' },
    { label: 'Estado', width: 52, align: 'center' },
  ]

  const total = columns.reduce((sum, col) => sum + col.width, 0)
  if (total !== tableWidth) {
    const extra = tableWidth - total
    columns[2].width += Math.floor(extra * 0.55)
    columns[4].width += extra - Math.floor(extra * 0.55)
  }

  return columns
}

function getColumnXs(margin: number, columns: ListaPdfColumn[]): number[] {
  const xs: number[] = []
  let x = margin
  for (const col of columns) {
    xs.push(x)
    x += col.width
  }
  return xs
}

function drawTextInCell(
  page: PDFPage,
  text: string,
  x: number,
  width: number,
  y: number,
  font: PDFFont,
  size: number,
  color: ReturnType<typeof rgb>,
  align: 'left' | 'center' | 'right' = 'left',
  pad = 4
) {
  const maxWidth = width - pad * 2
  const content = truncateToWidth(text, font, size, maxWidth)
  const textWidth = font.widthOfTextAtSize(content, size)
  let drawX = x + pad
  if (align === 'center') drawX = x + (width - textWidth) / 2
  if (align === 'right') drawX = x + width - pad - textWidth

  page.drawText(content, { x: drawX, y, size, font, color })
}

// Función para generar PDF con lista completa de inscripciones en formato tabla
export async function generateListaInscripcionesPDF(inscripciones: Inscripcion[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const pageSize: [number, number] = [842, 595]
  let page = pdfDoc.addPage(pageSize)
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const redColor = rgb(0.86, 0.15, 0.15)
  const blackColor = rgb(0.1, 0.1, 0.1)
  const grayColor = rgb(0.45, 0.45, 0.45)
  const lightGrayColor = rgb(0.96, 0.96, 0.96)
  const borderColor = rgb(0.82, 0.82, 0.82)

  const margin = 36
  const tableWidth = width - margin * 2
  const rowHeight = 20
  const headerRowHeight = 24
  const cellFontSize = 7.5
  const headerFontSize = 8
  const columns = buildListaPdfColumns(tableWidth)
  const columnXs = getColumnXs(margin, columns)

  let logoImage: Awaited<ReturnType<PDFDocument['embedPng']>> | null = null
  try {
    const logoPath = join(process.cwd(), 'public', 'images', 'logos', 'escudo-cd-onda.webp')
    if (existsSync(logoPath)) {
      const logoBytes = await readFile(logoPath)
      const pngBuffer = await sharp(logoBytes).png().toBuffer()
      logoImage = await pdfDoc.embedPng(pngBuffer)
    }
  } catch (error) {
    console.warn('No se pudo cargar el logo:', error)
  }

  const drawFullPageHeader = (targetPage: typeof page, yTop: number) => {
    const bannerHeight = 58
    targetPage.drawRectangle({
      x: 0,
      y: yTop - bannerHeight,
      width,
      height: bannerHeight,
      color: redColor,
    })

    let textX = margin
    if (logoImage) {
      const logoSize = 34
      targetPage.drawImage(logoImage, {
        x: margin,
        y: yTop - bannerHeight + 12,
        width: logoSize,
        height: logoSize,
      })
      textX = margin + logoSize + 10
    }

    targetPage.drawText('CLUB DEPORTIVO ONDA', {
      x: textX,
      y: yTop - 22,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
    })
    targetPage.drawText('Lista de Inscripciones', {
      x: textX,
      y: yTop - 38,
      size: 11,
      font,
      color: rgb(1, 1, 1),
    })
    targetPage.drawText(`${inscripciones.length} inscripciones`, {
      x: width - margin - 90,
      y: yTop - 30,
      size: 10,
      font: fontBold,
      color: rgb(1, 1, 1),
    })

    return yTop - bannerHeight - 12
  }

  const drawCompactPageHeader = (targetPage: typeof page, yTop: number) => {
    const bannerHeight = 28
    targetPage.drawRectangle({
      x: margin,
      y: yTop - bannerHeight,
      width: tableWidth,
      height: bannerHeight,
      color: rgb(0.98, 0.95, 0.95),
      borderColor: redColor,
      borderWidth: 0.6,
    })
    targetPage.drawText('Lista de Inscripciones — continuación', {
      x: margin + 8,
      y: yTop - 19,
      size: 9,
      font: fontBold,
      color: redColor,
    })
    return yTop - bannerHeight - 8
  }

  const drawTableHeader = (targetPage: typeof page, yTop: number) => {
    targetPage.drawRectangle({
      x: margin,
      y: yTop - headerRowHeight,
      width: tableWidth,
      height: headerRowHeight,
      color: redColor,
    })

    columns.forEach((col, index) => {
      drawTextInCell(
        targetPage,
        col.label,
        columnXs[index],
        col.width,
        yTop - 16,
        fontBold,
        headerFontSize,
        rgb(1, 1, 1),
        col.align ?? 'left'
      )
    })

    return yTop - headerRowHeight
  }

  const drawRowBorders = (targetPage: typeof page, yTop: number, fill?: typeof lightGrayColor) => {
    if (fill) {
      targetPage.drawRectangle({
        x: margin,
        y: yTop - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: fill,
      })
    }

    targetPage.drawLine({
      start: { x: margin, y: yTop },
      end: { x: margin + tableWidth, y: yTop },
      thickness: 0.4,
      color: borderColor,
    })

    for (const x of columnXs) {
      targetPage.drawLine({
        start: { x, y: yTop },
        end: { x, y: yTop - rowHeight },
        thickness: 0.25,
        color: borderColor,
      })
    }
    targetPage.drawLine({
      start: { x: margin + tableWidth, y: yTop },
      end: { x: margin + tableWidth, y: yTop - rowHeight },
      thickness: 0.25,
      color: borderColor,
    })
  }

  let yPosition = drawFullPageHeader(page, height - 28)
  yPosition = drawTableHeader(page, yPosition)

  inscripciones.forEach((inscripcion, index) => {
    if (yPosition - rowHeight < 52) {
      page = pdfDoc.addPage(pageSize)
      yPosition = drawCompactPageHeader(page, height - 28)
      yPosition = drawTableHeader(page, yPosition)
    }

    const isEven = index % 2 === 0
    drawRowBorders(page, yPosition, isEven ? lightGrayColor : undefined)

    const values = [
      String(index + 1),
      formatListaPdfTipoLabel(inscripcion.tipoInscripcion, inscripcion.categoria),
      `${inscripcion.nombreJugador} ${inscripcion.apellidos}`,
      inscripcion.dni,
      inscripcion.nombreTutor,
      inscripcion.telefono1,
      formatDate(inscripcion.fechaNacimiento).substring(0, 10),
      formatListaPdfTallas(inscripcion),
      getListaPdfEstado(inscripcion),
    ]

    values.forEach((value, colIndex) => {
      const col = columns[colIndex]
      const estadoColor =
        colIndex === values.length - 1
          ? value === 'Paga'
            ? rgb(0.05, 0.55, 0.2)
            : rgb(0.75, 0.35, 0.05)
          : blackColor

      drawTextInCell(
        page,
        value,
        columnXs[colIndex],
        col.width,
        yPosition - 14,
        font,
        cellFontSize,
        estadoColor,
        col.align ?? 'left'
      )
    })

    yPosition -= rowHeight
  })

  page.drawRectangle({
    x: margin,
    y: yPosition,
    width: tableWidth,
    height: 0.6,
    color: borderColor,
  })

  const totalPages = pdfDoc.getPageCount()
  const generatedAt = formatDate(new Date())
  for (let i = 0; i < totalPages; i++) {
    const footerPage = pdfDoc.getPage(i)
    footerPage.drawText(`Página ${i + 1} de ${totalPages}`, {
      x: width / 2 - 32,
      y: 22,
      size: 7.5,
      font,
      color: grayColor,
    })
    footerPage.drawText(`Generado el ${generatedAt}`, {
      x: margin,
      y: 22,
      size: 7.5,
      font,
      color: grayColor,
    })
  }

  return pdfDoc.save()
}

export type ClausulaDerechosImagenInput = {
  nombreJugador: string
  apellidos: string
  nombreTutor: string
  dniJugador: string
  dniTutor: string
  /** Fecha de la inscripción (por defecto: hoy). */
  fechaInscripcion?: string | Date
  derechosImagen: boolean
  firmaPngBuffer?: Buffer | Uint8Array | null
}

/** Rellena la plantilla de cláusula de derechos de imagen (inscripción anual). */
export async function generateClausulaDerechosImagenPdf(
  input: ClausulaDerechosImagenInput
): Promise<Uint8Array> {
  const templatePath = join(
    process.cwd(),
    'public',
    'templates',
    'clausula-derechos-imagen-menores.pdf'
  )

  if (!existsSync(templatePath)) {
    throw new Error('Plantilla de cláusula de derechos de imagen no encontrada')
  }

  const templateBytes = await readFile(templatePath)
  const pdfDoc = await PDFDocument.load(templateBytes)
  const form = pdfDoc.getForm()

  const fillText = (fieldName: string, value: string) => {
    if (!value) return
    try {
      form.getTextField(fieldName).setText(value)
    } catch {
      console.warn(`[cláusula] Campo de texto no encontrado: ${fieldName}`)
    }
  }

  const setCheckbox = (fieldName: string, checked: boolean) => {
    try {
      const box = form.getCheckBox(fieldName)
      if (checked) box.check()
      else box.uncheck()
    } catch {
      console.warn(`[cláusula] Checkbox no encontrado: ${fieldName}`)
    }
  }

  const inscripcionDate = new Date(input.fechaInscripcion ?? new Date())
  if (!Number.isNaN(inscripcionDate.getTime())) {
    fillText('Día', String(inscripcionDate.getDate()).padStart(2, '0'))
    fillText('Mes', String(inscripcionDate.getMonth() + 1).padStart(2, '0'))
    fillText('Año', String(inscripcionDate.getFullYear()))
  }

  // Check 1 = SÍ autoriza | Check 2 = NO autoriza
  setCheckbox('Check 1', input.derechosImagen)
  setCheckbox('Check 2', !input.derechosImagen)

  const nombreMenor = `${input.nombreJugador} ${input.apellidos}`.trim()
  fillText('Nombre y apellidos del menor', nombreMenor)
  fillText('Nombre y apellidos del tutor legal', input.nombreTutor.trim())
  fillText('DNI jugador', input.dniJugador.trim())
  fillText('DNI tutor', input.dniTutor.trim())

  let firmaRectData: FirmaRect | null = null
  let firmaPageIndex = 0

  if (input.firmaPngBuffer && input.firmaPngBuffer.length > 0) {
    try {
      const field = form.getField('Firma tutor')
      const widgets = field.acroField.getWidgets()
      if (widgets.length > 0) {
        const widget = widgets[0]
        firmaRectData = widget.getRectangle()
        firmaPageIndex = getWidgetPageIndex(pdfDoc, widget)
      }
    } catch {
      console.warn('[cláusula] Campo Firma tutor no encontrado')
    }
  }

  form.flatten()

  if (input.firmaPngBuffer && input.firmaPngBuffer.length > 0) {
    try {
      const firmaImage = await embedFirmaImage(
        pdfDoc,
        Uint8Array.from(input.firmaPngBuffer),
        'image/png'
      )
      const pages = pdfDoc.getPages()
      const targetPage = pages[firmaPageIndex] ?? pages[0]
      drawFirmaOnPage(targetPage, firmaImage, firmaRectData)
    } catch (error) {
      console.error('[cláusula] Error al incrustar la firma:', error)
    }
  }

  return pdfDoc.save()
}

