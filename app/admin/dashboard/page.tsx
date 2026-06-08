'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { StatsCards } from '@/components/admin/StatsCards'
import { InscripcionesTable } from '@/components/admin/InscripcionesTable'
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

function cacheKeyFor(tipo: string, offset: number) {
  return `${tipo}:${offset}`
}

export default function AdminDashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('anual')
  const [tabData, setTabData] = useState<Record<string, TabCacheEntry>>({})
  const [pageByTab, setPageByTab] = useState<Record<string, number>>({ anual: 0 })
  const [loadingTab, setLoadingTab] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const fetchAbortRef = useRef<AbortController | null>(null)
  const loadedKeysRef = useRef<Set<string>>(new Set())
  const pageByTabRef = useRef(pageByTab)
  pageByTabRef.current = pageByTab

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  const loadTab = useCallback(
    async (tipo: string, opts?: { offset?: number; force?: boolean }) => {
      const offset = opts?.offset ?? pageByTabRef.current[tipo] ?? 0
      const key = cacheKeyFor(tipo, offset)

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
          `/api/inscripciones/dashboard?tipo=${tipo}&limit=${PAGE_SIZE}&offset=${offset}`,
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
    loadedKeysRef.current.delete(cacheKeyFor(tipo, offset))
    loadTab(tipo, { offset, force: true })
  }

  const handleUpdate = () => {
    const offset = pageByTab[activeTab] ?? 0
    loadedKeysRef.current.delete(cacheKeyFor(activeTab, offset))
    loadTab(activeTab, { offset, force: true })
  }

  const handleRetry = () => {
    const offset = pageByTab[activeTab] ?? 0
    loadedKeysRef.current.delete(cacheKeyFor(activeTab, offset))
    loadTab(activeTab, { offset, force: true })
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
