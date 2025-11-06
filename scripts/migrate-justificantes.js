/**
 * Script para migrar justificantes de public/ a storage/
 * 
 * IMPORTANTE: Ejecutar ANTES de desplegar a producción si ya tienes justificantes existentes
 * 
 * Uso:
 *   node scripts/migrate-justificantes.js
 */

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrate() {
  console.log('🔄 Iniciando migración de justificantes...\n')

  const publicDir = path.join(process.cwd(), 'public', 'justificantes')
  const storageDir = path.join(process.cwd(), 'storage', 'justificantes')

  // Verificar que existe la carpeta pública
  if (!fs.existsSync(publicDir)) {
    console.log('✅ No hay carpeta public/justificantes/. No hay nada que migrar.')
    return
  }

  // Crear carpeta storage si no existe
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
    console.log('✅ Carpeta storage/justificantes/ creada')
  }

  // Obtener todas las inscripciones con justificantes
  const inscripciones = await prisma.inscripcion.findMany({
    where: {
      justificantePago: {
        not: null
      }
    }
  })

  console.log(`📁 Encontradas ${inscripciones.length} inscripciones con justificantes\n`)

  let migrados = 0
  let errores = 0

  for (const inscripcion of inscripciones) {
    try {
      // Extraer nombre del archivo de la ruta pública
      let filename = inscripcion.justificantePago
      
      // Si tiene /justificantes/ al inicio, quitarlo
      if (filename.startsWith('/justificantes/')) {
        filename = filename.replace('/justificantes/', '')
      }

      const oldPath = path.join(publicDir, filename)
      const newPath = path.join(storageDir, filename)

      // Verificar que el archivo existe
      if (!fs.existsSync(oldPath)) {
        console.log(`⚠️  Archivo no encontrado: ${filename}`)
        errores++
        continue
      }

      // Copiar archivo (no mover, por seguridad)
      fs.copyFileSync(oldPath, newPath)

      // Actualizar base de datos (solo el nombre del archivo, sin ruta)
      await prisma.inscripcion.update({
        where: { id: inscripcion.id },
        data: {
          justificantePago: filename
        }
      })

      console.log(`✅ Migrado: ${filename}`)
      migrados++

    } catch (error) {
      console.error(`❌ Error migrando inscripción ${inscripcion.id}:`, error.message)
      errores++
    }
  }

  console.log(`\n📊 Resumen:`)
  console.log(`   ✅ Migrados: ${migrados}`)
  console.log(`   ❌ Errores: ${errores}`)
  console.log(`   📁 Total: ${inscripciones.length}`)

  if (migrados > 0) {
    console.log(`\n⚠️  IMPORTANTE:`)
    console.log(`   Los archivos originales en public/justificantes/ NO han sido eliminados.`)
    console.log(`   Verifica que todo funciona correctamente y luego elimínalos manualmente.`)
    console.log(`\n   Comando para eliminar (cuando estés seguro):`)
    console.log(`   rm -rf public/justificantes/`)
  }

  await prisma.$disconnect()
}

migrate()
  .catch(error => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })

