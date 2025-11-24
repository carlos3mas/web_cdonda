/**
 * Script para inicializar la base de datos en producción
 * 
 * Uso:
 *   node scripts/init-production-db.js
 * 
 * O con variables de entorno:
 *   DATABASE_URL="..." node scripts/init-production-db.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Inicializando base de datos de producción...\n');

// Verificar que DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no está configurada');
  console.error('Por favor, configura la variable de entorno DATABASE_URL');
  process.exit(1);
}

try {
  // Generar el cliente de Prisma
  console.log('📦 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Aplicar migraciones
  console.log('\n📊 Aplicando migraciones...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  console.log('\n✅ Base de datos inicializada correctamente!');
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Verifica que las tablas se crearon correctamente');
  console.log('   2. Crea el admin inicial usando el script de seed o la API');
  console.log('   3. Cambia las credenciales por defecto en producción');
} catch (error) {
  console.error('\n❌ Error al inicializar la base de datos:', error.message);
  process.exit(1);
}

