'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { PrimerEquipoSectionHeader } from './PrimerEquipoSectionHeader'

const placeholderSlots = Array.from({ length: 8 })

export function PrimerEquipoSquadSection() {
  const { t } = useI18n()

  return (
    <section id="primer-equipo-plantilla" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <PrimerEquipoSectionHeader
          titleBlue={t('primerEquipo.plantilla')}
          titleRed={t('primerEquipo.plantillaSub')}
          description={t('primerEquipo.plantillaDesc')}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {placeholderSlots.map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded-xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300" />
              </div>
              <div className="w-full h-3 rounded bg-gray-100" />
              <div className="w-2/3 h-2 rounded bg-gray-50" />
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 sm:mt-10 max-w-xl mx-auto">
          {t('primerEquipo.proximamente')}
        </p>
      </div>
    </section>
  )
}
