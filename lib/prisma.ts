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
    normalized.includes('econnreset') ||
    normalized.includes('socket hang up')
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

function getRawPrismaClient(): PrismaClient {
  if (!globalForPrisma.rawPrisma) {
    globalForPrisma.rawPrisma = createPrismaClient()
    globalForPrisma.prisma = wrapWithReconnect(globalForPrisma.rawPrisma)
  }
  return globalForPrisma.rawPrisma
}

async function withReconnect<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
  try {
    return await operation(getRawPrismaClient())
  } catch (error) {
    if (!isConnectionError(error)) throw error
    console.warn('[prisma] Conexión perdida con Turso, reconectando...')
    await resetPrismaClient()
    return await operation(getRawPrismaClient())
  }
}

function wrapWithReconnect(client: PrismaClient): PrismaClient {
  return new Proxy(client, {
    get(target, prop) {
      const value = Reflect.get(target, prop)

      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, {
          get(modelTarget, modelProp) {
            const modelValue = Reflect.get(modelTarget, modelProp)
            if (typeof modelValue === 'function') {
              return (...args: unknown[]) =>
                withReconnect((raw) => {
                  const model = (raw as unknown as Record<string | symbol, unknown>)[prop]
                  if (!model || typeof model !== 'object') {
                    throw new Error(`[prisma] Modelo no encontrado: ${String(prop)}`)
                  }
                  const method = (model as Record<string | symbol, unknown>)[modelProp]
                  if (typeof method !== 'function') {
                    throw new Error(`[prisma] Método no encontrado: ${String(modelProp)}`)
                  }
                  return (method as (...innerArgs: unknown[]) => Promise<unknown>).apply(model, args)
                })
            }
            return modelValue
          },
        })
      }

      if (typeof value === 'function') {
        return (...args: unknown[]) =>
          withReconnect((raw) => {
            const method = (raw as unknown as Record<string | symbol, unknown>)[prop]
            if (typeof method !== 'function') {
              throw new Error(`[prisma] Método no encontrado: ${String(prop)}`)
            }
            return (method as (...innerArgs: unknown[]) => Promise<unknown>).apply(raw, args)
          })
      }

      return value
    },
  }) as unknown as PrismaClient
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    getRawPrismaClient()
  }
  return globalForPrisma.prisma!
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
