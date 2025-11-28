import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🧹 Limpieza de inscripciones de prueba\n')

  try {
    // Verificar conexión
    await prisma.$connect()
    console.log('✅ Conexión a la base de datos exitosa\n')

    // Contar inscripciones
    const totalInscripciones = await prisma.inscripcion.count()
    console.log(`📊 Total de inscripciones en la base de datos: ${totalInscripciones}\n`)

    if (totalInscripciones === 0) {
      console.log('✅ La base de datos ya está vacía. No hay nada que limpiar.')
      rl.close()
      await prisma.$disconnect()
      return
    }

    // Mostrar todas las inscripciones
    const inscripciones = await prisma.inscripcion.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombreJugador: true,
        apellidos: true,
        tipoInscripcion: true,
        createdAt: true,
      }
    })

    console.log('📋 Inscripciones encontradas:')
    inscripciones.forEach((inscripcion, index) => {
      console.log(`   ${index + 1}. ${inscripcion.nombreJugador} ${inscripcion.apellidos} (${inscripcion.tipoInscripcion}) - ${inscripcion.createdAt.toLocaleDateString('es-ES')}`)
    })

    console.log('\n⚠️  ADVERTENCIA: Esta acción eliminará TODAS las inscripciones de la base de datos.')
    const respuesta = await question('¿Estás seguro de que quieres continuar? (escribe "SI" para confirmar): ')

    if (respuesta.trim().toUpperCase() !== 'SI') {
      console.log('❌ Operación cancelada.')
      rl.close()
      await prisma.$disconnect()
      return
    }

    // Eliminar todas las inscripciones
    console.log('\n🗑️  Eliminando inscripciones...')
    const resultado = await prisma.inscripcion.deleteMany({})
    
    console.log(`✅ Se eliminaron ${resultado.count} inscripción(es) de la base de datos.`)
    console.log('✅ La base de datos ahora está vacía.')

  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error)
    if (error instanceof Error) {
      console.error('Mensaje:', error.message)
    }
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

main()

