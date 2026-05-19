import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env') })

const EXPECTED_COLUMNS = [
  'id', 'tipoInscripcion', 'nombreJugador', 'apellidos', 'fechaNacimiento', 'dni',
  'direccion', 'localidad', 'codigoPostal', 'semanasCampus', 'diasSueltos',
  'tallaCamiseta', 'tallaPantalon', 'tallaCalcetines',
  'nombreTutor', 'telefono1', 'telefono2',
  'enfermedad', 'medicacion', 'alergico', 'numeroSeguridadSocial',
  'pagada', 'justificantePago', 'justificantePagoMimeType', 'nombreArchivoJustificante',
  'firma', 'firmaMimeType', 'nombreArchivoFirma',
  'derechosImagen', 'comentarios', 'createdAt', 'updatedAt',
]

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const info = await client.execute('PRAGMA table_info(inscripciones)')
const existing = new Set(info.rows.map((r) => r.name))
const missing = EXPECTED_COLUMNS.filter((c) => !existing.has(c))
const extra = [...existing].filter((c) => !EXPECTED_COLUMNS.includes(c))

console.log('Columnas en BD:', existing.size)
if (missing.length) console.log('Faltan:', missing.join(', '))
else console.log('✅ Todas las columnas del schema están presentes')
if (extra.length) console.log('Extra (legacy):', extra.join(', '))

client.close()
