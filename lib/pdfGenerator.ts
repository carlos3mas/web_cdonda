import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Inscripcion } from '@/types'
import { formatDate } from './utils'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Mapeo de nombres de campos que deben usarse en los PDFs
// Nombres actualizados para la plantilla 2025: CAMPUS NAVIDAD HOJA INSCRIPCION 2025
const FIELD_ALIASES: Record<string, string[]> = {
  nombreJugador: ['nombre', 'Nombre', 'nombreJugador', 'nombreJugador1'],
  apellidos: ['apellido', 'Apellidos', 'apellidos', 'mas iserte'],
  fechaNacimiento: ['fechaNacimiento', 'Fecha Nacimiento', 'fechaNacimiento1'],
  dni: ['DNI', 'dni'],
  nombreTutor: ['tutor', 'tutor del jugador', 'nombreTutor', 'madrePadreTutor', 'juan mas pradas'],
  telefono1: ['telefono1', 'teléfono padre/tutor', 'telefono madre/tutora', 'telMadre', 'telefonoMadre'],
  telefono2: ['telefono2', 'telefonos madre/tutora', 'telefono padre/tutor', 'telPadre', 'telefonoPadre'],
  enfermedad: ['enfermedad', 'Padece alguna enfermedad'],
  medicacion: ['medicacion', 'Necesita medicación', 'Necesita  medicación no'],
  alergico: ['alergias', 'Alérgico  Intolerante a', 'Alérgico / Intolerante a', 'Alergico  Intolerante a', 'alergico', 'Alergico'],
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

// Función auxiliar para truncar texto según ancho aproximado
function truncateText(text: string, maxWidth: number): string {
  // Aproximación: 1 punto ≈ 0.6 caracteres con fuente de 8pt
  const maxChars = Math.floor(maxWidth * 0.6)
  if (text.length <= maxChars) return text
  return text.substring(0, maxChars - 3) + '...'
}

// Función para generar PDF con lista completa de inscripciones en formato tabla
export async function generateListaInscripcionesPDF(inscripciones: Inscripcion[]): Promise<Uint8Array> {
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
  const lightGrayColor = rgb(0.9, 0.9, 0.9)

  let yPosition = height - 50
  const margin = 40
  const tableWidth = width - (margin * 2) // 595 - 80 = 515 puntos disponibles
  const rowHeight = 20
  const headerHeight = 30

  // Cargar logo del equipo
  let logoImage = null
  try {
    const logoPath = join(process.cwd(), 'public', 'images', 'logos', 'escudo-cd-onda.webp')
    if (existsSync(logoPath)) {
      const logoBytes = await readFile(logoPath)
      logoImage = await pdfDoc.embedPng(logoBytes)
    }
  } catch (error) {
    console.warn('No se pudo cargar el logo:', error)
  }

  // Encabezado - fondo rojo más alto para que no corte el texto
  const headerHeightTotal = 85
  page.drawRectangle({
    x: 0,
    y: yPosition - 20,
    width: width,
    height: headerHeightTotal,
    color: redColor,
  })

  // Dibujar logo si existe - ajustado para mejor visualización
  let textStartX = margin
  if (logoImage) {
    const logoSize = 45
    const logoX = margin + 5
    const logoY = yPosition - 15
    page.drawImage(logoImage, {
      x: logoX,
      y: logoY,
      width: logoSize,
      height: logoSize,
    })
    textStartX = logoX + logoSize + 12 // Espacio después del logo
  }

  page.drawText('CLUB DEPORTIVO ONDA', {
    x: textStartX,
    y: yPosition + 18,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  })

  page.drawText('Lista de Inscripciones', {
    x: textStartX,
    y: yPosition - 2,
    size: 14,
    font: font,
    color: rgb(1, 1, 1),
  })

  page.drawText(`Total: ${inscripciones.length} inscripciones`, {
    x: textStartX,
    y: yPosition - 18,
    size: 10,
    font: font,
    color: rgb(1, 1, 1),
  })

  yPosition -= (headerHeightTotal + 10)

  // Definir columnas de la tabla - ajustadas para que quepan en el ancho disponible
  // Ancho total disponible: 515 puntos
  const columns = [
    { label: 'Nº', width: 25 },
    { label: 'Jugador', width: 95 },
    { label: 'DNI', width: 70 },
    { label: 'Tutor', width: 95 },
    { label: 'Teléfono', width: 80 },
    { label: 'Fecha Nac.', width: 75 },
    { label: 'Estado', width: 65 },
  ]

  // Verificar que las columnas quepan
  const totalColumnWidth = columns.reduce((sum, col) => sum + col.width, 0)
  if (totalColumnWidth > tableWidth) {
    // Ajustar proporcionalmente si excede
    const scale = tableWidth / totalColumnWidth
    columns.forEach(col => {
      col.width = Math.floor(col.width * scale)
    })
  }

  const columnPositions: number[] = []
  let currentX = margin
  columns.forEach((col, index) => {
    columnPositions.push(currentX)
    if (index < columns.length - 1) {
      currentX += col.width
    } else {
      // La última columna se ajusta al ancho disponible
      columnPositions.push(currentX)
    }
  })

  // Dibujar encabezado de la tabla
  page.drawRectangle({
    x: margin,
    y: yPosition - headerHeight,
    width: tableWidth,
    height: headerHeight,
    color: redColor,
  })

  columns.forEach((col, index) => {
    const label = truncateText(col.label, col.width - 6)
    page.drawText(label, {
      x: columnPositions[index] + 3,
      y: yPosition - 20,
      size: 9,
      font: fontBold,
      color: rgb(1, 1, 1),
    })
  })

  yPosition -= headerHeight + 5

  // Dibujar filas de datos
  inscripciones.forEach((inscripcion, index) => {
    // Si no hay espacio, crear nueva página
    if (yPosition < 100) {
      const newPage = pdfDoc.addPage([595, 842])
      yPosition = height - 50
      
      // Repetir encabezado completo en nueva página
      const headerHeightTotal = 85
      newPage.drawRectangle({
        x: 0,
        y: yPosition - 20,
        width: width,
        height: headerHeightTotal,
        color: redColor,
      })

      // Dibujar logo en nueva página si existe
      let textStartXNew = margin
      if (logoImage) {
        const logoSize = 45
        const logoX = margin + 5
        const logoY = yPosition - 15
        newPage.drawImage(logoImage, {
          x: logoX,
          y: logoY,
          width: logoSize,
          height: logoSize,
        })
        textStartXNew = logoX + logoSize + 12
      }

      newPage.drawText('CLUB DEPORTIVO ONDA', {
        x: textStartXNew,
        y: yPosition + 18,
        size: 20,
        font: fontBold,
        color: rgb(1, 1, 1),
      })

      newPage.drawText('Lista de Inscripciones', {
        x: textStartXNew,
        y: yPosition - 2,
        size: 14,
        font: font,
        color: rgb(1, 1, 1),
      })

      newPage.drawText(`Total: ${inscripciones.length} inscripciones`, {
        x: textStartXNew,
        y: yPosition - 18,
        size: 10,
        font: font,
        color: rgb(1, 1, 1),
      })

      yPosition -= (headerHeightTotal + 10)
      
      // Repetir encabezado de tabla en nueva página
      newPage.drawRectangle({
        x: margin,
        y: yPosition - headerHeight,
        width: tableWidth,
        height: headerHeight,
        color: redColor,
      })

      columns.forEach((col, colIndex) => {
        const label = truncateText(col.label, col.width - 6)
        newPage.drawText(label, {
          x: columnPositions[colIndex] + 3,
          y: yPosition - 20,
          size: 9,
          font: fontBold,
          color: rgb(1, 1, 1),
        })
      })

      yPosition -= headerHeight + 5
    }

    const currentPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1)
    const isEven = index % 2 === 0

    // Fondo alternado para filas
    if (isEven) {
      currentPage.drawRectangle({
        x: margin,
        y: yPosition - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: lightGrayColor,
      })
    }

    // Línea divisoria
    currentPage.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 0.5,
      color: grayColor,
    })

    // Datos de la fila - truncar según el ancho de cada columna
    const numero = (index + 1).toString()
    const jugador = truncateText(`${inscripcion.nombreJugador} ${inscripcion.apellidos}`, columns[1].width - 10)
    const dni = truncateText(inscripcion.dni, columns[2].width - 10)
    const tutor = truncateText(inscripcion.nombreTutor, columns[3].width - 10)
    const telefono = truncateText(inscripcion.telefono1, columns[4].width - 10)
    const fechaNac = formatDate(inscripcion.fechaNacimiento).substring(0, 10)
    const estado = inscripcion.pagada ? 'Paga' : 'Pendi'

    currentPage.drawText(numero, {
      x: columnPositions[0] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: blackColor,
    })

    currentPage.drawText(jugador, {
      x: columnPositions[1] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: blackColor,
    })

    currentPage.drawText(dni, {
      x: columnPositions[2] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: blackColor,
    })

    currentPage.drawText(tutor, {
      x: columnPositions[3] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: blackColor,
    })

    currentPage.drawText(telefono, {
      x: columnPositions[4] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: blackColor,
    })

    currentPage.drawText(fechaNac, {
      x: columnPositions[5] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: blackColor,
    })

    currentPage.drawText(estado, {
      x: columnPositions[6] + 3,
      y: yPosition - 15,
      size: 8,
      font: font,
      color: inscripcion.pagada ? rgb(0, 0.6, 0) : rgb(0.8, 0.4, 0),
    })

    yPosition -= rowHeight
  })

  // Pie de página en todas las páginas
  const totalPages = pdfDoc.getPageCount()
  for (let i = 0; i < totalPages; i++) {
    const page = pdfDoc.getPage(i)
    page.drawText(`Página ${i + 1} de ${totalPages}`, {
      x: width / 2 - 30,
      y: 30,
      size: 8,
      font: font,
      color: grayColor,
    })
    page.drawText(`Generado el ${formatDate(new Date())}`, {
      x: margin,
      y: 30,
      size: 8,
      font: font,
      color: grayColor,
    })
  }

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

