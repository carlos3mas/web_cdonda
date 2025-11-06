import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Obtener todos los admins
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(admins)
  } catch (error) {
    console.error('Error al obtener admins:', error)
    return NextResponse.json(
      { error: 'Error al obtener administradores' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo admin
export async function POST(request: NextRequest) {
  // Proteger con autenticación - solo admins pueden crear otros admins
  const authError = await requireAuth(request)
  if (authError) return authError
  
  // Rate limiting
  const rateLimitError = apiRateLimit(request)
  if (rateLimitError) {
    return NextResponse.json(
      { error: rateLimitError.error },
      { status: rateLimitError.status }
    )
  }
  
  try {
    const body = await request.json()

    if (!body.email || !body.nombre || !body.password) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: body.email }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(body.password, 10)

    // Crear el admin
    const admin = await prisma.admin.create({
      data: {
        email: body.email,
        nombre: body.nombre,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Error al crear admin:', error)
    return NextResponse.json(
      { error: 'Error al crear administrador' },
      { status: 500 }
    )
  }
}

