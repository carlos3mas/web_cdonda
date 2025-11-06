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

// Validar inmediatamente al importar
if (typeof window === 'undefined') { // Solo en servidor
  validateEnv()
}

