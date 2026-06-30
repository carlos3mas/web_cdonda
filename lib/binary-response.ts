import { NextResponse } from 'next/server'

/** Respuesta binaria sin Content-Length manual (evita mismatch con proxy/compresión). */
export function binaryResponse(
  body: Uint8Array | Buffer,
  headers: Record<string, string>
): NextResponse {
  const bytes = Buffer.isBuffer(body) ? body : Buffer.from(body)
  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      ...headers,
      'Cache-Control': headers['Cache-Control'] ?? 'no-store, no-transform',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
