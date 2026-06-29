import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient(): PrismaClient {
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

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['query', 'error', 'warn', 'info'],
    errorFormat: 'pretty',
  })
}

function isConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    normalized.includes('terminated') ||
    normalized.includes('fetch failed') ||
    normalized.includes('econnreset') ||
    normalized.includes('socket hang up')
  )
}

export async function reconnectPrisma(): Promise<void> {
  if (globalForPrisma.prisma) {
    try {
      await globalForPrisma.prisma.$disconnect()
    } catch {
      /* ya desconectado */
    }
  }
  globalForPrisma.prisma = createPrismaClient()
}

/** Reintenta una operación tras reconectar si Turso corta la conexión. */
export async function withDbRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (!isConnectionError(error)) throw error
    console.warn('[prisma] Conexión perdida, reconectando...')
    await reconnectPrisma()
    return await operation()
  }
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

/** Cliente singleton; el proxy delega siempre al cliente actual (permite reconectar). */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop)
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client)
    }
    return value
  },
})

async function ensureDefaultAdmin() {
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
    if (process.env.DATABASE_URL) {
      console.error('No se pudo crear el admin por defecto:', error)
    }
  }
}

if (
  process.env.NODE_ENV !== 'test' &&
  process.env.DATABASE_URL &&
  typeof window === 'undefined'
) {
  // Diferir para no competir con login/consultas críticas en arranque en frío
  setTimeout(() => {
    ensureDefaultAdmin().catch(() => {
      /* silenciar en build */
    })
  }, 5000)
}
