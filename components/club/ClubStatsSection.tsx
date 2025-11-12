'use client'

import { motion } from 'framer-motion'
import { Trophy, Users, Target } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { useI18n } from '@/lib/i18n/context'

export function ClubStatsSection() {
  const { t } = useI18n()
  
  const stats = [
    { label: t('stats.anosHistoria'), value: 100, icon: Trophy, suffix: '+' },
    { label: t('stats.jugadoresFormados'), value: 5000, icon: Users, suffix: '+' },
    { label: t('stats.exitos'), value: 10000, icon: Target, suffix: '+' },
  ]

  return (
    <section id="trayectoria" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            <div className="absolute -top-24 -right-14 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-white px-2">
                {t('stats.nuestraTrayectoria')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-3xl mx-auto px-3">
                {t('stats.descripcion')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
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
                    <div className="mb-3 md:mb-4 flex justify-center">
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600" />
                    </div>
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
                    <div className="text-white text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 px-2">{stat.label}</div>
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

