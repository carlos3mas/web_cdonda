'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Inscripcion } from '@/types'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface InscripcionDialogProps {
  inscripcion: Inscripcion | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InscripcionDialog({ inscripcion, open, onOpenChange }: InscripcionDialogProps) {
  if (!inscripcion) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Inscripción</DialogTitle>
          <DialogDescription>
            ID: {inscripcion.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado */}
          <div>
            <Badge variant={inscripcion.pagada ? "default" : "secondary"}>
              {inscripcion.pagada ? "Pagada" : "Pendiente"}
            </Badge>
          </div>

          {/* Datos del Jugador */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-600">Datos del Jugador</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{inscripcion.nombreJugador}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Apellidos</p>
                <p className="font-medium">{inscripcion.apellidos}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-medium">{formatDate(inscripcion.fechaNacimiento)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">DNI</p>
                <p className="font-medium">{inscripcion.dni}</p>
              </div>
            </div>
          </div>

          {/* Datos del Tutor */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-600">Datos del Tutor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre del Tutor</p>
                <p className="font-medium">{inscripcion.nombreTutor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{inscripcion.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono 1</p>
                <p className="font-medium">{inscripcion.telefono1}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono 2</p>
                <p className="font-medium">{inscripcion.telefono2 || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-red-600">Información Adicional</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">¿Tiene hermanos en el campus?</p>
                <p className="font-medium">{inscripcion.tieneHermanos ? 'Sí' : 'No'}</p>
              </div>
              {inscripcion.alergias && (
                <div>
                  <p className="text-sm text-gray-500">Alergias o Enfermedades</p>
                  <p className="font-medium">{inscripcion.alergias}</p>
                </div>
              )}
              {inscripcion.observaciones && (
                <div>
                  <p className="text-sm text-gray-500">Observaciones</p>
                  <p className="font-medium">{inscripcion.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>Fecha de inscripción</p>
                <p className="font-medium text-gray-700">{formatDate(inscripcion.createdAt)}</p>
              </div>
              <div>
                <p>Última actualización</p>
                <p className="font-medium text-gray-700">{formatDate(inscripcion.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

