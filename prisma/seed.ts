import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear un administrador por defecto
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@cdonda.com' },
    update: {},
    create: {
      email: 'admin@cdonda.com',
      nombre: 'Administrador CD Onda',
      password: hashedPassword
    }
  })

  console.log('✅ Admin creado:', admin.email)
  console.log('📧 Email: admin@cdonda.com')
  console.log('🔑 Password: admin123')
  console.log('⚠️  Recuerda cambiar estas credenciales en producción!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

