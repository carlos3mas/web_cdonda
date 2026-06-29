import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('[prisma] DATABASE_URL no está configurada')
  }

  const isRemoteTurso =
    databaseUrl.includes('turso.io') || databaseUrl.startsWith('libsql://')
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (isRemoteTurso && !authToken) {
    console.error(
      '[prisma] TURSO_AUTH_TOKEN no está configurado. Las consultas fallarán (fetch failed).'
    )
  }

  const libsql = createClient({
    url: databaseUrl,
    authToken: authToken || undefined,
  })

  const adapter = new PrismaLibSQL(libsql)

  const prismaClient = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['query', 'error', 'warn', 'info'],
    errorFormat: 'pretty',
  })

  const disconnect = async () => {
    try {
      await prismaClient.$disconnect()
    } catch {
      /* ya desconectado */
    }
  }

  process.on('beforeExit', disconnect)
  process.on('SIGTERM', disconnect)
  process.on('SIGINT', disconnect)

  return prismaClient
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()

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

