import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno desde .env (solo local/desarrollo)
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const nombre = process.env.ADMIN_NAME || 'Administrador CD Onda'

  // Validar que las variables obligatorias estén presentes
  if (!email || !password) {
    console.error('❌ Error: faltan variables de entorno para crear el admin')
    console.error('Debes configurar al menos: ADMIN_EMAIL y ADMIN_PASSWORD')
    process.exit(1)
  }

  console.log('🔐 Creando/actualizando usuario administrador...')
  console.log('📧 Email:', email)

  try {
    // Verificar si ya existe
    const existing = await client.execute({
      sql: 'SELECT * FROM admins WHERE email = ?',
      args: [email],
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    if (existing.rows.length > 0) {
      console.log('⚠️  El administrador ya existe. Actualizando contraseña y nombre...')

      await client.execute({
        sql: 'UPDATE admins SET password = ?, nombre = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?',
        args: [hashedPassword, nombre, email],
      })

      console.log('✅ Datos del administrador actualizados')
    } else {
      console.log('➕ Creando nuevo administrador...')

      const id = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`

      await client.execute({
        sql: 'INSERT INTO admins (id, email, nombre, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        args: [id, email, nombre, hashedPassword],
      })

      console.log('✅ Administrador creado exitosamente')
    }
  } catch (error) {
    console.error('❌ Error al crear/actualizar administrador:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

createAdmin()
