import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Solo inicializar Prisma si DATABASE_URL está disponible
// Esto evita errores durante el build cuando las variables de entorno no están configuradas
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // Retornar un cliente "mock" que lanzará errores informativos si se intenta usar
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error(
          'Prisma Client no está inicializado. DATABASE_URL no está configurada.'
        )
      },
    })
  }
  
  // Configuración optimizada para producción
  const prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['query', 'error', 'warn', 'info'],
    errorFormat: 'pretty',
  })
  
  // Manejar desconexión en producción
  if (process.env.NODE_ENV === 'production') {
    // Asegurar que las conexiones se cierren correctamente
    process.on('beforeExit', async () => {
      await prismaClient.$disconnect()
    })
  }
  
  return prismaClient
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function ensureDefaultAdmin() {
  // No hacer nada si no hay DATABASE_URL
  if (!process.env.DATABASE_URL) {
    return
  }

  try {
    const email = process.env.ADMIN_EMAIL || 'admin@cdonda.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const nombre = process.env.ADMIN_NAME || 'Administrador CD Onda'

    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) return

    const hashed = await bcrypt.hash(password, 10)
    await prisma.admin.create({
      data: {
        email,
        nombre,
        password: hashed,
      },
    })
    console.log(`🔐 Admin por defecto creado (${email}). Cambia las credenciales en producción.`)
  } catch (error) {
    // Silenciar errores durante el build
    if (process.env.DATABASE_URL) {
      console.error('No se pudo crear el admin por defecto:', error)
    }
  }
}

// Solo crear admin por defecto en runtime, no durante el build
// Durante el build de Next.js no tenemos acceso a la base de datos
// Verificamos si DATABASE_URL existe antes de intentar crear el admin
if (
  process.env.NODE_ENV !== 'test' &&
  process.env.DATABASE_URL &&
  typeof window === 'undefined'
) {
  // Ejecutar de forma asíncrona para no bloquear la importación del módulo
  ensureDefaultAdmin().catch(() => {
    // Silenciar errores durante el build o cuando la DB no está disponible
  })
}

