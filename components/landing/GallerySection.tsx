'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy, Users, Target } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Años de Historia', value: '75+', icon: Trophy },
  { label: 'Jugadores Formados', value: '5000+', icon: Users },
  { label: 'Campeonatos', value: '50+', icon: Target },
]

export function GallerySection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestra <span className="text-red-500">Trayectoria</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Más de 75 años formando jugadores y transmitiendo valores deportivos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para vivir la experiencia?
          </h3>
          <p className="text-xl text-red-50 mb-8 max-w-2xl mx-auto">
            Inscríbete ahora en el Campus de Navidad 2025 y forma parte de la 
            gran familia del CD Onda. ¡Las plazas son limitadas!
          </p>
          <Link href="/campus-navidad/inscripcion">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-6">
              Inscríbete Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

