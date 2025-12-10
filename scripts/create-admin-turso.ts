import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function createAdmin() {
  console.log('🔐 Creando usuario administrador...')
  
  const email = 'escolafut@gmail.com'
  const password = 'Cdonda!Admin3'
  const nombre = 'Administrador CD Onda'
  
  try {
    // Verificar si ya existe
    const existing = await client.execute({
      sql: 'SELECT * FROM admins WHERE email = ?',
      args: [email]
    })
    
    if (existing.rows.length > 0) {
      console.log('⚠️  El administrador ya existe. Actualizando contraseña...')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      
      await client.execute({
        sql: 'UPDATE admins SET password = ?, nombre = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?',
        args: [hashedPassword, nombre, email]
      })
      
      console.log('✅ Contraseña del administrador actualizada')
    } else {
      console.log('➕ Creando nuevo administrador...')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      const id = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      await client.execute({
        sql: 'INSERT INTO admins (id, email, nombre, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        args: [id, email, nombre, hashedPassword]
      })
      
      console.log('✅ Administrador creado exitosamente')
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (error) {
    console.error('❌ Error al crear administrador:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

createAdmin()
