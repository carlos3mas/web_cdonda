'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { StatsCards } from '@/components/admin/StatsCards'
import { InscripcionesTable } from '@/components/admin/InscripcionesTable'
import { DashboardStats, Inscripcion } from '@/types'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tiposInscripcion = [
  { value: 'todos', label: 'Todas', icon: '📊' },
  { value: 'campus-navidad', label: 'Campus Navidad', icon: '🎄' },
  { value: 'campus-pascua', label: 'Campus Pascua', icon: '🐣' },
  { value: 'campus-verano', label: 'Campus Verano', icon: '☀️' },
  { value: 'anual', label: 'Inscripción Anual', icon: '📅' },
]

const ADMIN_PAGE_SIZE = 200
const FETCH_TIMEOUT_MS = 45_000

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(input, {
      ...init,
      credentials: 'include',
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

export default function AdminDashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('todos')
  const [stats, setStats] = useState<Record<string, DashboardStats>>({})
  const [inscripciones, setInscripciones] = useState<Record<string, Inscripcion[]>>({})
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const loadedTabsRef = useRef<Set<string>>(new Set())
  const initialLoadDoneRef = useRef(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  const loadDataForTab = useCallback(async (tipo: string, opts?: { force?: boolean }) => {
    if (!opts?.force && loadedTabsRef.current.has(tipo)) {
      return
    }

    try {
      const [statsRes, inscripcionesRes] = await Promise.all([
        fetchWithTimeout(`/api/inscripciones/stats?tipo=${tipo}`),
        fetchWithTimeout(`/api/inscripciones?tipo=${tipo}&limit=${ADMIN_PAGE_SIZE}`),
      ])

      if (!statsRes.ok || !inscripcionesRes.ok) {
        throw new Error(
          statsRes.status === 401 || inscripcionesRes.status === 401
            ? 'Sesión expirada. Vuelve a iniciar sesión.'
            : 'No se pudieron cargar las inscripciones.'
        )
      }

      const statsData = (await statsRes.json()) as DashboardStats
      const inscripcionesData = (await inscripcionesRes.json()) as Inscripcion[]

      if (!Array.isArray(inscripcionesData)) {
        throw new Error('Respuesta inválida del servidor.')
      }

      loadedTabsRef.current.add(tipo)
      setStats((prev) => ({ ...prev, [tipo]: statsData }))
      setInscripciones((prev) => ({ ...prev, [tipo]: inscripcionesData }))
      setLoadError(null)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setLoadError(
        error instanceof Error && error.name === 'AbortError'
          ? 'La carga tardó demasiado. Prueba a recargar la página.'
          : error instanceof Error
            ? error.message
            : 'Error al cargar los datos.'
      )
    }
  }, [])

  useEffect(() => {
    if (status !== 'authenticated' || initialLoadDoneRef.current) return

    initialLoadDoneRef.current = true
    let cancelled = false

    const loadInitial = async () => {
      setIsDataLoading(true)
      setLoadError(null)

      try {
        const tipos = ['todos', 'campus-navidad', 'campus-pascua', 'campus-verano', 'anual']
        const statsResults = await Promise.allSettled(
          tipos.map(async (tipo) => {
            const res = await fetchWithTimeout(`/api/inscripciones/stats?tipo=${tipo}`)
            if (!res.ok) throw new Error(`stats ${tipo}`)
            return { tipo, stats: (await res.json()) as DashboardStats }
          })
        )

        if (!cancelled) {
          const statsMap: Record<string, DashboardStats> = {}
          statsResults.forEach((result) => {
            if (result.status === 'fulfilled') {
              statsMap[result.value.tipo] = result.value.stats
            }
          })
          setStats(statsMap)
        }

        await loadDataForTab('todos', { force: true })
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error)
        if (!cancelled) {
          setLoadError('No se pudieron cargar los datos del panel.')
        }
      } finally {
        if (!cancelled) setIsDataLoading(false)
      }
    }

    loadInitial()
    return () => {
      cancelled = true
    }
  }, [status, loadDataForTab])

  useEffect(() => {
    if (status !== 'authenticated' || !initialLoadDoneRef.current) return
    if (activeTab === 'todos') return
    loadDataForTab(activeTab)
  }, [activeTab, status, loadDataForTab])

  const handleUpdate = () => {
    loadedTabsRef.current.delete(activeTab)
    loadedTabsRef.current.delete('todos')
    loadDataForTab(activeTab, { force: true })
    if (activeTab !== 'todos') {
      loadDataForTab('todos', { force: true })
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>

          {loadError && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loadError}</span>
            </div>
          )}

          {isDataLoading && (
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              <span>Cargando inscripciones…</span>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {stats[tipo.value] && (
                  <StatsCards
                    stats={stats[tipo.value]}
                    tipoLabel={tipo.value === 'todos' ? undefined : tipo.label}
                  />
                )}

                <InscripcionesTable
                  inscripciones={inscripciones[tipo.value] || []}
                  onUpdate={handleUpdate}
                  showTipoFilter={tipo.value === 'todos'}
                  tipoInscripcion={tipo.value}
                />
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
