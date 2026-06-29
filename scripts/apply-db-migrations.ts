/**
 * Aplica en Turso/libSQL todas las columnas que requiere prisma/schema.prisma.
 * Idempotente: si la columna ya existe, continúa.
 *
 * Uso: npm run db:apply-migrations
 */
import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '../.env') })

/** Columnas añadidas tras el esquema inicial (orden recomendado) */
const MIGRATIONS: { name: string; sql: string }[] = [
  {
    name: '20250107155600_add_mime_type_fields',
    sql: 'ALTER TABLE inscripciones ADD COLUMN justificantePagoMimeType TEXT;',
  },
  {
    name: '20250107155600_add_mime_type_fields_firma',
    sql: 'ALTER TABLE inscripciones ADD COLUMN firmaMimeType TEXT;',
  },
  {
    name: '20250115120000_add_comentarios',
    sql: 'ALTER TABLE inscripciones ADD COLUMN comentarios TEXT;',
  },
  {
    name: '20260518120000_add_campus_verano_direccion',
    sql: 'ALTER TABLE inscripciones ADD COLUMN direccion TEXT;',
  },
  {
    name: '20260518120000_add_campus_verano_localidad',
    sql: 'ALTER TABLE inscripciones ADD COLUMN localidad TEXT;',
  },
  {
    name: '20260518120000_add_campus_verano_codigoPostal',
    sql: 'ALTER TABLE inscripciones ADD COLUMN codigoPostal TEXT;',
  },
  {
    name: '20260518120000_add_campus_verano_semanasCampus',
    sql: 'ALTER TABLE inscripciones ADD COLUMN semanasCampus TEXT;',
  },
  {
    name: '20260518120000_add_campus_verano_diasSueltos',
    sql: 'ALTER TABLE inscripciones ADD COLUMN diasSueltos TEXT;',
  },
  {
    name: '20260518130000_add_tallaCamiseta',
    sql: 'ALTER TABLE inscripciones ADD COLUMN tallaCamiseta TEXT;',
  },
  {
    name: '20260518130000_add_tallaPantalon',
    sql: 'ALTER TABLE inscripciones ADD COLUMN tallaPantalon TEXT;',
  },
  {
    name: '20260518130000_add_tallaCalcetines',
    sql: 'ALTER TABLE inscripciones ADD COLUMN tallaCalcetines TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_email',
    sql: 'ALTER TABLE inscripciones ADD COLUMN email TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_sexo',
    sql: 'ALTER TABLE inscripciones ADD COLUMN sexo TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_categoria',
    sql: 'ALTER TABLE inscripciones ADD COLUMN categoria TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_modalidadPago',
    sql: 'ALTER TABLE inscripciones ADD COLUMN modalidadPago TEXT;',
  },
  {
    name: '20260602102000_add_inscripcion_anual_descuentoHermanos',
    sql: 'ALTER TABLE inscripciones ADD COLUMN descuentoHermanos TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_dniFrontalEncriptado',
    sql: 'ALTER TABLE inscripciones ADD COLUMN dniFrontalEncriptado TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_dniFrontalMimeType',
    sql: 'ALTER TABLE inscripciones ADD COLUMN dniFrontalMimeType TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_dniReversoEncriptado',
    sql: 'ALTER TABLE inscripciones ADD COLUMN dniReversoEncriptado TEXT;',
  },
  {
    name: '20260521120000_add_inscripcion_anual_dniReversoMimeType',
    sql: 'ALTER TABLE inscripciones ADD COLUMN dniReversoMimeType TEXT;',
  },
  {
    name: '20260602100000_add_cuota1Pagada',
    sql: 'ALTER TABLE inscripciones ADD COLUMN cuota1Pagada INTEGER NOT NULL DEFAULT 0;',
  },
  {
    name: '20260602100000_add_cuota2Pagada',
    sql: 'ALTER TABLE inscripciones ADD COLUMN cuota2Pagada INTEGER NOT NULL DEFAULT 0;',
  },
  {
    name: '20260602100000_add_cuota3Pagada',
    sql: 'ALTER TABLE inscripciones ADD COLUMN cuota3Pagada INTEGER NOT NULL DEFAULT 0;',
  },
  {
    name: '20260602100000_add_justificantePagoCuota2',
    sql: 'ALTER TABLE inscripciones ADD COLUMN justificantePagoCuota2 TEXT;',
  },
  {
    name: '20260602100000_add_justificantePagoCuota2MimeType',
    sql: 'ALTER TABLE inscripciones ADD COLUMN justificantePagoCuota2MimeType TEXT;',
  },
  {
    name: '20260602100000_add_nombreArchivoJustificanteCuota2',
    sql: 'ALTER TABLE inscripciones ADD COLUMN nombreArchivoJustificanteCuota2 TEXT;',
  },
  {
    name: '20260602100000_add_justificantePagoCuota3',
    sql: 'ALTER TABLE inscripciones ADD COLUMN justificantePagoCuota3 TEXT;',
  },
  {
    name: '20260602100000_add_justificantePagoCuota3MimeType',
    sql: 'ALTER TABLE inscripciones ADD COLUMN justificantePagoCuota3MimeType TEXT;',
  },
  {
    name: '20260602100000_add_nombreArchivoJustificanteCuota3',
    sql: 'ALTER TABLE inscripciones ADD COLUMN nombreArchivoJustificanteCuota3 TEXT;',
  },
  {
    name: '20260609103000_add_documentoDerechosImagen',
    sql: 'ALTER TABLE inscripciones ADD COLUMN documentoDerechosImagen TEXT;',
  },
  {
    name: '20260609103000_add_documentoDerechosImagenMimeType',
    sql: 'ALTER TABLE inscripciones ADD COLUMN documentoDerechosImagenMimeType TEXT;',
  },
  {
    name: '20260609103000_add_nombreArchivoDerechosImagen',
    sql: 'ALTER TABLE inscripciones ADD COLUMN nombreArchivoDerechosImagen TEXT;',
  },
  {
    name: '20260609120000_add_dniJugador',
    sql: 'ALTER TABLE inscripciones ADD COLUMN dniJugador TEXT;',
  },
  {
    name: '20260611120000_add_padres_separados',
    sql: 'ALTER TABLE inscripciones ADD COLUMN padresSeparados INTEGER NOT NULL DEFAULT 0;',
  },
]

