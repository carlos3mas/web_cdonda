import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('No DATABASE_URL')
    process.exit(1)
  }

  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  const info = await client.execute('PRAGMA table_info(inscripciones)')
  const cols = new Set(info.rows.map((r) => String(r.name)))

  const needed = [
    'cuota1Pagada',
    'cuota2Pagada',
    'nombreArchivoJustificante',
    'justificantePago',
    'justificantePagoMimeType',
    'modalidadPago',
  ]

  for (const c of needed) {
    console.log(`${c}: ${cols.has(c) ? 'OK' : 'MISSING'}`)
  }

  const rows = await client.execute({
    sql: `SELECT id, nombreJugador, apellidos, modalidadPago, cuota1Pagada, nombreArchivoJustificante,
          CASE WHEN justificantePago IS NULL THEN 0 ELSE length(justificantePago) END as justificante_len
          FROM inscripciones
          WHERE tipoInscripcion = 'anual' AND nombreJugador LIKE ? AND apellidos LIKE ?`,
    args: ['%Enzo%', '%Ballester%'],
  })
  console.log('Enzo:', JSON.stringify(rows.rows, null, 2))

  client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
