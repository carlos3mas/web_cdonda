'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Target } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const stats = [
  { label: 'Años de Historia', value: 100, icon: Trophy, suffix: '+' },
  { label: 'Jugadores Formados', value: 5000, icon: Users, suffix: '+' },
  { label: 'Exitos', value: 10000, icon: Target, suffix: '+' },
]

export function ClubStatsSection() {
  return (
    <section id="trayectoria" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white px-6 py-12 md:px-12 shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-14 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Nuestra Trayectoria
              </h2>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
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
                    <div className="mb-4 flex justify-center">
                      <Icon className="h-12 w-12 text-blue-600" />
                    </div>
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} className="text-white" />
                    <div className="text-white text-lg mt-2">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

