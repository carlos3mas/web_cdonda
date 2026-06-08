/**
 * Verifica conexión a Turso con el mismo cliente que usa la app en producción.
 * Uso: npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" scripts/check-turso-connection.ts
 */
import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

async function main() {
  const url = process.env.DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  console.log('🔍 Comprobando Turso...\n')

  if (!url) {
    console.error('❌ DATABASE_URL no definida')
    process.exit(1)
  }

  console.log('📡 URL:', url.replace(/\/\/.*@/, '//***@'))

  if ((url.includes('turso.io') || url.startsWith('libsql://')) && !authToken) {
    console.error('❌ TURSO_AUTH_TOKEN no definido (obligatorio para Turso remoto)')
    process.exit(1)
  }

  const client = createClient({ url, authToken: authToken || undefined })

  try {
    const result = await client.execute('SELECT 1 AS ok')
    console.log('✅ Conexión OK:', result.rows[0])

    const admins = await client.execute('SELECT COUNT(*) AS n FROM admins')
    console.log('👤 Admins en BD:', admins.rows[0])

    const inscripciones = await client.execute('SELECT COUNT(*) AS n FROM inscripciones')
    console.log('📋 Inscripciones en BD:', inscripciones.rows[0])
  } catch (error) {
    console.error('❌ fetch failed / error de conexión:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

main()
