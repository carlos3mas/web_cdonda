import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando base de datos...\n')

  try {
    // Verificar conexión
    await prisma.$connect()
    console.log('✅ Conexión a la base de datos exitosa\n')

    // Contar inscripciones
    const totalInscripciones = await prisma.inscripcion.count()
    console.log(`📊 Total de inscripciones: ${totalInscripciones}`)

    if (totalInscripciones > 0) {
      console.log('\n📋 Listado de inscripciones:')
      const inscripciones = await prisma.inscripcion.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nombreJugador: true,
          apellidos: true,
          tipoInscripcion: true,
          createdAt: true,
          pagada: true,
        }
      })

      inscripciones.forEach((inscripcion, index) => {
        console.log(`\n${index + 1}. ${inscripcion.nombreJugador} ${inscripcion.apellidos}`)
        console.log(`   Tipo: ${inscripcion.tipoInscripcion}`)
        console.log(`   Fecha: ${inscripcion.createdAt.toLocaleString('es-ES')}`)
        console.log(`   Pagada: ${inscripcion.pagada ? '✅' : '❌'}`)
        console.log(`   ID: ${inscripcion.id}`)
      })
    } else {
      console.log('✅ La base de datos está vacía (no hay inscripciones)')
    }

    // Verificar admins
    const totalAdmins = await prisma.admin.count()
    console.log(`\n👤 Total de administradores: ${totalAdmins}`)

  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error)
    if (error instanceof Error) {
      console.error('Mensaje:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

