import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Inscripcion } from '@/types'
import { formatDate } from './utils'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mapeo de nombres de campos que deben usarse en los PDFs
const FIELD_ALIASES: Record<string, string[]> = {
  nombreJugador: ['Nombre', 'nombreJugador', 'nombreJugador1'],
  apellidos: ['Apellidos', 'apellidos', 'mas iserte'],
  fechaNacimiento: ['Fecha Nacimiento', 'fechaNacimiento', 'fechaNacimiento1'],
  dni: ['DNI', 'dni'],
  nombreTutor: ['tutor del jugador', 'nombreTutor', 'madrePadreTutor', 'juan mas pradas'],
  telefono1: ['teléfono padre/tutor', 'telefono madre/tutora', 'telefono1', 'telMadre', 'telefonoMadre'],
  telefono2: ['telefonos madre/tutora', 'telefono padre/tutor', 'telefono2', 'telPadre', 'telefonoPadre'],
  enfermedad: ['Padece alguna enfermedad', 'enfermedad'],
  medicacion: ['Necesita medicación', 'medicacion', 'Necesita  medicación no'],
  alergico: ['Alérgico  Intolerante a', 'Alérgico / Intolerante a', 'Alergico  Intolerante a', 'alergico', 'Alergico'],
  numeroSeguridadSocial: [
    'Nº seguridad social del niñ@',
    'N° seguridad social del niñ@',
    'numeroSeguridadSocial',
    'Numero seguridad social del niñ@',
    'numSeguridadSocial',
    'nSeguridadSocial',
    'seguridadSocial',
    'sip',
    'SIP'
  ],
  fechaInscripcion: ['fechaInscripcion'],
  idInscripcion: ['idInscripcion'],
  firma: ['firma', 'Firma']
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
    const fillTextField = (aliasKey: keyof typeof FIELD_ALIASES, value: string) => {
      if (!value) return
      const candidates = FIELD_ALIASES[aliasKey] ?? [aliasKey]
      for (const candidate of candidates) {
        try {
          const field = form.getTextField(candidate)
          field.setText(value)
          return
        } catch (error) {
          continue
        }
      }
      console.warn(`Campo '${aliasKey}' no encontrado en la plantilla (probados: ${candidates.join(', ')})`)
    }

    // Rellenar campos básicos
    fillTextField('nombreJugador', inscripcion.nombreJugador)
    fillTextField('apellidos', inscripcion.apellidos)
    fillTextField('fechaNacimiento', formatDate(inscripcion.fechaNacimiento))
    fillTextField('numeroSeguridadSocial', inscripcion.numeroSeguridadSocial || '')
    fillTextField('telefono1', inscripcion.telefono1)
    fillTextField('telefono2', inscripcion.telefono2 || '')
    fillTextField('enfermedad', inscripcion.enfermedad || '')
    fillTextField('medicacion', inscripcion.medicacion || '')
    fillTextField('alergico', inscripcion.alergico || '')
    fillTextField('nombreTutor', inscripcion.nombreTutor)
    fillTextField('dni', inscripcion.dni)

    // Intentar incrustar la firma si existe
    if (inscripcion.firma) {
      try {
        const firmaPath = join(process.cwd(), 'storage', 'firmas', inscripcion.firma)
        if (existsSync(firmaPath)) {
          const firmaBytes = await readFile(firmaPath)
          const firmaImage = await pdfDoc.embedPng(firmaBytes)
          
          // Buscar el campo de firma en el PDF
          const pages = pdfDoc.getPages()
          const firstPage = pages[0]
          
          // Dimensiones de la imagen de firma
          const firmaDims = firmaImage.scale(0.15) // Escala para que quepa en el espacio
          
          // Posición aproximada donde debería ir la firma (ajustar según el PDF)
          // En el PDF que veo, la firma está cerca de la parte inferior
          firstPage.drawImage(firmaImage, {
            x: 50,
            y: 130,
            width: firmaDims.width,
            height: firmaDims.height,
          })
          
          console.log('Firma incrustada en el PDF')
        }
      } catch (error) {
        console.error('Error al incrustar la firma:', error)
      }
    }

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
      const firmaPath = join(process.cwd(), 'storage', 'firmas', inscripcion.firma)
      const firmaBytes = await readFile(firmaPath)
      const firmaImage = await pdfDoc.embedPng(firmaBytes)
      const firmaDims = firmaImage.scale(0.5)

      page.drawImage(firmaImage, {
        x: 50,
        y: yPosition,
        width: Math.min(firmaDims.width, width - 100),
        height: Math.min(firmaDims.height, 60),
      })
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

