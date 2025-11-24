import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function ensureDefaultAdmin() {
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
    console.error('No se pudo crear el admin por defecto:', error)
  }
}

// Solo crear admin por defecto en runtime, no durante el build
// Durante el build de Next.js no tenemos acceso a la base de datos
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-development-build' ||
  (typeof process.env.NEXT_PHASE !== 'undefined' && process.env.NEXT_PHASE.includes('build'))

if (process.env.NODE_ENV !== 'test' && !isBuildTime) {
  ensureDefaultAdmin()
}

