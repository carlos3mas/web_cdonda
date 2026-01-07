import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

async function checkLastInscription() {
  const client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    const result = await client.execute(`
      SELECT 
        id,
        nombreJugador,
        apellidos,
        LENGTH(justificantePago) as justificante_size,
        justificantePagoMimeType,
        LENGTH(firma) as firma_size,
        firmaMimeType,
        nombreArchivoJustificante,
        nombreArchivoFirma
      FROM inscripciones 
      ORDER BY createdAt DESC 
      LIMIT 1
    `)
    
    console.log('📊 Última inscripción creada:\n')
    console.log(result.rows[0])
    console.log('\n✅ Verificación:')
    console.log(`- Justificante guardado: ${result.rows[0].justificante_size ? 'SÍ' : 'NO'} (${result.rows[0].justificante_size} caracteres base64)`)
    console.log(`- Tipo MIME justificante: ${result.rows[0].justificantePagoMimeType || 'NO GUARDADO'}`)
    console.log(`- Firma guardada: ${result.rows[0].firma_size ? 'SÍ' : 'NO'} (${result.rows[0].firma_size} caracteres base64)`)
    console.log(`- Tipo MIME firma: ${result.rows[0].firmaMimeType || 'NO GUARDADO'}`)
    
    // Calcular tamaño aproximado en KB
    if (result.rows[0].justificante_size) {
      const sizeKB = Math.round((result.rows[0].justificante_size as number) * 0.75 / 1024)
      console.log(`\n💾 Tamaño aproximado del justificante: ${sizeKB} KB`)
    }
    if (result.rows[0].firma_size) {
      const sizeKB = Math.round((result.rows[0].firma_size as number) * 0.75 / 1024)
      console.log(`💾 Tamaño aproximado de la firma: ${sizeKB} KB`)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    client.close()
  }
}

checkLastInscription()
