'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Target } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const stats = [
  { label: 'Años de Historia', value: 100, icon: Trophy, suffix: '+' },
  { label: 'Jugadores Formados', value: 5000, icon: Users, suffix: '+' },
  { label: 'Campeonatos', value: 50, icon: Target, suffix: '+' },
]

export function ClubStatsSection() {
  return (
    <section id="trayectoria" className="py-20 bg-gray-900 text-white">
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
            Más de 100 años formando jugadores y transmitiendo valores deportivos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} />
                <div className="text-gray-300 text-lg mt-2">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

