import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { InscripcionFormData } from '@/types'

// GET - Obtener todas las inscripciones
export async function GET() {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(inscripciones)
  } catch (error) {
    console.error('Error al obtener inscripciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener inscripciones' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva inscripción
export async function POST(request: NextRequest) {
  try {
    const body: InscripcionFormData = await request.json()

    // Validar campos requeridos
    if (!body.nombreJugador || !body.apellidos || !body.fechaNacimiento || 
        !body.dni || !body.nombreTutor || !body.telefono1 || !body.email) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Crear inscripción en la base de datos
    const inscripcion = await prisma.inscripcion.create({
      data: {
        nombreJugador: body.nombreJugador,
        apellidos: body.apellidos,
        fechaNacimiento: new Date(body.fechaNacimiento),
        dni: body.dni,
        nombreTutor: body.nombreTutor,
        telefono1: body.telefono1,
        telefono2: body.telefono2 || null,
        email: body.email,
        tieneHermanos: body.tieneHermanos === 'si',
        alergias: body.alergias || null,
        observaciones: body.observaciones || null,
        pagada: false
      }
    })

    return NextResponse.json({
      success: true,
      inscripcionId: inscripcion.id,
      message: 'Inscripción creada correctamente'
    })
  } catch (error) {
    console.error('Error al crear inscripción:', error)
    return NextResponse.json(
      { error: 'Error al procesar la inscripción' },
      { status: 500 }
    )
  }
}

