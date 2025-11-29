import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkConnection() {
  console.log('🔍 Verificando conexión a la base de datos...\n')
  
  try {
    // Obtener la URL de la base de datos (ocultando la contraseña)
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error('❌ ERROR: DATABASE_URL no está configurada')
      return
    }
    
    // Ocultar la contraseña en la URL para mostrarla
    const safeUrl = dbUrl.replace(/:[^:@]+@/, ':****@')
    console.log('📡 URL de conexión (oculta):', safeUrl)
    console.log('')
    
    // Intentar conectar
    console.log('🔄 Intentando conectar...')
    await prisma.$connect()
    console.log('✅ Conexión exitosa!\n')
    
    // Verificar que podemos hacer una consulta
    console.log('🔍 Verificando acceso a las tablas...')
    const inscripcionesCount = await prisma.inscripcion.count()
    const adminsCount = await prisma.admin.count()
    
    console.log('')
    console.log('📊 Estado de la base de datos:')
    console.log(`   - Inscripciones: ${inscripcionesCount}`)
    console.log(`   - Administradores: ${adminsCount}`)
    console.log('')
    
    // Obtener información de la conexión
    const result = await prisma.$queryRaw<Array<{ current_database: string, version: string }>>`
      SELECT current_database(), version()
    `
    
    if (result && result.length > 0) {
      console.log('🗄️  Información de la base de datos:')
      console.log(`   - Base de datos: ${result[0].current_database}`)
      console.log(`   - Versión: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`)
      console.log('')
    }
    
    // Verificar si es Neon
    if (dbUrl.includes('neon.tech')) {
      console.log('☁️  Proveedor: Neon PostgreSQL')
      if (dbUrl.includes('pooler')) {
        console.log('   - Tipo de conexión: Pooler')
      } else {
        console.log('   - Tipo de conexión: Directa')
      }
      console.log('')
    }
    
    console.log('✅ Verificación completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error al verificar la conexión:', error)
    if (error instanceof Error) {
      console.error('   Mensaje:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkConnection()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })

