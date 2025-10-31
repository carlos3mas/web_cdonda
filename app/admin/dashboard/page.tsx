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

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      loadData()
    }
  }, [status])

  const loadData = async () => {
    try {
      const [statsRes, inscripcionesRes] = await Promise.all([
        fetch('/api/inscripciones/stats'),
        fetch('/api/inscripciones')
      ])

      const statsData = await statsRes.json()
      const inscripcionesData = await inscripcionesRes.json()

      setStats(statsData)
      setInscripciones(inscripcionesData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setIsLoading(false)
    }
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
          
          {stats && <StatsCards stats={stats} />}
          
          <InscripcionesTable 
            inscripciones={inscripciones} 
            onUpdate={loadData}
          />
        </motion.div>
      </main>
    </div>
  )
}

