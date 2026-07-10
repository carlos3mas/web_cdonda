'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { StatsCards } from '@/components/admin/StatsCards'
import { InscripcionesTable, type AdminTableFilters } from '@/components/admin/InscripcionesTable'
import { DashboardStats, Inscripcion } from '@/types'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

const tiposInscripcion = [
  { value: 'todos', label: 'Todas', icon: '📊' },
  { value: 'campus-navidad', label: 'Campus Navidad', icon: '🎄' },
  { value: 'campus-pascua', label: 'Campus Pascua', icon: '🐣' },
  { value: 'campus-verano', label: 'Campus Verano', icon: '☀️' },
  { value: 'anual', label: 'Inscripción Anual', icon: '📅' },
]

const PAGE_SIZE = 50

const DEFAULT_TABLE_FILTERS: AdminTableFilters = {
  busqueda: '',
  estado: 'todos',
  sexo: 'todos',
}

type TabPagination = {
  offset: number
  total: number
  hasMore: boolean
}

type TabPayload = {
  stats: DashboardStats
  inscripciones: Inscripcion[]
  pagination: TabPagination
}

type TabCacheEntry = TabPayload & { cacheKey: string }

function cacheKeyFor(tipo: string, offset: number, filters: AdminTableFilters) {
  return `${tipo}:${offset}:${filters.estado}:${filters.sexo}:${filters.busqueda}`
}

function buildDashboardQuery(
  tipo: string,
  offset: number,
  filters: AdminTableFilters
): string {
  const params = new URLSearchParams({
    tipo,
    limit: String(PAGE_SIZE),
    offset: String(offset),
  })
  if (filters.estado !== 'todos') params.set('estado', filters.estado)
  if (filters.busqueda.trim()) params.set('busqueda', filters.busqueda.trim())
  if (tipo === 'anual' && filters.sexo !== 'todos') params.set('sexo', filters.sexo)
  return params.toString()
}

