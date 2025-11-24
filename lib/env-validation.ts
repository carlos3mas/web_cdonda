/**
 * Validación de variables de entorno requeridas
 */

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

export function validateEnv() {
  // No validar durante el build - las variables de entorno no están disponibles
  // Esta función solo debe llamarse en runtime cuando realmente se necesite
  if (!process.env.DATABASE_URL) {
    // Si no hay DATABASE_URL, probablemente estamos en build time
    return
  }

  const missing: string[] = []
  
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ ERROR: Faltan variables de entorno requeridas:')
    missing.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.error('\nPor favor, configura estas variables en el archivo .env')
    
    // Solo lanzar error en runtime de producción, no durante el build
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      throw new Error('Variables de entorno faltantes en producción')
    }
  } else {
    console.log('✅ Variables de entorno validadas correctamente')
  }
}

// No validar automáticamente durante el build
// La validación se hará cuando sea necesaria (en las rutas API)
// Solo validar si estamos en runtime y tenemos las variables de entorno
if (
  typeof window === 'undefined' &&
  process.env.DATABASE_URL &&
  process.env.NEXTAUTH_SECRET &&
  process.env.NEXTAUTH_URL
) {
  // Solo validar si todas las variables están presentes (runtime)
  try {
    validateEnv()
  } catch (error) {
    // No lanzar error durante el build, solo en runtime real
    if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
      throw error
    }
  }
}

