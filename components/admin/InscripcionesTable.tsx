'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Inscripcion } from '@/types'
import { formatDate } from '@/lib/utils'
import { Download, Eye, Trash2, CheckCircle, XCircle, Search, X, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InscripcionDialog } from './InscripcionDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

interface InscripcionesTableProps {
  inscripciones: Inscripcion[]
  onUpdate: () => void
  showTipoFilter?: boolean
}

export function InscripcionesTable({ inscripciones, onUpdate, showTipoFilter = false }: InscripcionesTableProps) {
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null)
  const [deleteInscripcionId, setDeleteInscripcionId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('todos')

  // Obtener tipos únicos de inscripciones
  const tiposInscripcion = useMemo(() => {
    if (!Array.isArray(inscripciones)) return []
    const tipos = new Set(inscripciones.map(i => i.tipoInscripcion))
    return Array.from(tipos).sort()
  }, [inscripciones])

  // Filtrar inscripciones basado en la búsqueda y el tipo
  const filteredInscripciones = useMemo(() => {
    if (!Array.isArray(inscripciones)) return []
    let filtered = inscripciones

    // Filtrar por tipo solo si showTipoFilter está activado
    if (showTipoFilter && tipoFilter !== 'todos') {
      filtered = filtered.filter(inscripcion => inscripcion.tipoInscripcion === tipoFilter)
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((inscripcion) => {
        return (
          inscripcion.nombreJugador.toLowerCase().includes(query) ||
          inscripcion.apellidos.toLowerCase().includes(query) ||
          inscripcion.dni.toLowerCase().includes(query) ||
          inscripcion.nombreTutor.toLowerCase().includes(query) ||
          inscripcion.telefono1.toLowerCase().includes(query) ||
          (inscripcion.telefono2 && inscripcion.telefono2.toLowerCase().includes(query)) ||
          inscripcion.email.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [inscripciones, searchQuery, tipoFilter, showTipoFilter])

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Inscripciones</CardTitle>
              <CardDescription>
                Gestiona todas las inscripciones del Campus de Navidad 2025
              </CardDescription>
            </div>
            {Array.isArray(inscripciones) && filteredInscripciones.length !== inscripciones.length && (
              <Badge variant="secondary" className="ml-4">
                {filteredInscripciones.length} de {inscripciones.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, DNI, tutor, teléfono o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showTipoFilter && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    {tiposInscripcion.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo === 'campus-navidad' ? 'Campus de Navidad' :
                         tipo === 'campus-verano' ? 'Campus de Verano' :
                         tipo === 'anual' ? 'Inscripción Anual' :
                         tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {showTipoFilter && (
                    <th className="text-left py-3 px-4 font-semibold text-sm">Tipo</th>
                  )}
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
                {filteredInscripciones.length === 0 ? (
                  <tr>
                    <td colSpan={showTipoFilter ? 8 : 7} className="text-center py-8 text-gray-500">
                      {!Array.isArray(inscripciones) || inscripciones.length === 0 
                        ? 'No hay inscripciones todavía'
                        : 'No se encontraron inscripciones con ese criterio de búsqueda'}
                    </td>
                  </tr>
                ) : (
                  filteredInscripciones.map((inscripcion, index) => (
                    <motion.tr
                      key={inscripcion.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50"
                    >
                      {showTipoFilter && (
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {inscripcion.tipoInscripcion === 'campus-navidad' ? 'Campus Navidad' :
                             inscripcion.tipoInscripcion === 'campus-verano' ? 'Campus Verano' :
                             inscripcion.tipoInscripcion === 'anual' ? 'Anual' :
                             inscripcion.tipoInscripcion}
                          </Badge>
                        </td>
                      )}
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

