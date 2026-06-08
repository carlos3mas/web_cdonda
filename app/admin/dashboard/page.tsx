'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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

const ADMIN_PAGE_SIZE = 50

type DashboardPayload = {
  stats: DashboardStats
  inscripciones: Inscripcion[]
}

export default function AdminDashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('todos')
  const [stats, setStats] = useState<Record<string, DashboardStats>>({})
  const [inscripciones, setInscripciones] = useState<Record<string, Inscripcion[]>>({})
  const [loadingTab, setLoadingTab] = useState<string | null>('todos')
  const [loadError, setLoadError] = useState<string | null>(null)
  const loadedTabsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  const loadDataForTab = useCallback(async (tipo: string, opts?: { force?: boolean }) => {
    if (!opts?.force && loadedTabsRef.current.has(tipo)) {
      return
    }

    setLoadingTab(tipo)
    setLoadError(null)

    try {
      const res = await fetch(
        `/api/inscripciones/dashboard?tipo=${tipo}&limit=${ADMIN_PAGE_SIZE}`,
        { credentials: 'include' }
      )

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? 'Sesión expirada. Vuelve a iniciar sesión.'
            : `Error del servidor (${res.status}).`
        )
      }

      const data = (await res.json()) as DashboardPayload

      if (!data.stats || !Array.isArray(data.inscripciones)) {
        throw new Error('Respuesta inválida del servidor.')
      }

      loadedTabsRef.current.add(tipo)
      setStats((prev) => ({ ...prev, [tipo]: data.stats }))
      setInscripciones((prev) => ({ ...prev, [tipo]: data.inscripciones }))
    } catch (error) {
      console.error('Error al cargar datos:', error)
      setLoadError(
        error instanceof Error ? error.message : 'Error al cargar los datos.'
      )
    } finally {
      setLoadingTab((current) => (current === tipo ? null : current))
    }
  }, [])

  useEffect(() => {
    if (status !== 'authenticated') return
    loadDataForTab('todos')
  }, [status, loadDataForTab])

  useEffect(() => {
    if (status !== 'authenticated') return
    if (activeTab === 'todos') return
    loadDataForTab(activeTab)
  }, [activeTab, status, loadDataForTab])

  const handleUpdate = () => {
    loadedTabsRef.current.delete(activeTab)
    if (activeTab !== 'todos') {
      loadedTabsRef.current.delete('todos')
    }
    loadDataForTab(activeTab, { force: true })
    if (activeTab !== 'todos') {
      loadDataForTab('todos', { force: true })
    }
  }

  const handleRetry = () => {
    loadedTabsRef.current.delete(activeTab)
    loadDataForTab(activeTab, { force: true })
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  const isActiveTabLoading = loadingTab === activeTab

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
                {isActiveTabLoading && activeTab === tipo.value && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                    <span>Cargando inscripciones…</span>
                  </div>
                )}

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
