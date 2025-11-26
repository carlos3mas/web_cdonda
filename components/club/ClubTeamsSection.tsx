'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
import { useI18n } from '@/lib/i18n/context'

export function ClubTeamsSection() {
  const { t } = useI18n()
  
  const teams = [
    { icon: Baby, title: t('teams.chupetines'), age: t('teams.anos3_4'), description: t('teams.chupetinesDesc') },
    { icon: Sparkles, title: t('teams.querubines'), age: t('teams.anos4_5'), description: t('teams.querubinesDesc') },
    { icon: Flag, title: t('teams.prebenjamin'), age: t('teams.anos6_7'), description: t('teams.prebenjaminDesc') },
    { icon: School, title: t('teams.benjamin'), age: t('teams.anos8_9'), description: t('teams.benjaminDesc') },
    { icon: Shield, title: t('teams.alevin'), age: t('teams.anos10_11'), description: t('teams.alevinDesc') },
    { icon: Rocket, title: t('teams.infantil'), age: t('teams.anos12_13'), description: t('teams.infantilDesc') },
    { icon: GraduationCap, title: t('teams.cadete'), age: t('teams.anos14_15'), description: t('teams.cadeteDesc') },
    { icon: Award, title: t('teams.juvenil'), age: t('teams.anos16_18'), description: t('teams.juvenilDesc') },
    { icon: Users, title: t('teams.amateur'), age: t('teams.anos18Plus'), description: t('teams.amateurDesc') },
    { icon: Heart, title: t('teams.veteranos'), age: t('teams.anos35Plus'), description: t('teams.veteranosDesc') },
    { icon: Stars, title: t('teams.edi'), age: t('teams.todasLasEdades'), description: t('teams.ediDesc') },
    { icon: Crown, title: t('teams.primerEquipo'), age: t('teams.senior'), description: t('teams.primerEquipoDesc') }
  ]

  return (
    <section id="equipos" className="relative py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      {/* Imagen collage como fondo */}
      <div className="absolute inset-0 z-0 opacity-90">
        <Image
          src="/images/club/_backup_fotos/collage-bg.webp"
          alt="Collage de todos los equipos del CD Onda"
          fill
          className="object-cover sm:object-contain md:object-cover lg:object-contain"
          loading="lazy"
          sizes="100vw"
          quality={85}
          style={{ 
            objectPosition: 'center center'
          }}
        />
      </div>

      {/* Overlay para legibilidad */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/60 via-white/55 to-white/60"></div>

      {/* Contenido principal */}
      <div className="relative z-20 container mx-auto px-3 sm:px-4">
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

        {/* Contenido centrado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto space-y-8 md:space-y-10"
        >
          {/* Categories - Centrado */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-12 bg-blue-600 rounded"></div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{t('teams.nuestrasCategoriasSubtitle')}</h4>
              <div className="h-1 w-12 bg-blue-600 rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {teams.map((team, index) => {
                const Icon = team.icon
                return (
                  <motion.div
                    key={team.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex flex-col gap-2 p-3 md:p-4 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                          {team.title}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {team.age}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-0 sm:pl-14">
                      {team.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Nota sobre equipos femeninos - Centrado */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-4 md:p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm text-center"
            >
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold text-blue-600">💙 {t('teams.futbolFemenino')}:</span> {' '}
                {t('teams.futbolFemeninoDescripcion')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
