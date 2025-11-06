import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { apiRateLimit } from '@/lib/rate-limit'

// GET - Obtener una inscripción específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Proteger con autenticación
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
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: params.id }
    })

    if (!inscripcion) {
      return NextResponse.json(
        { error: 'Inscripción no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(inscripcion)
  } catch (error) {
    console.error('Error al obtener inscripción:', error)
    return NextResponse.json(
      { error: 'Error al obtener inscripción' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar inscripción
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Proteger con autenticación
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

    const inscripcion = await prisma.inscripcion.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(inscripcion)
  } catch (error) {
    console.error('Error al actualizar inscripción:', error)
    return NextResponse.json(
      { error: 'Error al actualizar inscripción' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar inscripción
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Proteger con autenticación
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
    await prisma.inscripcion.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar inscripción:', error)
    return NextResponse.json(
      { error: 'Error al eliminar inscripción' },
      { status: 500 }
    )
  }
}

