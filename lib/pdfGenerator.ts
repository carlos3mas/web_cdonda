import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Inscripcion } from '@/types'
import { formatDate } from './utils'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mapeo de nombres de campos que deben usarse en los PDFs
const FIELD_NAMES = {
  nombreJugador: 'nombreJugador',
  apellidos: 'apellidos',
  fechaNacimiento: 'fechaNacimiento',
  dni: 'dni',
  nombreTutor: 'nombreTutor',
  telefono1: 'telefono1',
  telefono2: 'telefono2',
  email: 'email',
  tieneHermanos: 'tieneHermanos',
  alergias: 'alergias',
  observaciones: 'observaciones',
  fechaInscripcion: 'fechaInscripcion',
  idInscripcion: 'idInscripcion'
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

    // Función auxiliar para rellenar campo de texto de forma segura
    const fillTextField = (fieldName: string, value: string) => {
      try {
        const field = form.getTextField(fieldName)
        field.setText(value)
      } catch (error) {
        console.warn(`Campo '${fieldName}' no encontrado en la plantilla`)
      }
    }

    // Rellenar campos básicos
    fillTextField(FIELD_NAMES.nombreJugador, inscripcion.nombreJugador)
    fillTextField(FIELD_NAMES.apellidos, inscripcion.apellidos)
    fillTextField(FIELD_NAMES.fechaNacimiento, formatDate(inscripcion.fechaNacimiento))
    fillTextField(FIELD_NAMES.dni, inscripcion.dni)
    fillTextField(FIELD_NAMES.nombreTutor, inscripcion.nombreTutor)
    fillTextField(FIELD_NAMES.telefono1, inscripcion.telefono1)
    fillTextField(FIELD_NAMES.telefono2, inscripcion.telefono2 || '')
    fillTextField(FIELD_NAMES.email, inscripcion.email)
    fillTextField(FIELD_NAMES.tieneHermanos, inscripcion.tieneHermanos ? 'Sí' : 'No')
    fillTextField(FIELD_NAMES.alergias, inscripcion.alergias || '')
    fillTextField(FIELD_NAMES.observaciones, inscripcion.observaciones || '')
    fillTextField(FIELD_NAMES.fechaInscripcion, formatDate(inscripcion.createdAt))
    fillTextField(FIELD_NAMES.idInscripcion, inscripcion.id.substring(0, 8).toUpperCase())

    // Aplanar el formulario para que los campos no sean editables
    form.flatten()

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

  page.drawText('Campus de Navidad 2025', {
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
    { label: 'DNI:', value: inscripcion.dni },
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
    { label: 'Teléfono 1:', value: inscripcion.telefono1 },
    { label: 'Teléfono 2:', value: inscripcion.telefono2 || 'No especificado' },
    { label: 'Email:', value: inscripcion.email },
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

  // Sección: Información Adicional
  page.drawText('INFORMACIÓN ADICIONAL', {
    x: 50,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: redColor,
  })

  yPosition -= 25

  page.drawText('¿Tiene hermanos en el campus?:', {
    x: 50,
    y: yPosition,
    size: 11,
    font: fontBold,
    color: blackColor,
  })

  page.drawText(inscripcion.tieneHermanos ? 'Sí' : 'No', {
    x: 250,
    y: yPosition,
    size: 11,
    font: font,
    color: blackColor,
  })

  yPosition -= 25

  if (inscripcion.alergias) {
    page.drawText('Alergias o Enfermedades:', {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: blackColor,
    })

    yPosition -= 18

    const alergiasLines = wrapText(inscripcion.alergias, 70)
    for (const line of alergiasLines) {
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

  if (inscripcion.observaciones) {
    page.drawText('Observaciones:', {
      x: 50,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: blackColor,
    })

    yPosition -= 18

    const obsLines = wrapText(inscripcion.observaciones, 70)
    for (const line of obsLines) {
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
  page.drawText('Campus de Navidad 2025 – Club Deportivo Onda', {
    x: width / 2 - 150,
    y: 60,
    size: 10,
    font: fontBold,
    color: redColor,
  })

  page.drawText('Del 23 al 30 de Diciembre 2025', {
    x: width / 2 - 95,
    y: 45,
    size: 9,
    font: font,
    color: grayColor,
  })

  page.drawText('www.cdonda.com | info@cdonda.com', {
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
    // Intentar cargar la plantilla para el tipo de inscripción
    const templatePath = join(process.cwd(), 'public', 'templates', `${inscripcion.tipoInscripcion}.pdf`)
    
    if (existsSync(templatePath)) {
      console.log(`Usando plantilla para ${inscripcion.tipoInscripcion}`)
      return await fillPDFTemplate(templatePath, inscripcion)
    } else {
      console.log(`No se encontró plantilla para ${inscripcion.tipoInscripcion}, generando PDF por defecto`)
      return await generateInscripcionPDF(inscripcion)
    }
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

