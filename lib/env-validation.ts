/**
 * Validación de variables de entorno requeridas
 */

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

export function validateEnv() {
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
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Variables de entorno faltantes en producción')
    }
  } else {
    console.log('✅ Variables de entorno validadas correctamente')
  }
}

// Validar solo en runtime, no durante el build
// Next.js ejecuta código durante el build, pero no tenemos acceso a las variables de entorno
// Usamos una verificación más robusta para detectar si estamos en build time
const isBuildTime = 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.NEXT_PHASE === 'phase-development-build' ||
  (typeof process.env.NEXT_PHASE !== 'undefined' && process.env.NEXT_PHASE.includes('build'))

if (typeof window === 'undefined' && !isBuildTime) {
  // Solo validar si no estamos en build time
  try {
    validateEnv()
  } catch (error) {
    // Si estamos en build time, solo mostrar warning
    if (isBuildTime) {
      console.warn('⚠️  Variables de entorno no validadas durante el build. Se validarán en runtime.')
    } else {
      throw error
    }
  }
}

