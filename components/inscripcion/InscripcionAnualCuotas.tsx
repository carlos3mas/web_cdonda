'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Loader2, Search } from 'lucide-react'
import { isPagoUnico } from '@/lib/anualConfig'
import { compressImageFileForUpload } from '@/lib/client-image-compress'

type CuotaValue = '1' | '2'

type AnnualSearchResult = {
  id: string
  nombreJugador: string
  apellidos: string
  fechaNacimiento: string
  categoria: string | null
  modalidadPago: string | null
  cuota1Pagada: boolean | null
  cuota2Pagada: boolean | null
  pagada: boolean | null
  nombreArchivoJustificante: string | null
  nombreArchivoJustificanteCuota2: string | null
}

function modalidadLabel(modalidad: string | null): string {
  if (isPagoUnico(modalidad)) return 'Pago único'
  if (modalidad === 'fraccionado') return 'Pago fraccionado'
  return modalidad || '—'
}

export function InscripcionAnualCuotas() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AnnualSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cuota, setCuota] = useState<CuotaValue>('1')
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [lastUploadLabel, setLastUploadLabel] = useState('')
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const selected = useMemo(() => results.find((r) => r.id === selectedId) || null, [results, selectedId])
  const selectedEsUnico = selected ? isPagoUnico(selected.modalidadPago) : false

  useEffect(() => {
    if (!selected) return
    if (selectedEsUnico) {
      setCuota('1')
      return
    }
    setCuota(selected.cuota1Pagada ? '2' : '1')
  }, [selected, selectedEsUnico])

  const justificanteActual =
    cuota === '1'
      ? selected?.nombreArchivoJustificante
      : selected?.nombreArchivoJustificanteCuota2

  const handleSearch = async () => {
    setError('')
    setMessage('')
    setUploadSuccess(false)
    if (query.trim().length < 2) {
      setError('Escribe al menos 2 caracteres del nombre o apellidos.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/inscripciones/cuotas?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo buscar')
      setResults(data)
      setSelectedId(data[0]?.id ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al buscar')
      setResults([])
      setSelectedId(null)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    setError('')
    setMessage('')
    setUploadSuccess(false)
    if (!selectedId) return setError('Selecciona un jugador.')
    if (!file) return setError('Adjunta el justificante de pago.')

    setSending(true)
    try {
      const fileToSend = await compressImageFileForUpload(file)
      const fd = new FormData()
      fd.append('inscripcionId', selectedId)
      fd.append('cuota', cuota)
      fd.append('justificantePago', fileToSend)

      const res = await fetch('/api/inscripciones/cuotas', { method: 'POST', body: fd })
      let data: { error?: string; success?: boolean } = {}
      try {
        data = await res.json()
      } catch {
        throw new Error(
          res.status === 429
            ? 'Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.'
            : 'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo otra vez.'
        )
      }
      if (!res.ok) throw new Error(data.error || 'No se pudo subir el justificante')

      const label = selectedEsUnico
        ? 'pago único'
        : cuota === '1'
          ? 'cuota 1'
          : 'cuota 2'
      setLastUploadLabel(label)
      setMessage(
        justificanteActual
          ? `Justificante de ${label} actualizado correctamente. El archivo anterior ha sido sustituido.`
          : `Justificante de ${label} subido correctamente.`
      )
      setUploadSuccess(true)
      setFile(null)
      await handleSearch()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir justificante')
    } finally {
      setSending(false)
    }
  }

  const resetAfterSuccess = () => {
    setUploadSuccess(false)
    setMessage('')
    setError('')
    setSelectedId(null)
    setFile(null)
  }

  if (uploadSuccess) {
    return (
      <Card className="border border-emerald-100">
        <CardContent className="p-6 sm:p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-700">¡Justificante enviado!</h2>
          <p className="text-sm text-gray-600 mt-2">
            El justificante de {lastUploadLabel} se ha guardado correctamente
            {justificanteActual ? ' y ha sustituido al anterior' : ''}.
          </p>
          <div className="mt-5">
            <Button type="button" onClick={resetAfterSuccess} className="bg-blue-600 hover:bg-blue-700">
              Subir otro justificante
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-blue-100">
      <CardContent className="p-4 sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-blue-700">Añadir o actualizar justificantes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Busca al jugador ya inscrito y sube el justificante de pago. Si ya había uno (incluso provisional),
            el nuevo archivo lo sustituye automáticamente.
          </p>
          <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <strong>Pago único:</strong> puedes inscribirte sin justificante y subirlo aquí antes del 5 de agosto.
            <strong className="ml-1">Pago fraccionado:</strong> sube aquí la cuota 2 cuando la realices.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), void handleSearch())}
              placeholder="Nombre o apellidos del jugador"
              className="pl-9"
            />
          </div>
          <Button type="button" onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
          </Button>
        </div>

        {results.length > 0 ? (
          <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-gray-200 p-2">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                className={`w-full text-left rounded-md border px-3 py-2 transition ${
                  selectedId === r.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">
                  {r.nombreJugador} {r.apellidos}
                </p>
                <p className="text-xs text-gray-500">
                  {modalidadLabel(r.modalidadPago)} · Categoría: {r.categoria || '—'}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        {selected ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-800">
              Modalidad: {modalidadLabel(selected.modalidadPago)}
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              {selectedEsUnico ? (
                <span
                  className={`px-2 py-1 rounded ${
                    selected.nombreArchivoJustificante
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selected.nombreArchivoJustificante ? 'Justificante subido' : 'Pendiente de justificante'}
                </span>
              ) : (
                <>
                  <span
                    className={`px-2 py-1 rounded ${
                      selected.cuota1Pagada ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Cuota 1
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      selected.cuota2Pagada ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Cuota 2
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cuota" className="text-sm">Tipo de justificante</Label>
                {selectedEsUnico ? (
                  <p id="cuota" className="mt-1 text-sm text-gray-700 font-medium">
                    Pago único (sustituye el anterior si existe)
                  </p>
                ) : (
                  <select
                    id="cuota"
                    className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={cuota}
                    onChange={(e) => setCuota(e.target.value as CuotaValue)}
                  >
                    <option value="1">Cuota 1 (actualizar)</option>
                    <option value="2">Cuota 2</option>
                  </select>
                )}
              </div>
              <div>
                <Label htmlFor="justiCuota" className="text-sm">Justificante (PDF o imagen)</Label>
                <Input
                  id="justiCuota"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <p className="mt-1 text-xs text-emerald-700">Archivo seleccionado: {file.name}</p>
                ) : justificanteActual ? (
                  <p className="mt-1 text-xs text-gray-500">
                    Actual: {justificanteActual} — se reemplazará al guardar
                  </p>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={sending}
              className="bg-red-600 hover:bg-red-700"
            >
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {justificanteActual ? 'Actualizar justificante' : 'Guardar justificante'}
            </Button>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? (
          <p className="text-sm text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
