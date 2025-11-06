'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Inscripcion } from '@/types'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, ExternalLink } from 'lucide-react'

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
          {/* Estado y Tipo */}
          <div className="flex items-center gap-3">
            <Badge variant={inscripcion.pagada ? "default" : "secondary"}>
              {inscripcion.pagada ? "Pagada" : "Pendiente"}
            </Badge>
            <Badge variant="outline">
              {inscripcion.tipoInscripcion === 'campus-navidad' ? 'Campus de Navidad' :
               inscripcion.tipoInscripcion === 'campus-verano' ? 'Campus de Verano' :
               inscripcion.tipoInscripcion === 'anual' ? 'Inscripción Anual' :
               inscripcion.tipoInscripcion}
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
              <div>
                <p className="text-sm text-gray-500">Derechos de Imagen</p>
                <div className="flex items-center gap-2">
                  <Badge variant={inscripcion.derechosImagen ? "default" : "secondary"}>
                    {inscripcion.derechosImagen ? 'Autorizados' : 'No Autorizados'}
                  </Badge>
                </div>
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

          {/* Justificante de Pago */}
          {inscripcion.justificantePago && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">Justificante de Pago</h3>
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {inscripcion.nombreArchivoJustificante || 'Justificante de pago'}
                    </p>
                    <p className="text-sm text-gray-500">Archivo adjuntado</p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`/api/justificantes/${inscripcion.justificantePago}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </a>
                    <a 
                      href={`/api/justificantes/${inscripcion.justificantePago}`} 
                      download={inscripcion.nombreArchivoJustificante || 'justificante.pdf'}
                    >
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

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

