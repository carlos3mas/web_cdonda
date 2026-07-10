import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Comprueba contenedor, BD y configuración mínima de auth (sin datos sensibles). */
export async function GET() {
  const databaseUrl = process.env.DATABASE_URL ?? ''
  const isTurso =
    databaseUrl.includes('turso.io') || databaseUrl.startsWith('libsql://')

  const checks = {
    ok: true,
    db: false,
    padresSeparadosColumn: false,
    cuota1PagadaColumn: false,
    nombreArchivoJustificanteColumn: false,
    databaseUrl: Boolean(databaseUrl),
    databaseUrlFormat: isTurso ? 'turso' : databaseUrl ? 'other' : 'missing',
    tursoToken: Boolean(process.env.TURSO_AUTH_TOKEN),
    authConfigured: Boolean(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL),
    dbError: null as string | null,
  }

  if (isTurso && !checks.tursoToken) {
    checks.ok = false
    checks.dbError = 'TURSO_AUTH_TOKEN no configurado'
  }

  if (!checks.databaseUrl) {
    checks.ok = false
    checks.dbError = 'DATABASE_URL no configurada'
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db = true

    const columns = await prisma.$queryRaw<{ name: string }[]>`
      PRAGMA table_info(inscripciones)
    `
    checks.padresSeparadosColumn = columns.some((c) => c.name === 'padresSeparados')
    checks.cuota1PagadaColumn = columns.some((c) => c.name === 'cuota1Pagada')
    checks.nombreArchivoJustificanteColumn = columns.some(
      (c) => c.name === 'nombreArchivoJustificante'
    )

    const missingColumns: string[] = []
    if (!checks.padresSeparadosColumn) missingColumns.push('padresSeparados')
    if (!checks.cuota1PagadaColumn) missingColumns.push('cuota1Pagada')
    if (!checks.nombreArchivoJustificanteColumn) missingColumns.push('nombreArchivoJustificante')

    if (missingColumns.length > 0) {
      checks.ok = false
      checks.dbError = `Faltan columnas: ${missingColumns.join(', ')}. Ejecuta: npm run db:apply-migrations`
    }
  } catch (error) {
    checks.ok = false
    checks.db = false
    const message = error instanceof Error ? error.message : String(error)
    checks.dbError = message.slice(0, 200)
    console.error('[health] Database check failed:', error)
  }

  if (!checks.authConfigured) {
    checks.ok = false
  }

  return NextResponse.json(checks, { status: checks.ok ? 200 : 503 })
}
