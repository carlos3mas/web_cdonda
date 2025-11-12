'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Users, MapPin, Euro } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function CampusDetailsSection() {
  const { t } = useI18n()
  
  const details = [
    {
      icon: Calendar,
      title: t('campusDetails.fechas'),
      info: [t('campusDetails.fechasInfo1'), t('campusDetails.fechasInfo2')],
      highlight: t('campusDetails.fechasHighlight')
    },
    {
      icon: Clock,
      title: t('campusDetails.horario'),
      info: [t('campusDetails.horarioInfo1'), t('campusDetails.horarioInfo2')],
      highlight: t('campusDetails.horarioHighlight')
    },
    {
      icon: Users,
      title: t('campusDetails.edades'),
      info: [t('campusDetails.edadesInfo1'), t('campusDetails.edadesInfo2')],
      highlight: t('campusDetails.edadesHighlight')
    },
    {
      icon: MapPin,
      title: t('campusDetails.lugar'),
      info: [t('campusDetails.lugarInfo1'), t('campusDetails.lugarInfo2')],
      highlight: t('campusDetails.lugarHighlight')
    },
    {
      icon: Euro,
      title: t('campusDetails.precio'),
      info: [t('campusDetails.precioInfo1'), t('campusDetails.precioInfo2')],
      highlight: t('campusDetails.precioHighlight')
    }
  ]

  return (
    <section id="campus-info" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('campusDetails.informacionPracticaTitle')}</span>{' '}
            <span className="text-red-600">{t('campusDetails.informacionPracticaSubtitle')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('campusDetails.todoNecesitas')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {details.map((detail, index) => {
            const Icon = detail.icon
            return (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center border border-red-100 bg-white/95 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
                    <div className="flex justify-center">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-red-600">{detail.title}</h3>
                    <div className="space-y-1">
                      {detail.info.map((line, i) => (
                        <p key={i} className="text-xs sm:text-sm text-gray-600 leading-relaxed">{line}</p>
                      ))}
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] xs:text-xs font-semibold text-red-600 uppercase tracking-wide">
                      {detail.highlight}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-6 py-8 sm:px-10 sm:py-9 md:px-12 md:py-10 text-center text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <p className="text-[10px] xs:text-xs uppercase tracking-[0.35em] sm:tracking-[0.45em] text-white/70 px-2">{t('campusDetails.descuentoEspecial')}</p>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/90 px-3 leading-relaxed">
              {t('campusDetails.descuentoHermanos')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

