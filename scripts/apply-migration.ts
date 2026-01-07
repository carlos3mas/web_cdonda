import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '../.env') })

async function applyMigration() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    console.log('🔄 Aplicando migración para añadir campos MIME type...')
    
    // Añadir columna justificantePagoMimeType
    await client.execute(`
      ALTER TABLE inscripciones ADD COLUMN justificantePagoMimeType TEXT;
    `)
    console.log('✅ Columna justificantePagoMimeType añadida')
    
    // Añadir columna firmaMimeType
    await client.execute(`
      ALTER TABLE inscripciones ADD COLUMN firmaMimeType TEXT;
    `)
    console.log('✅ Columna firmaMimeType añadida')
    
    console.log('✅ Migración completada exitosamente')
  } catch (error: any) {
    if (error.message?.includes('duplicate column name')) {
      console.log('ℹ️  Las columnas ya existen, migración no necesaria')
    } else {
      console.error('❌ Error al aplicar migración:', error)
      throw error
    }
  } finally {
    client.close()
  }
}

applyMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
