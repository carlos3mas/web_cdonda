'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  Baby,
  School,
  GraduationCap,
  Heart,
  Sparkles,
  Flag,
  Shield,
  Rocket,
  Award,
  Stars,
  Crown
} from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { useI18n } from '@/lib/i18n/context'
import { AutoCarousel } from '@/components/ui/auto-carousel'

export function ClubTeamsSection() {
  const { t } = useI18n()
  
  const categories = [
    {
      icon: Baby,
      title: t('teams.chupetines'),
      age: t('teams.anos3_4'),
      description: t('teams.chupetinesDesc'),
      iconSize: 'h-9 w-9',
      images: []
    },
    {
      icon: Sparkles,
      title: t('teams.querubines'),
      age: t('teams.anos4_5'),
      description: t('teams.querubinesDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/querubines-1.webp',
        '/images/club/querubines-2.webp'
      ]
    },
    {
      icon: Flag,
      title: t('teams.prebenjamin'),
      age: t('teams.anos6_7'),
      description: t('teams.prebenjaminDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/prebenjamin-1.webp',
        '/images/club/prebenjamin-2.webp',
        '/images/club/prebenjamin-3.webp'
      ]
    },
    {
      icon: School,
      title: t('teams.benjamin'),
      age: t('teams.anos8_9'),
      description: t('teams.benjaminDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/benjamin-1.webp',
        '/images/club/benjamin-2.webp',
        '/images/club/benjamin-3.webp',
        '/images/club/benjamin-4.webp',
        '/images/club/benjamin-5.webp',
        '/images/club/benjamin-6.webp',
        '/images/club/benjamin-7.webp',
      ]
    },
    {
      icon: Shield,
      title: t('teams.alevin'),
      age: t('teams.anos10_11'),
      description: t('teams.alevinDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/alevines-1.webp',
        '/images/club/alevines-2.webp',
        '/images/club/alevines-3.webp',
        '/images/club/alevines-4.webp',
        '/images/club/alevines-5.webp',
        '/images/club/alevines-6.webp'
      ]
    },
    {
      icon: Rocket,
      title: t('teams.infantil'),
      age: t('teams.anos12_13'),
      description: t('teams.infantilDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/infantiles-1.webp',
        '/images/club/infantiles-2.webp',
        '/images/club/infantiles-3.webp',
        '/images/club/infantiles-4.webp',
        '/images/club/infantiles-5.webp',
        '/images/club/infantiles-6.webp'
      ]
    },
    {
      icon: GraduationCap,
      title: t('teams.cadete'),
      age: t('teams.anos14_15'),
      description: t('teams.cadeteDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/cadetes-1.webp',
        '/images/club/cadetes-2.webp',
        '/images/club/cadetes-3.webp',
      ]
    },
    {
      icon: Award,
      title: t('teams.juvenil'),
      age: t('teams.anos16_18'),
      description: t('teams.juvenilDesc'),
      iconSize: 'h-9 w-9',
      images: [
        '/images/club/juveniles-1.webp',
        '/images/club/juveniles-2.webp',
        '/images/club/juveniles-3.webp',
        '/images/club/juveniles-4.webp',
      ]
    },
    {
      icon: Users,
      title: t('teams.amateur'),
      age: t('teams.anos18Plus'),
      description: t('teams.amateurDesc'),
      iconSize: 'h-9 w-9',
      images: ['/images/club/amater.webp'] 
    },
    {
      icon: Heart,
      title: t('teams.veteranos'),
      age: t('teams.anos35Plus'),
      description: t('teams.veteranosDesc'),
      iconSize: 'h-9 w-9',
      images: ['/images/club/veteranos.webp'] 
    },
    {
      icon: Stars,
      title: t('teams.edi'),
      age: t('teams.todasLasEdades'),
      description: t('teams.ediDesc'),
      iconSize: 'h-9 w-9',
      images: ['/images/club/edi.webp'] 
    },
    {
      icon: Crown,
      title: t('teams.primerEquipo'),
      age: t('teams.senior'),
      description: t('teams.primerEquipoDesc'),
      iconSize: 'h-9 w-9',
      images: ['/images/club/primer-equipo.webp'] 
    }
  ]

  return (
    <section id="equipos" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('teams.nuestrosEquiposTitle')}</span>{' '}
            <span className="text-red-600">{t('teams.nuestrosEquiposSubtitle')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('teams.descripcion')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border border-red-100 bg-white/95 hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Imagen o carrusel */}
                  <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100">
                    <AutoCarousel
                      images={category.images || []}
                      alt={category.title}
                      interval={4000}
                      className="rounded-none"
                    />
                  </div>
                  <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col items-center text-center gap-3 sm:gap-4">
                    <span className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-50 -mt-6 sm:-mt-8 relative z-10">
                      <Icon className={`text-blue-600 h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9`} />
                    </span>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-red-600">{category.title}</h3>
                      <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 sm:px-3 sm:py-1 text-[10px] xs:text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {category.age}
                      </span>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed px-1">
                        {category.description}
                      </p>
                    </div>
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
          className="rounded-2xl bg-gradient-to-b from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white p-5 sm:p-6 md:p-8 lg:p-12 shadow-[0_18px_45px_rgba(139,0,0,0.35)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 md:gap-8 text-center">
            <div>
              <AnimatedCounter end={31} duration={2000} className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
              <div className="text-white/90 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base px-2">{t('teams.equiposCompeticion')}</div>
            </div>
            <div>
              <AnimatedCounter end={612} duration={2000} className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
              <div className="text-white/90 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base px-2">{t('teams.jugadoresFederados')}</div>
            </div>
            <div>
              <AnimatedCounter end={40} duration={2000} className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl" />
              <div className="text-white/90 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base px-2">{t('teams.entrenadoresTitulados')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

