'use client'

import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n/context'
import { PrimerEquipoSectionHeader } from './PrimerEquipoSectionHeader'

const placeholderArticles = [0, 1, 2]

export function PrimerEquipoNewsSection() {
  const { t } = useI18n()

  return (
    <section id="primer-equipo-noticias" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <PrimerEquipoSectionHeader
          titleBlue={t('primerEquipo.noticias')}
          titleRed={t('primerEquipo.noticiasSub')}
          description={t('primerEquipo.noticiasDesc')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {placeholderArticles.map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-gray-100 shadow-sm">
                <CardContent className="p-5 sm:p-6 flex flex-col gap-4 h-full">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-5/6 rounded bg-gray-100" />
                  </div>
                  <p className="text-xs text-gray-400">{t('primerEquipo.proximamente')}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
