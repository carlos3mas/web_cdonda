import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Comprueba contenedor, BD y configuración mínima de auth (sin datos sensibles). */
export async function GET() {
  const checks = {
    ok: true,
    db: false,
    authConfigured: Boolean(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL),
    tursoToken: Boolean(process.env.TURSO_AUTH_TOKEN),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db = true
  } catch (error) {
    checks.ok = false
    checks.db = false
    console.error('[health] Database check failed:', error)
  }

  if (!checks.authConfigured) {
    checks.ok = false
  }

  return NextResponse.json(checks, { status: checks.ok ? 200 : 503 })
}
