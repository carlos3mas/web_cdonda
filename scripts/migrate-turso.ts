import { createClient } from '@libsql/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '../.env') })

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function migrate() {
  console.log('🔄 Migrando base de datos Turso...')
  
  try {
    // Crear tabla de inscripciones
    await client.execute(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id TEXT PRIMARY KEY,
        tipoInscripcion TEXT NOT NULL DEFAULT 'campus-navidad',
        nombreJugador TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        fechaNacimiento TEXT NOT NULL,
        dni TEXT NOT NULL,
        nombreTutor TEXT NOT NULL,
        telefono1 TEXT NOT NULL,
        telefono2 TEXT,
        enfermedad TEXT,
        medicacion TEXT,
        alergico TEXT,
        numeroSeguridadSocial TEXT,
        pagada INTEGER NOT NULL DEFAULT 0,
        justificantePago TEXT,
        nombreArchivoJustificante TEXT,
        firma TEXT,
        nombreArchivoFirma TEXT,
        derechosImagen INTEGER NOT NULL DEFAULT 0,
        comentarios TEXT,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Tabla inscripciones creada')

    // Crear tabla de admins
    await client.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        password TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Tabla admins creada')

    // Crear tabla de plantillas PDF
    await client.execute(`
      CREATE TABLE IF NOT EXISTS plantillas_pdf (
        id TEXT PRIMARY KEY,
        tipoInscripcion TEXT NOT NULL UNIQUE,
        nombreArchivo TEXT NOT NULL,
        rutaArchivo TEXT NOT NULL,
        activa INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Tabla plantillas_pdf creada')

    console.log('✅ Migración completada exitosamente')
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

migrate()
