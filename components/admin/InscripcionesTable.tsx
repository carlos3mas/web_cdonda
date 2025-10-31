'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Inscripcion } from '@/types'
import { formatDate } from '@/lib/utils'
import { Download, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { InscripcionDialog } from './InscripcionDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

interface InscripcionesTableProps {
  inscripciones: Inscripcion[]
  onUpdate: () => void
}

export function InscripcionesTable({ inscripciones, onUpdate }: InscripcionesTableProps) {
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null)
  const [deleteInscripcionId, setDeleteInscripcionId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleTogglePagada = async (inscripcion: Inscripcion) => {
    try {
      await fetch(`/api/inscripciones/${inscripcion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagada: !inscripcion.pagada })
      })
      onUpdate()
    } catch (error) {
      console.error('Error al actualizar inscripción:', error)
    }
  }

  const handleDownloadPDF = async (inscripcionId: string) => {
    try {
      const response = await fetch(`/api/inscripciones/${inscripcionId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `inscripcion-${inscripcionId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
    }
  }

  const handleDelete = async (inscripcionId: string) => {
    try {
      await fetch(`/api/inscripciones/${inscripcionId}`, {
        method: 'DELETE'
      })
      setDeleteDialogOpen(false)
      setDeleteInscripcionId(null)
      onUpdate()
    } catch (error) {
      console.error('Error al eliminar inscripción:', error)
    }
  }

  const handleViewDetails = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion)
    setDialogOpen(true)
  }

  const handleDeleteClick = (inscripcionId: string) => {
    setDeleteInscripcionId(inscripcionId)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inscripciones</CardTitle>
          <CardDescription>
            Gestiona todas las inscripciones del Campus de Navidad 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Jugador</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">DNI</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tutor</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Teléfono</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Fecha</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inscripciones.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No hay inscripciones todavía
                    </td>
                  </tr>
                ) : (
                  inscripciones.map((inscripcion, index) => (
                    <motion.tr
                      key={inscripcion.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{inscripcion.nombreJugador}</div>
                        <div className="text-sm text-gray-500">{inscripcion.apellidos}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">{inscripcion.dni}</td>
                      <td className="py-3 px-4 text-sm">{inscripcion.nombreTutor}</td>
                      <td className="py-3 px-4 text-sm">{inscripcion.telefono1}</td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(inscripcion.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge 
                          variant={inscripcion.pagada ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleTogglePagada(inscripcion)}
                        >
                          {inscripcion.pagada ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Pagada
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(inscripcion)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadPDF(inscripcion.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(inscripcion.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <InscripcionDialog
        inscripcion={selectedInscripcion}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => deleteInscripcionId && handleDelete(deleteInscripcionId)}
      />
    </>
  )
}

