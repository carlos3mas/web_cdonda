'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Inscripcion } from '@/types'
import { formatDate } from '@/lib/utils'
import { CheckCircle, ChevronLeft, ChevronRight, Download, Eye, FileDown, Filter, Loader2, Search, Trash2, X, XCircle } from 'lucide-react'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { InscripcionDialog } from './InscripcionDialog'

export type AdminTableFilters = {
  busqueda: string
  estado: 'todos' | 'pagados' | 'pendientes'
  sexo: 'todos' | 'M' | 'F'
}

interface InscripcionesTableProps {
  inscripciones: Inscripcion[]
  onUpdate: () => void
  showTipoFilter?: boolean
  tipoInscripcion?: string
  totalCount?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  filters: AdminTableFilters
  onFiltersChange: (filters: AdminTableFilters) => void
  unfilteredTotal?: number
}

export function InscripcionesTable({
  inscripciones,
  onUpdate,
  showTipoFilter = false,
  tipoInscripcion = 'todos',
  totalCount,
  page = 0,
  pageSize = 50,
  onPageChange,
  isLoading = false,
  filters,
  onFiltersChange,
  unfilteredTotal,
}: InscripcionesTableProps) {
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null)
  const [deleteInscripcionId, setDeleteInscripcionId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.busqueda)
  const [downloadingListaPdf, setDownloadingListaPdf] = useState(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  useEffect(() => {
    setSearchInput(filters.busqueda)
  }, [filters.busqueda])

  const hasActiveFilters = useMemo(
    () =>
      filters.busqueda.trim() !== '' ||
      filters.estado !== 'todos' ||
      (tipoInscripcion === 'anual' && filters.sexo !== 'todos'),
    [filters, tipoInscripcion]
  )

  const updateFilters = (partial: Partial<AdminTableFilters>) => {
    onFiltersChange({ ...filtersRef.current, ...partial })
  }

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value)
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      updateFilters({ busqueda: value })
    }, 400)
  }

  const flushSearch = () => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = null
    }
    if (searchInput !== filtersRef.current.busqueda) {
      updateFilters({ busqueda: searchInput })
    }
  }

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [])

  const filteredInscripciones = inscripciones

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

  const handleToggleCuota = async (inscripcion: Inscripcion, cuota: 1 | 2) => {
    const next1 = cuota === 1 ? !inscripcion.cuota1Pagada : !!inscripcion.cuota1Pagada
    const next2 = cuota === 2 ? !inscripcion.cuota2Pagada : !!inscripcion.cuota2Pagada
    const next3 = !!inscripcion.cuota3Pagada
    const modalidad = inscripcion.modalidadPago
    const annualPaid = modalidad === 'unico' ? next1 : next1 && next2

    try {
      await fetch(`/api/inscripciones/${inscripcion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuota1Pagada: next1,
          cuota2Pagada: next2,
          cuota3Pagada: next3,
          pagada: annualPaid,
        }),
      })
      onUpdate()
    } catch (error) {
      console.error('Error al actualizar cuota:', error)
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

  const handleViewDetails = async (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion)
    setDialogOpen(true)
    setDetailLoading(true)

    try {
      const response = await fetch(`/api/inscripciones/${inscripcion.id}`, {
        credentials: 'include',
      })
      if (response.ok) {
        setSelectedInscripcion((await response.json()) as Inscripcion)
      }
    } catch (error) {
      console.error('Error al cargar detalle:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDeleteClick = (inscripcionId: string) => {
    setDeleteInscripcionId(inscripcionId)
    setDeleteDialogOpen(true)
  }

  const totalPages = totalCount != null ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1
  const showPagination = totalCount != null && totalCount > pageSize && onPageChange

  const handleDownloadListaPDF = async () => {
    if (downloadingListaPdf) return

    setDownloadingListaPdf(true)
    try {
      const params = new URLSearchParams()
      params.append('tipo', tipoInscripcion)

      if (filters.estado !== 'todos') {
        params.append('estado', filters.estado)
      }

      if (filters.busqueda.trim()) {
        params.append('busqueda', filters.busqueda.trim())
      }

      if (tipoInscripcion === 'anual' && filters.sexo !== 'todos') {
        params.append('sexo', filters.sexo)
      }

      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), 120_000)

      const response = await fetch(`/api/inscripciones/lista-pdf?${params.toString()}`, {
        credentials: 'include',
        signal: controller.signal,
      })

      window.clearTimeout(timeoutId)

      if (!response.ok) {
        let message = 'Error al generar el PDF'
        try {
          const body = (await response.json()) as { error?: string }
          if (body.error) message = body.error
        } catch {
          /* respuesta no JSON */
        }
        throw new Error(message)
      }

      const blob = await response.blob()
      const urlBlob = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = urlBlob

      let tipoLabel = tipoInscripcion !== 'todos' ? tipoInscripcion.replace('-', '_') : 'todas'
      if (filters.estado !== 'todos') {
        tipoLabel += `_${filters.estado}`
      }
      a.download = `lista_inscripciones_${tipoLabel}_${new Date().toISOString().split('T')[0]}.pdf`

      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(urlBlob)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error al descargar PDF de lista:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        alert('La descarga tardó demasiado. Inténtalo de nuevo.')
      } else {
        alert(error instanceof Error ? error.message : 'Error al descargar la lista de inscripciones')
      }
    } finally {
      setDownloadingListaPdf(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Inscripciones</CardTitle>
              <CardDescription>
                {showPagination
                  ? hasActiveFilters
                    ? `Filtros activos en todas las páginas. ${totalCount ?? 0} resultados.`
                    : `Mostrando ${pageSize} por página. ${totalCount ?? 0} inscripciones.`
                  : 'Gestiona las inscripciones del club'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {hasActiveFilters && totalCount != null && unfilteredTotal != null && totalCount !== unfilteredTotal && (
                <Badge variant="secondary">
                  {totalCount} de {unfilteredTotal}
                </Badge>
              )}
              <Button
                onClick={handleDownloadListaPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={downloadingListaPdf || isLoading}
              >
                {downloadingListaPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {downloadingListaPdf ? 'Generando PDF…' : 'Descargar Lista PDF'}
                </span>
                <span className="sm:hidden">{downloadingListaPdf ? '…' : 'PDF'}</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, DNI, tutor, email, teléfono o año (ej. 2015)..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    flushSearch()
                  }
                }}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <button
                  onClick={() => handleSearchInputChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select
                  value={filters.estado}
                  onValueChange={(v) => updateFilters({ estado: v as AdminTableFilters['estado'] })}
                >
                  <SelectTrigger className="w-[160px] sm:w-[180px]">
                    <SelectValue placeholder="Estado de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="pagados">Pagados</SelectItem>
                    <SelectItem value="pendientes">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {tipoInscripcion === 'anual' && (
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select
                    value={filters.sexo}
                    onValueChange={(v) => updateFilters({ sexo: v as AdminTableFilters['sexo'] })}
                  >
                    <SelectTrigger className="w-[180px] sm:w-[200px]">
                      <SelectValue placeholder="Filtrar por sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los sexos</SelectItem>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Vista de Tabla para Escritorio */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {showTipoFilter && (
                    <th className="text-left py-3 px-4 font-semibold text-sm">Tipo</th>
                  )}
                  <th className="text-left py-3 px-4 font-semibold text-sm">Jugador</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Fecha Nac.</th>
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
                        ? hasActiveFilters
                          ? 'No hay inscripciones con estos filtros'
                          : 'No hay inscripciones todavía'
                        : 'No hay inscripciones en esta página'}
                    </td>
                  </tr>
                ) : (
                  filteredInscripciones.map((inscripcion) => (
                    <tr
                      key={inscripcion.id}
                      className="border-b hover:bg-gray-50"
                    >
                      {showTipoFilter && (
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {inscripcion.tipoInscripcion === 'campus-navidad' ? 'Campus Navidad' :
                             inscripcion.tipoInscripcion === 'campus-pascua' ? 'Campus Pascua' :
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
                      <td className="py-3 px-4 text-sm">{formatDate(inscripcion.fechaNacimiento)}</td>
                      <td className="py-3 px-4 text-sm">
                        {inscripcion.tipoInscripcion === 'anual'
                          ? (inscripcion.dniJugador || '—')
                          : inscripcion.dni}
                      </td>
                      <td className="py-3 px-4 text-sm">{inscripcion.nombreTutor}</td>
                      <td className="py-3 px-4 text-sm">{inscripcion.telefono1}</td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(inscripcion.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {inscripcion.tipoInscripcion === 'anual' ? (
                          <div className="flex items-center justify-center gap-1">
                            {((inscripcion.modalidadPago === 'unico' || inscripcion.modalidadPago === 'anual') ? [1] : [1, 2]).map((cuota) => {
                              const ok = cuota === 1 ? !!inscripcion.cuota1Pagada : !!inscripcion.cuota2Pagada
                              return (
                                <Badge
                                  key={cuota}
                                  variant={ok ? 'default' : 'secondary'}
                                  className="cursor-pointer text-[10px] px-2"
                                  onClick={() => handleToggleCuota(inscripcion, cuota as 1 | 2)}
                                >
                                  {(inscripcion.modalidadPago === 'unico' || inscripcion.modalidadPago === 'anual') ? 'Único' : `C${cuota}`}
                                </Badge>
                              )
                            })}
                          </div>
                        ) : (
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
                        )}
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
                          {inscripcion.nombreArchivoJustificante && (
                            <a href={`/api/justificantes/${inscripcion.id}`} target="_blank" rel="noopener noreferrer">
                              <Button
                                size="sm"
                                variant="ghost"
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Vista de Tarjetas para Móvil */}
          <div className="md:hidden space-y-4">
            {filteredInscripciones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {!Array.isArray(inscripciones) || inscripciones.length === 0
                  ? hasActiveFilters
                    ? 'No hay inscripciones con estos filtros'
                    : 'No hay inscripciones todavía'
                  : 'No hay inscripciones en esta página'}
              </div>
            ) : (
              filteredInscripciones.map((inscripcion) => (
                <div key={inscripcion.id}>
                  <div className="bg-white rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-base">{`${inscripcion.nombreJugador} ${inscripcion.apellidos}`}</p>
                        <p className="text-sm text-gray-500">Nacimiento: {formatDate(inscripcion.fechaNacimiento)}</p>
                        <p className="text-sm text-gray-500">{formatDate(inscripcion.createdAt)}</p>
                      </div>
                      {inscripcion.tipoInscripcion === 'anual' ? (
                        <div className="flex items-center gap-1">
                          {((inscripcion.modalidadPago === 'unico' || inscripcion.modalidadPago === 'anual') ? [1] : [1, 2]).map((cuota) => {
                            const ok = cuota === 1 ? !!inscripcion.cuota1Pagada : !!inscripcion.cuota2Pagada
                            return (
                              <Badge
                                key={cuota}
                                variant={ok ? 'default' : 'secondary'}
                                className="cursor-pointer text-[10px] px-2"
                                onClick={() => handleToggleCuota(inscripcion, cuota as 1 | 2)}
                              >
                                {(inscripcion.modalidadPago === 'unico' || inscripcion.modalidadPago === 'anual') ? 'Único' : `C${cuota}`}
                              </Badge>
                            )
                          })}
                        </div>
                      ) : (
                        <Badge
                          variant={inscripcion.pagada ? 'default' : 'secondary'}
                          className="cursor-pointer text-xs"
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
                      )}
                    </div>
                    {showTipoFilter && (
                        <Badge variant="outline" className="text-xs mt-2">
                            {inscripcion.tipoInscripcion === 'campus-navidad' ? 'Campus Navidad' :
                             inscripcion.tipoInscripcion === 'campus-pascua' ? 'Campus Pascua' :
                             inscripcion.tipoInscripcion === 'campus-verano' ? 'Campus Verano' :
                             inscripcion.tipoInscripcion === 'anual' ? 'Anual' :
                             inscripcion.tipoInscripcion}
                        </Badge>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-3">
                      <Button size="sm" variant="ghost" onClick={() => handleViewDetails(inscripcion)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDownloadPDF(inscripcion.id)}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar</span>
                      </Button>
                      {inscripcion.nombreArchivoJustificante && (
                        <a href={`/api/justificantes/${inscripcion.id}`} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="ghost">
                            <FileDown className="h-4 w-4" />
                            <span className="sr-only">Ver Justificante</span>
                          </Button>
                        </a>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(inscripcion.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {showPagination && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4">
              <p className="text-sm text-gray-600">
                Página {page + 1} de {totalPages}
                <span className="text-gray-400"> · {totalCount} inscripciones en total</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 0 || isLoading}
                  onClick={() => onPageChange(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1 || isLoading}
                  onClick={() => onPageChange(page + 1)}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <InscripcionDialog
        inscripcion={selectedInscripcion}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isLoading={detailLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => deleteInscripcionId && handleDelete(deleteInscripcionId)}
      />
    </>
  )
}

