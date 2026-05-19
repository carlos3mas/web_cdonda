import { NextResponse } from 'next/server'

/** Endpoint ligero para comprobar que el contenedor responde (Dokploy / Traefik). */
export async function GET() {
  return NextResponse.json({ ok: true })
}
