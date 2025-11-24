/**
 * Script para crear un administrador en producción
 * 
 * Uso:
 *   node scripts/create-admin.js
 * 
 * O con variables de entorno:
 *   DATABASE_URL="..." ADMIN_EMAIL="..." ADMIN_PASSWORD="..." ADMIN_NAME="..." node scripts/create-admin.js
 */

// Intentar cargar variables de entorno locales (opcional)
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv no está disponible, usar variables de entorno del sistema
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@cdonda.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const nombre = process.env.ADMIN_NAME || 'Administrador CD Onda';

  console.log('🔐 Creando administrador...\n');
  console.log(`Email: ${email}`);
  console.log(`Nombre: ${nombre}\n`);

  try {
    // Verificar si ya existe
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      console.log('⚠️  El administrador ya existe. No se creará uno nuevo.');
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el admin
    const admin = await prisma.admin.create({
      data: {
        email,
        nombre,
        password: hashedPassword,
      },
    });

    console.log('✅ Administrador creado exitosamente!');
    console.log(`\n📧 Email: ${admin.email}`);
    console.log(`👤 Nombre: ${admin.nombre}`);
    console.log(`🆔 ID: ${admin.id}`);
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login!');
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
    if (error.code === 'P2002') {
      console.error('   El email ya está en uso');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

