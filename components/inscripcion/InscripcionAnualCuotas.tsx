'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Loader2, Search } from 'lucide-react'

type AnnualSearchResult = {
  id: string
  nombreJugador: string
  apellidos: string
  fechaNacimiento: string
  categoria: string | null
  modalidadPago: string | null
  cuota1Pagada: boolean | null
  cuota2Pagada: boolean | null
}

export function InscripcionAnualCuotas() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AnnualSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [cuota, setCuota] = useState<'2'>('2')
  const [file, setFile] = useState<File | null>(null)
  const [sending, setSending] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const selected = useMemo(() => results.find((r) => r.id === selectedId) || null, [results, selectedId])

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
      const fd = new FormData()
      fd.append('inscripcionId', selectedId)
      fd.append('cuota', cuota)
      fd.append('justificantePago', file)

      const res = await fetch('/api/inscripciones/cuotas', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo subir el justificante')

      setMessage(`Justificante de cuota ${cuota} subido correctamente.`)
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
            El justificante de la cuota 2 se ha guardado correctamente y la cuota ya aparece marcada en el panel de administración.
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
          <h2 className="text-lg sm:text-xl font-bold text-blue-700">Añadir justificantes de cuotas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Busca al jugador anual ya inscrito y sube el justificante de la cuota 2 (solo modalidad fraccionada).
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                  Nacimiento: {new Date(r.fechaNacimiento).toLocaleDateString()} · Categoría: {r.categoria || '—'}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        {selected ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${selected.cuota1Pagada ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>Cuota 1</span>
              <span className={`px-2 py-1 rounded ${selected.cuota2Pagada ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>Cuota 2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cuota" className="text-sm">Cuota a registrar</Label>
                <select
                  id="cuota"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={cuota}
                  onChange={(e) => setCuota(e.target.value as '2')}
                  disabled={selected.modalidadPago === 'unico' || selected.modalidadPago === 'anual'}
                >
                  <option value="2">Cuota 2</option>
                </select>
              </div>
              <div>
                <Label htmlFor="justiCuota" className="text-sm">Justificante (PDF o imagen)</Label>
                <Input
                  id="justiCuota"
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <p className="mt-1 text-xs text-emerald-700">Archivo seleccionado: {file.name}</p>
                ) : null}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={sending || selected.modalidadPago === 'unico' || selected.modalidadPago === 'anual'}
              className="bg-red-600 hover:bg-red-700"
            >
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Guardar justificante cuota
            </Button>
            {(selected.modalidadPago === 'unico' || selected.modalidadPago === 'anual') ? (
              <p className="text-xs text-amber-700">
                Este jugador tiene pago único y no necesita cuota adicional.
              </p>
            ) : null}
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