const EXPECTED_COLUMNS = [
  'id',
  'tipoInscripcion',
  'nombreJugador',
  'apellidos',
  'fechaNacimiento',
  'dni',
  'direccion',
  'localidad',
  'codigoPostal',
  'semanasCampus',
  'diasSueltos',
  'tallaCamiseta',
  'tallaPantalon',
  'tallaCalcetines',
  'nombreTutor',
  'telefono1',
  'telefono2',
  'enfermedad',
  'medicacion',
  'alergico',
  'numeroSeguridadSocial',
  'pagada',
  'cuota1Pagada',
  'cuota2Pagada',
  'cuota3Pagada',
  'justificantePago',
  'justificantePagoMimeType',
  'nombreArchivoJustificante',
  'justificantePagoCuota2',
  'justificantePagoCuota2MimeType',
  'nombreArchivoJustificanteCuota2',
  'justificantePagoCuota3',
  'justificantePagoCuota3MimeType',
  'nombreArchivoJustificanteCuota3',
  'firma',
  'firmaMimeType',
  'nombreArchivoFirma',
  'derechosImagen',
  'padresSeparados',
  'comentarios',
  'email',
  'sexo',
  'categoria',
  'modalidadPago',
  'descuentoHermanos',
  'dniFrontalEncriptado',
  'dniFrontalMimeType',
  'dniReversoEncriptado',
  'dniReversoMimeType',
  'dniJugador',
  'documentoDerechosImagen',
  'documentoDerechosImagenMimeType',
  'nombreArchivoDerechosImagen',
  'createdAt',
  'updatedAt',
]

function isDuplicateColumnError(message: string): boolean {
  return (
    message.includes('duplicate column') ||
    message.includes('already exists') ||
    message.includes('SQLITE_ERROR') && message.toLowerCase().includes('duplicate')
  )
}

async function applyMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL no está configurada en .env')
    process.exit(1)
  }

  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  try {
    console.log('🔄 Aplicando migraciones en inscripciones...\n')

    for (const migration of MIGRATIONS) {
      try {
        await client.execute(migration.sql)
        console.log(`✅ ${migration.name}`)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        if (isDuplicateColumnError(message)) {
          console.log(`ℹ️  ${migration.name} (ya aplicada)`)
        } else {
          throw error
        }
      }
    }

    const info = await client.execute('PRAGMA table_info(inscripciones)')
    const existing = new Set(
      info.rows.map((row) => String(row.name))
    )
    const missing = EXPECTED_COLUMNS.filter((col) => !existing.has(col))

    console.log('')
    if (missing.length > 0) {
      console.error('❌ Faltan columnas tras la migración:', missing.join(', '))
      process.exit(1)
    }

    console.log('✅ Esquema verificado: todas las columnas de Prisma están en la BD')
    console.log(`   (${existing.size} columnas en inscripciones)`)
  } finally {
    client.close()
  }
}

applyMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error en migración:', error)
    process.exit(1)
  })
