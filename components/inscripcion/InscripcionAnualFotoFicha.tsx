'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Camera, CheckCircle2, Loader2, Search, UserRound } from 'lucide-react'
import { prepareCarnetPhotoForUpload } from '@/lib/client-image-compress'

type FotoFichaSearchResult = {
  id: string
  nombreJugador: string
  apellidos: string
  fechaNacimiento: string
  categoria: string | null
  sexo: string | null
  nombreArchivoFotoFicha: string | null
  tieneFotoFicha: boolean
}

export function InscripcionAnualFotoFicha() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FotoFichaSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selected = useMemo(
    () => results.find((r) => r.id === selectedId) || null,
    [results, selectedId]
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileChange = async (nextFile: File | null) => {
    setError('')
    setMessage('')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (!nextFile) {
      setFile(null)
      return
    }
    if (!nextFile.type.startsWith('image/')) {
      setError('Selecciona una imagen (JPG, PNG o WEBP).')
      setFile(null)
      return
    }

    try {
      const prepared = await prepareCarnetPhotoForUpload(nextFile)
      setFile(prepared)
      setPreviewUrl(URL.createObjectURL(prepared))
    } catch {
      setFile(nextFile)
      setPreviewUrl(URL.createObjectURL(nextFile))
    }
  }

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
      const res = await fetch(`/api/inscripciones/foto-ficha?q=${encodeURIComponent(query.trim())}`)
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
    if (!file) return setError('Adjunta la foto tipo carnet del jugador.')

    setSending(true)
    try {
      const fd = new FormData()
      fd.append('inscripcionId', selectedId)
      fd.append('fotoFicha', file)

      const res = await fetch('/api/inscripciones/foto-ficha', { method: 'POST', body: fd })
      let data: { error?: string; success?: boolean; reemplazado?: boolean } = {}
      try {
        data = await res.json()
      } catch {
        throw new Error(
          res.status === 429
            ? 'Demasiados intentos seguidos. Espera un minuto e inténtalo de nuevo.'
            : 'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo otra vez.'
        )
      }
      if (!res.ok) throw new Error(data.error || 'No se pudo subir la foto')

      setMessage(
        data.reemplazado
          ? 'Foto de ficha actualizada correctamente. La imagen anterior ha sido sustituida.'
          : 'Foto de ficha guardada correctamente.'
      )
      setUploadSuccess(true)
      setFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
      await handleSearch()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al subir la foto')
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
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  if (uploadSuccess) {
    return (
      <Card className="border border-emerald-100">
        <CardContent className="p-6 sm:p-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-700">¡Foto de ficha enviada!</h2>
          <p className="text-sm text-gray-600 mt-2">
            La imagen se ha vinculado a la ficha del jugador en el panel de administración.
          </p>
          <div className="mt-5">
            <Button type="button" onClick={resetAfterSuccess} className="bg-blue-600 hover:bg-blue-700">
              Subir otra foto
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-violet-100">
      <CardContent className="p-4 sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-violet-700 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Añadir o actualizar foto de ficha
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Busca al jugador ya inscrito y sube una foto tipo carnet. Si ya existía una imagen,
            la nueva la sustituye automáticamente.
          </p>
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden />
            <div className="space-y-1 text-sm text-amber-900">
              <p className="font-semibold">Requisitos de la foto tipo carnet</p>
              <ul className="list-disc pl-4 space-y-0.5 leading-relaxed">
                <li>Fondo blanco liso, sin sombras ni objetos detrás.</li>
                <li>Rostro centrado, mirando al frente, sin gorra ni gafas de sol.</li>
                <li>Formato vertical (proporción carnet). La web ajustará el recorte automáticamente.</li>
                <li>Buena iluminación y nitidez; evita fotos borrosas o recortadas del pecho hacia abajo.</li>
              </ul>
            </div>
          </div>
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
                  selectedId === r.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">
                  {r.nombreJugador} {r.apellidos}
                </p>
                <p className="text-xs text-gray-500">
                  Categoría: {r.categoria || '—'} ·{' '}
                  {r.tieneFotoFicha ? 'Ya tiene foto de ficha' : 'Sin foto de ficha'}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        {selected ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`px-2 py-1 rounded ${
                  selected.tieneFotoFicha
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selected.tieneFotoFicha ? 'Foto actual registrada' : 'Pendiente de foto de ficha'}
              </span>
              {selected.nombreArchivoFotoFicha ? (
                <span className="text-gray-500">Archivo: {selected.nombreArchivoFotoFicha}</span>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
              <div>
                <Label htmlFor="fotoFicha" className="text-sm">
                  Foto tipo carnet (imagen)
                </Label>
                <Input
                  id="fotoFicha"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                  onChange={(e) => void handleFileChange(e.target.files?.[0] || null)}
                  className="mt-1"
                />
                {file ? (
                  <p className="mt-1 text-xs text-emerald-700">Archivo preparado: {file.name}</p>
                ) : selected.tieneFotoFicha ? (
                  <p className="mt-1 text-xs text-gray-500">
                    Si subes una nueva imagen, sustituirá a la actual.
                  </p>
                ) : null}
              </div>

              <div className="mx-auto sm:mx-0">
                <div className="w-[120px] h-[160px] rounded-lg border-2 border-dashed border-violet-300 bg-white overflow-hidden flex items-center justify-center shadow-sm">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Vista previa foto carnet"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-2 text-violet-400">
                      <UserRound className="h-8 w-8 mx-auto mb-1" />
                      <p className="text-[10px] leading-tight">Vista previa carnet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={sending}
              className="bg-violet-700 hover:bg-violet-800"
            >
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {selected.tieneFotoFicha ? 'Actualizar foto de ficha' : 'Guardar foto de ficha'}
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
