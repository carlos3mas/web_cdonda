import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
  rawPrisma: PrismaClient | undefined
}

function isConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  const normalized = message.toLowerCase()
  return (
    normalized.includes('terminated') ||
    normalized.includes('fetch failed') ||
    normalized.includes('connection') ||
    normalized.includes('econnreset') ||
    normalized.includes('socket')
  )
}

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

async function resetPrismaClient(): Promise<void> {
  if (globalForPrisma.rawPrisma) {
    try {
      await globalForPrisma.rawPrisma.$disconnect()
    } catch {
      /* ya desconectado */
    }
  }
  globalForPrisma.prisma = undefined
  globalForPrisma.rawPrisma = undefined
}

async function withReconnect<T>(operation: (db: PrismaClient) => Promise<T>): Promise<T> {
  try {
    return await operation(getPrismaClient())
  } catch (error) {
    if (!isConnectionError(error)) throw error
    console.warn('[prisma] Conexión perdida con Turso, reconectando...')
    await resetPrismaClient()
    return await operation(getPrismaClient())
  }
}

function wrapWithReconnect(client: PrismaClient): PrismaClient {
  return new Proxy(client, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)

      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, {
          get(modelTarget, modelProp) {
            const modelValue = Reflect.get(modelTarget, modelProp)
            if (typeof modelValue === 'function') {
              return (...args: unknown[]) =>
                withReconnect((db) => {
                  const model = (db as Record<string, unknown>)[prop as string]
                  if (!model || typeof model !== 'object') {
                    throw new Error(`[prisma] Modelo no encontrado: ${String(prop)}`)
                  }
                  const method = (model as Record<string, unknown>)[modelProp as string]
                  if (typeof method !== 'function') {
                    throw new Error(`[prisma] Método no encontrado: ${String(modelProp)}`)
                  }
                  return (method as (...innerArgs: unknown[]) => Promise<unknown>)(...args)
                })
            }
            return modelValue
          },
        })
      }

      if (typeof value === 'function') {
        return (...args: unknown[]) =>
          withReconnect((db) => {
            const method = (db as Record<string, unknown>)[prop as string]
            if (typeof method !== 'function') {
              throw new Error(`[prisma] Método no encontrado: ${String(prop)}`)
            }
            return (method as (...innerArgs: unknown[]) => Promise<unknown>)(...args)
          })
      }

      return value
    },
  }) as unknown as PrismaClient
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const raw = createPrismaClient()
    globalForPrisma.rawPrisma = raw
    globalForPrisma.prisma = wrapWithReconnect(raw)
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()

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
  ensureDefaultAdmin().catch(() => {
    /* silenciar en build */
  })
}
