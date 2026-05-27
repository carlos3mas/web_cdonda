'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { StatsCards } from '@/components/admin/StatsCards'
import { InscripcionesTable } from '@/components/admin/InscripcionesTable'
import { DashboardStats, Inscripcion } from '@/types'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Tipos de inscripción disponibles
const tiposInscripcion = [
  { value: 'todos', label: 'Todas', icon: '📊' },
  { value: 'campus-navidad', label: 'Campus Navidad', icon: '🎄' },
  { value: 'campus-pascua', label: 'Campus Pascua', icon: '🐣' },
  { value: 'campus-verano', label: 'Campus Verano', icon: '☀️' },
  { value: 'anual', label: 'Inscripción Anual', icon: '📅' }
]

const ADMIN_PAGE_SIZE = 200

export default function AdminDashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('todos')
  const [stats, setStats] = useState<Record<string, DashboardStats>>({})
  const [inscripciones, setInscripciones] = useState<Record<string, Inscripcion[]>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    let cancelled = false

    const loadInitial = async () => {
      try {
        setIsLoading(true)

        // 1) Stats son ligeras: prefetchar todos los tipos (solo counts).
        const tipos = ['todos', 'campus-navidad', 'campus-pascua', 'campus-verano', 'anual']
        const statsResults = await Promise.all(
          tipos.map(async (tipo) => {
            const res = await fetch(`/api/inscripciones/stats?tipo=${tipo}`)
            return { tipo, stats: (await res.json()) as DashboardStats }
          })
        )

        if (!cancelled) {
          const statsMap: Record<string, DashboardStats> = {}
          statsResults.forEach(({ tipo, stats }) => {
            statsMap[tipo] = stats
          })
          setStats(statsMap)
        }

        // 2) Listado: cargar SOLO el tab activo, limitado.
        await loadDataForTab(activeTab, { force: true })
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadInitial()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  useEffect(() => {
    if (status === 'authenticated' && activeTab) {
      loadDataForTab(activeTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, status])

  const loadDataForTab = async (tipo: string, opts?: { force?: boolean }) => {
    try {
      if (!opts?.force && inscripciones[tipo]?.length) {
        return
      }
      const [statsRes, inscripcionesRes] = await Promise.all([
        fetch(`/api/inscripciones/stats?tipo=${tipo}`),
        fetch(`/api/inscripciones?tipo=${tipo}&limit=${ADMIN_PAGE_SIZE}`)
      ])

      const statsData = await statsRes.json()
      const inscripcionesData = await inscripcionesRes.json()

      setStats(prev => ({ ...prev, [tipo]: statsData }))
      setInscripciones(prev => ({ ...prev, [tipo]: inscripcionesData }))
    } catch (error) {
      console.error('Error al cargar datos:', error)
    }
  }

  const handleUpdate = () => {
    loadDataForTab(activeTab, { force: true })
    // También actualizar el tab "todos" para mantener consistencia
    loadDataForTab('todos', { force: true })
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
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

