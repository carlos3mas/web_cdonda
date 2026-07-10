'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TIPOS_INSCRIPCION_ANUAL } from '@/lib/anualConfig'
import type { TallasGrupoResumen, TallasResumenAnual } from '@/lib/tallas-resumen'
import { Loader2, Shirt } from 'lucide-react'

function TallasTable({
  titulo,
  descripcion,
  grupo,
}: {
  titulo: string
  descripcion: string
  grupo: TallasGrupoResumen
}) {
  const conPedido = grupo.filas.filter((f) => f.cantidad > 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{titulo}</CardTitle>
        <CardDescription>{descripcion}</CardDescription>
        <p className="text-sm font-semibold text-red-700 pt-1">Total: {grupo.total} uds.</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600">Talla</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600 w-20">Cant.</th>
              </tr>
            </thead>
            <tbody>
              {conPedido.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 px-3 text-center text-gray-500">
                    Sin tallas registradas
                  </td>
                </tr>
              ) : (
                conPedido.map((fila) => (
                  <tr key={fila.talla} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 px-3 font-medium text-gray-900">{fila.talla}</td>
                    <td className="py-2 px-3 text-right font-semibold text-gray-900">{fila.cantidad}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnualTallasResumen() {
  const [categoria, setCategoria] = useState('todos')
  const [resumen, setResumen] = useState<TallasResumenAnual | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (categoria !== 'todos') params.set('categoria', categoria)
      const res = await fetch(`/api/inscripciones/tallas-resumen?${params.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('No se pudo cargar el resumen de tallas')
      setResumen((await res.json()) as TallasResumenAnual)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar')
      setResumen(null)
    } finally {
      setLoading(false)
    }
  }, [categoria])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-5">
      <Card className="border border-red-100 bg-gradient-to-r from-red-50/80 to-white">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <Shirt className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pedido de ropa — resumen por tallas</CardTitle>
                <CardDescription>
                  Cantidades totales para encargar equipación según las inscripciones anuales.
                </CardDescription>
              </div>
            </div>
            <div className="w-full sm:w-56">
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  {TIPOS_INSCRIPCION_ANUAL.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        {resumen && !loading ? (
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{resumen.inscripciones}</span> inscripciones
              {categoria !== 'todos' ? ' en esta categoría' : ' en total'}
            </p>
          </CardContent>
        ) : null}
      </Card>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin text-red-600" />
          <span>Calculando tallas…</span>
        </div>
      ) : error ? (
        <p className="text-sm text-red-600 py-8 text-center">{error}</p>
      ) : resumen ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <TallasTable titulo="Camisetas" descripcion="Talla de camiseta" grupo={resumen.camiseta} />
          <TallasTable titulo="Pantalones" descripcion="Talla de pantalón" grupo={resumen.pantalon} />
          <TallasTable
            titulo="Calzas"
            descripcion="Talla de calzas (anual)"
            grupo={resumen.calzas}
          />
        </div>
      ) : null}
    </div>
  )
}
