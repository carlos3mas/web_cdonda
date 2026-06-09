/**
 * Verifica generación y guardado de la cláusula rellena (inscripción anual).
 * Uso: npm run db:verify-clausula
 */
import 'dotenv/config'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '../lib/prisma'
import { generateClausulaDerechosImagenDocument } from '../lib/anualDocuments'

async function main() {
  console.log('1/5 Generando PDF relleno (derechos=SÍ)...')
  const si = await generateClausulaDerechosImagenDocument({
    nombreJugador: 'Carlos',
    apellidos: 'Prueba Test',
    nombreTutor: 'María Prueba Test',
    dniJugador: '11111111H',
    dniTutor: '12345678Z',
    fechaInscripcion: new Date('2026-06-09'),
    derechosImagen: true,
  })

  const outDir = join(process.cwd(), 'scripts', 'output')
  await mkdir(outDir, { recursive: true })
  const samplePath = join(outDir, 'clausula-test-si.pdf')
  await writeFile(samplePath, Buffer.from(si.base64, 'base64'))
  console.log(`    ✓ PDF guardado en ${samplePath}`)

  if (si.base64.length < 10000) {
    throw new Error('El PDF generado parece vacío o demasiado pequeño')
  }
  console.log(`    ✓ Tamaño base64: ${si.base64.length} caracteres`)

  console.log('2/5 Generando PDF con derechos=NO...')
  const no = await generateClausulaDerechosImagenDocument({
    nombreJugador: 'Ana',
    apellidos: 'Ejemplo',
    nombreTutor: 'Pedro Ejemplo',
    dniJugador: '22222222J',
    dniTutor: '87654321X',
    fechaInscripcion: new Date('2026-06-09'),
    derechosImagen: false,
  })
  const noPath = join(outDir, 'clausula-test-no.pdf')
  await writeFile(noPath, Buffer.from(no.base64, 'base64'))
  console.log(`    ✓ PDF guardado en ${noPath}`)

  console.log('3/5 Guardando inscripción de prueba en Turso...')
  const created = await prisma.inscripcion.create({
    data: {
      tipoInscripcion: 'anual',
      nombreJugador: 'Prueba',
      apellidos: 'Clausula Imagen',
      fechaNacimiento: new Date('2015-06-01'),
      dni: '00000000T',
      dniJugador: '11111111H',
      nombreTutor: 'Tutor Prueba',
      telefono1: '600000000',
      pagada: false,
      derechosImagen: true,
      categoria: 'futbol-8',
      modalidadPago: 'fraccionado',
      documentoDerechosImagen: si.base64,
      documentoDerechosImagenMimeType: si.mimeType,
      nombreArchivoDerechosImagen: si.fileName,
      cuota1Pagada: true,
      cuota2Pagada: false,
      cuota3Pagada: false,
    },
  })
  console.log(`    ✓ ID ${created.id}`)

  console.log('4/5 Eliminando registro de prueba...')
  await prisma.inscripcion.delete({ where: { id: created.id } })
  console.log('    ✓ Registro eliminado')

  console.log('\n✅ Cláusula rellena y guardado en BD verificados.')
}

main()
  .catch((error) => {
    console.error('\n❌ Verificación fallida:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
