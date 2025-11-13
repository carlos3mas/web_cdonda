import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Nombres y apellidos para generar datos realistas
const nombres = [
  'Carlos', 'María', 'Juan', 'Ana', 'Pedro', 'Laura', 'Miguel', 'Sofía',
  'David', 'Elena', 'Javier', 'Carmen', 'Antonio', 'Isabel', 'Francisco', 'Lucía',
  'José', 'Paula', 'Manuel', 'Marta', 'Daniel', 'Cristina', 'Alejandro', 'Patricia',
  'Roberto', 'Natalia', 'Fernando', 'Andrea', 'Luis', 'Sara', 'Pablo', 'Eva'
]

const apellidos = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
  'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez',
  'Muñoz', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez',
  'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Suárez', 'Molina', 'Morales'
]

// Generar DNI aleatorio
function generarDNI(): string {
  const numeros = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const letra = letras[parseInt(numeros) % 23]
  return `${numeros}${letra}`
}

// Generar teléfono aleatorio
function generarTelefono(): string {
  return `6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
}

// Generar fecha de nacimiento aleatoria (entre 5 y 15 años)
function generarFechaNacimiento(): Date {
  const hoy = new Date()
  const edad = Math.floor(Math.random() * 11) + 5 // Entre 5 y 15 años
  const año = hoy.getFullYear() - edad
  const mes = Math.floor(Math.random() * 12)
  const dia = Math.floor(Math.random() * 28) + 1
  return new Date(año, mes, dia)
}

// Generar fecha de inscripción aleatoria (últimos 3 meses)
function generarFechaInscripcion(): Date {
  const hoy = new Date()
  const diasAtras = Math.floor(Math.random() * 90) // Últimos 90 días
  const fecha = new Date(hoy)
  fecha.setDate(fecha.getDate() - diasAtras)
  return fecha
}

// Tipos de inscripción
const tiposInscripcion = ['campus-navidad', 'campus-pascua', 'campus-verano', 'anual']

// Comentarios de ejemplo
const comentariosEjemplo = [
  null,
  null,
  null,
  'El niño tiene alergia al polen',
  'Por favor, avisar si hay cambios de horario',
  'El jugador necesita atención especial durante las comidas',
  null,
  'Contactar preferiblemente por WhatsApp',
  null,
  'El niño tiene experiencia previa en campus de verano'
]

async function main() {
  console.log('🌱 Generando inscripciones de prueba...')

  // Limpiar inscripciones existentes (opcional, comentar si quieres mantener las actuales)
  const count = await prisma.inscripcion.count()
  if (count > 0) {
    console.log(`⚠️  Hay ${count} inscripciones existentes.`)
    console.log('💡 Si quieres limpiarlas, descomenta las líneas siguientes en el script.')
    // await prisma.inscripcion.deleteMany({})
    // console.log('🗑️  Inscripciones anteriores eliminadas')
  }

  const inscripciones = []
  const totalInscripciones = 50 // Generar 50 inscripciones de prueba

  for (let i = 0; i < totalInscripciones; i++) {
    const nombreJugador = nombres[Math.floor(Math.random() * nombres.length)]
    const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)]
    const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)]
    const apellidosCompletos = `${apellido1} ${apellido2}`
    
    const nombreTutor = `${nombres[Math.floor(Math.random() * nombres.length)]} ${apellidos[Math.floor(Math.random() * apellidos.length)]}`
    const tipoInscripcion = tiposInscripcion[Math.floor(Math.random() * tiposInscripcion.length)]
    const fechaNacimiento = generarFechaNacimiento()
    const fechaInscripcion = generarFechaInscripcion()
    const pagada = Math.random() > 0.4 // 60% pagadas, 40% pendientes
    const tieneComentarios = Math.random() > 0.7 // 30% con comentarios
    const tieneEnfermedad = Math.random() > 0.8 // 20% con enfermedad
    const tieneAlergia = Math.random() > 0.7 // 30% con alergia
    const tieneMedicacion = Math.random() > 0.85 // 15% con medicación
    const tieneSeguridadSocial = Math.random() > 0.3 // 70% con número de seguridad social
    const derechosImagen = Math.random() > 0.3 // 70% con derechos de imagen

    // Crear inscripción
    const inscripcion = await prisma.inscripcion.create({
      data: {
        tipoInscripcion,
        nombreJugador,
        apellidos: apellidosCompletos,
        fechaNacimiento,
        dni: generarDNI(),
        nombreTutor,
        telefono1: generarTelefono(),
        telefono2: Math.random() > 0.5 ? generarTelefono() : null,
        enfermedad: tieneEnfermedad ? 'Asma leve' : null,
        medicacion: tieneMedicacion ? 'Ventolin en caso de necesidad' : null,
        alergico: tieneAlergia ? 'Polen, ácaros' : null,
        numeroSeguridadSocial: tieneSeguridadSocial ? `1234567890${i}` : null,
        pagada,
        justificantePago: `justificante-test-${i}.pdf`,
        nombreArchivoJustificante: `justificante-pago-${nombreJugador.toLowerCase()}.pdf`,
        firma: Math.random() > 0.2 ? `firma-test-${i}.png` : null,
        nombreArchivoFirma: Math.random() > 0.2 ? 'firma-tutor.png' : null,
        derechosImagen,
        comentarios: tieneComentarios ? comentariosEjemplo[Math.floor(Math.random() * comentariosEjemplo.length)] : null,
        createdAt: fechaInscripcion,
        updatedAt: fechaInscripcion
      }
    })

    inscripciones.push(inscripcion)
    
    if ((i + 1) % 10 === 0) {
      console.log(`✅ ${i + 1}/${totalInscripciones} inscripciones creadas...`)
    }
  }

  console.log(`\n✅ ${inscripciones.length} inscripciones de prueba creadas exitosamente!`)
  console.log('\n📊 Resumen por tipo:')
  
  const resumen = inscripciones.reduce((acc, ins) => {
    acc[ins.tipoInscripcion] = (acc[ins.tipoInscripcion] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  Object.entries(resumen).forEach(([tipo, count]) => {
    console.log(`   ${tipo}: ${count} inscripciones`)
  })
  
  console.log(`\n💰 Pagadas: ${inscripciones.filter(i => i.pagada).length}`)
  console.log(`⏳ Pendientes: ${inscripciones.filter(i => !i.pagada).length}`)
  console.log(`💬 Con comentarios: ${inscripciones.filter(i => i.comentarios).length}`)
  
  console.log('\n🎉 ¡Seed completado! Puedes probar el panel de administración ahora.')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