export default function AdminDashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('anual')
  const [tabData, setTabData] = useState<Record<string, TabCacheEntry>>({})
  const [pageByTab, setPageByTab] = useState<Record<string, number>>({ anual: 0 })
  const [filtersByTab, setFiltersByTab] = useState<Record<string, AdminTableFilters>>({})
  const [loadingTab, setLoadingTab] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const fetchAbortRef = useRef<AbortController | null>(null)
  const loadedKeysRef = useRef<Set<string>>(new Set())
  const pageByTabRef = useRef(pageByTab)
  const filtersByTabRef = useRef(filtersByTab)
  pageByTabRef.current = pageByTab
  filtersByTabRef.current = filtersByTab

  const getTabFilters = useCallback(
    (tipo: string): AdminTableFilters => filtersByTab[tipo] ?? DEFAULT_TABLE_FILTERS,
    [filtersByTab]
  )

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  const loadTab = useCallback(
    async (tipo: string, opts?: { offset?: number; force?: boolean; filters?: AdminTableFilters }) => {
      const filters = opts?.filters ?? filtersByTabRef.current[tipo] ?? DEFAULT_TABLE_FILTERS
      const offset = opts?.offset ?? pageByTabRef.current[tipo] ?? 0
      const key = cacheKeyFor(tipo, offset, filters)

      if (!opts?.force && loadedKeysRef.current.has(key)) {
        return
      }

      fetchAbortRef.current?.abort()
      const controller = new AbortController()
      fetchAbortRef.current = controller

      setLoadingTab(tipo)
      setLoadError(null)

      try {
        const res = await fetch(
          `/api/inscripciones/dashboard?${buildDashboardQuery(tipo, offset, filters)}`,
          { credentials: 'include', signal: controller.signal }
        )

        if (!res.ok) {
          throw new Error(
            res.status === 401
              ? 'Sesión expirada. Vuelve a iniciar sesión.'
              : `Error del servidor (${res.status}).`
          )
        }

        const data = (await res.json()) as TabPayload

        if (!data.stats || !Array.isArray(data.inscripciones) || !data.pagination) {
          throw new Error('Respuesta inválida del servidor.')
        }

        loadedKeysRef.current.add(key)
        setTabData((prev) => ({
          ...prev,
          [tipo]: { ...data, cacheKey: key },
        }))
        setPageByTab((prev) => ({ ...prev, [tipo]: offset }))
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('Error al cargar datos:', error)
        setLoadError(
          error instanceof Error ? error.message : 'Error al cargar los datos.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTab((current) => (current === tipo ? null : current))
        }
      }
    },
    []
  )

  useEffect(() => {
    if (status !== 'authenticated') return
    const offset = pageByTabRef.current[activeTab] ?? 0
    loadTab(activeTab, { offset })
  }, [status, activeTab, loadTab])

  useEffect(() => {
    return () => fetchAbortRef.current?.abort()
  }, [])

  const handleTabChange = (tipo: string) => {
    setActiveTab(tipo)
    setLoadError(null)
  }

  const handlePageChange = (tipo: string, page: number) => {
    const offset = page * PAGE_SIZE
    const filters = getTabFilters(tipo)
    loadedKeysRef.current.delete(cacheKeyFor(tipo, offset, filters))
    loadTab(tipo, { offset, force: true, filters })
  }

  const handleFiltersChange = (tipo: string, filters: AdminTableFilters) => {
    setFiltersByTab((prev) => ({ ...prev, [tipo]: filters }))
    setPageByTab((prev) => ({ ...prev, [tipo]: 0 }))
    loadedKeysRef.current.clear()
    loadTab(tipo, { offset: 0, force: true, filters })
  }

  const handleUpdate = () => {
    const offset = pageByTab[activeTab] ?? 0
    const filters = getTabFilters(activeTab)
    loadedKeysRef.current.delete(cacheKeyFor(activeTab, offset, filters))
    loadTab(activeTab, { offset, force: true, filters })
  }

  const handleRetry = () => {
    const offset = pageByTab[activeTab] ?? 0
    const filters = getTabFilters(activeTab)
    loadedKeysRef.current.delete(cacheKeyFor(activeTab, offset, filters))
    loadTab(activeTab, { offset, force: true, filters })
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  const activeData = tabData[activeTab]
  const activeOffset = pageByTab[activeTab] ?? 0
  const activePage = Math.floor(activeOffset / PAGE_SIZE)
  const isLoading = loadingTab === activeTab

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>

        {loadError && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{loadError}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Reintentar
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
            {tiposInscripcion.map((tipo) => (
              <TabsTrigger
                key={tipo.value}
                value={tipo.value}
                className="flex items-center gap-2"
              >
                <span>{tipo.icon}</span>
                <span className="hidden sm:inline">{tipo.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tiposInscripcion.map((tipo) => (
            <TabsContent key={tipo.value} value={tipo.value} className="space-y-6">
              {isLoading && activeTab === tipo.value && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  <span>Cargando inscripciones…</span>
                </div>
              )}

              {activeTab === tipo.value && activeData?.stats && (
                <>
                  <StatsCards
                    stats={activeData.stats}
                    tipoLabel={tipo.value === 'todos' ? undefined : tipo.label}
                  />

                  <InscripcionesTable
                    inscripciones={activeData.inscripciones}
                    onUpdate={handleUpdate}
                    showTipoFilter={tipo.value === 'todos'}
                    tipoInscripcion={tipo.value}
                    totalCount={activeData.pagination.total}
                    page={activePage}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => handlePageChange(tipo.value, page)}
                    isLoading={isLoading}
                    filters={getTabFilters(tipo.value)}
                    onFiltersChange={(filters) => handleFiltersChange(tipo.value, filters)}
                    unfilteredTotal={activeData.stats.totalInscripciones}
                  />
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
