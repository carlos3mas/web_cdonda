import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Eliminando todas las inscripciones de la base de datos...\n')

  try {
    await prisma.$connect()
    console.log('✅ Conexión a la base de datos exitosa\n')

    const totalInscripciones = await prisma.inscripcion.count()
    console.log(`📊 Total de inscripciones encontradas: ${totalInscripciones}\n`)

    if (totalInscripciones === 0) {
      console.log('✅ La base de datos ya está vacía. No hay nada que eliminar.')
      await prisma.$disconnect()
      return
    }

    console.log('🗑️  Eliminando todas las inscripciones...')
    const resultado = await prisma.inscripcion.deleteMany({})
    
    console.log(`\n✅ Se eliminaron ${resultado.count} inscripción(es) de la base de datos.`)
    console.log('✅ La base de datos ahora está vacía.')

  } catch (error) {
    console.error('❌ Error al eliminar inscripciones:', error)
    if (error instanceof Error) {
      console.error('Mensaje:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

