'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DashboardHeader } from '@/components/admin/DashboardHeader'
import { StatsCards } from '@/components/admin/StatsCards'
import { InscripcionesTable } from '@/components/admin/InscripcionesTable'
import { PlantillasManager } from '@/components/admin/PlantillasManager'
import { DashboardStats, Inscripcion } from '@/types'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Tipos de inscripción disponibles
const tiposInscripcion = [
  { value: 'todos', label: 'Todas', icon: '📊' },
  { value: 'campus-navidad', label: 'Campus Navidad', icon: '🎄' },
  { value: 'campus-verano', label: 'Campus Verano', icon: '☀️' },
  { value: 'anual', label: 'Inscripción Anual', icon: '📅' },
  { value: 'plantillas', label: 'Plantillas PDF', icon: '📄' }
]

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('todos')
  const [stats, setStats] = useState<Record<string, DashboardStats>>({})
  const [inscripciones, setInscripciones] = useState<Record<string, Inscripcion[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [mainTab, setMainTab] = useState<'inscripciones' | 'plantillas'>('inscripciones')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadAllData()
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated' && activeTab) {
      loadDataForTab(activeTab)
    }
  }, [activeTab, status])

  const loadAllData = async () => {
    try {
      // Cargar datos para todos los tipos
      const tipos = ['todos', 'campus-navidad', 'campus-verano', 'anual']
      const promises = tipos.map(async (tipo) => {
        const [statsRes, inscripcionesRes] = await Promise.all([
          fetch(`/api/inscripciones/stats?tipo=${tipo}`),
          fetch(`/api/inscripciones?tipo=${tipo}`)
        ])
        return {
          tipo,
          stats: await statsRes.json(),
          inscripciones: await inscripcionesRes.json()
        }
      })

      const results = await Promise.all(promises)
      const statsMap: Record<string, DashboardStats> = {}
      const inscripcionesMap: Record<string, Inscripcion[]> = {}

      results.forEach(({ tipo, stats, inscripciones }) => {
        statsMap[tipo] = stats
        inscripcionesMap[tipo] = inscripciones
      })

      setStats(statsMap)
      setInscripciones(inscripcionesMap)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDataForTab = async (tipo: string) => {
    try {
      const [statsRes, inscripcionesRes] = await Promise.all([
        fetch(`/api/inscripciones/stats?tipo=${tipo}`),
        fetch(`/api/inscripciones?tipo=${tipo}`)
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
    loadDataForTab(activeTab)
    // También actualizar el tab "todos" para mantener consistencia
    loadDataForTab('todos')
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
          
          <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as 'inscripciones' | 'plantillas')} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="inscripciones">
                📊 Inscripciones
              </TabsTrigger>
              <TabsTrigger value="plantillas">
                📄 Plantillas PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inscripciones">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  {tiposInscripcion.filter(t => t.value !== 'plantillas').map((tipo) => (
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

                {tiposInscripcion.filter(t => t.value !== 'plantillas').map((tipo) => (
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
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent value="plantillas">
              <PlantillasManager />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

