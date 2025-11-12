'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Users, Trophy, Shield, Camera } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function CampusInfoSection() {
  const { t } = useI18n()
  
  const features = [
    {
      icon: Trophy,
      title: t('campus.entrenamientoTecnico'),
      description: t('campus.entrenamientoTecnicoDesc')
    },
    {
      icon: Users,
      title: t('campus.trabajoEquipo'),
      description: t('campus.trabajoEquipoDesc')
    },
    {
      icon: Calendar,
      title: t('campus.planificacion'),
      description: t('campus.planificacionDesc')
    },
    {
      icon: Shield,
      title: t('campus.seguro'),
      description: t('campus.seguroDesc')
    },
    {
      icon: Camera,
      title: t('campus.fotos'),
      description: t('campus.fotosDesc')
    },
    {
      icon: Clock,
      title: t('campus.atencion'),
      description: t('campus.atencionDesc')
    }
  ]

  return (
    <section id="campus-incluye" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('campus.queIncluye')}</span> <span className="text-red-600">{t('campus.elCampus')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('campus.descripcion')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border border-red-100 bg-white/95 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4 sm:p-5 md:p-6">
                    <div className="mb-3 sm:mb-4 flex items-center justify-center">
                      <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-base sm:text-lg text-red-600 text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                    <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed">{feature.description}</p>
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 text-center text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <p className="text-[10px] xs:text-xs uppercase tracking-[0.35em] sm:tracking-[0.45em] text-white/75 px-2">{t('header.campusNavidad')} CD Onda</p>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/95 max-w-3xl px-3">
              {t('campus.experiencia')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

