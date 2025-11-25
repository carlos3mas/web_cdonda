'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, Heart, Award, Handshake, Smile } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ClubHistorySection() {
  const { t } = useI18n()
  
  const achievements = [
    {
      year: '1921',
      title: t('history.fundacion'),
      description: t('history.fundacionDesc'),
      image: '/images/historia/fundacion.webp'
    },
    {
      year: '1955-56',
      title: t('history.primerAscenso'),
      description: t('history.primerAscensoDesc'),
      image: '/images/historia/primerascenso.webp'
    },
    {
      year: '1988-89',
      title: t('history.escuelaFutbol'),
      description: t('history.escuelaFutbolDesc'),
      image: '/images/historia/escola-futbol.webp'
    },
    {
      year: '2001-02',
      title: t('history.ascenso2B'),
      description: t('history.ascenso2BDesc'),
      image: '/images/historia/segunda-b.webp'
    },
    {
      year: '2023',
      title: t('history.medallaOro'),
      description: t('history.medallaOroDesc'),
      image: '/images/historia/medalla-oro.webp'
    },
    {
      year: t('history.actualidad'),
      title: t('history.actualidadTitle'),
      description: t('history.actualidadDesc'),
      image: '/images/historia/actualidad.webp'
    }
  ]

  const values = [
    {
      icon: Trophy,
      title: t('history.excelencia'),
      description: t('history.excelenciaDesc')
    },
    {
      icon: Users,
      title: t('history.trabajoEquipo'),
      description: t('history.trabajoEquipoDesc')
    },
    {
      icon: Heart,
      title: t('history.passion'),
      description: t('history.passionDesc')
    },
    {
      icon: Award,
      title: t('history.compromisoValor'),
      description: t('history.compromisoValorDesc')
    },
    {
      icon: Handshake,
      title: t('history.deportividad'),
      description: t('history.deportividadDesc')
    },
    {
      icon: Smile,
      title: t('history.humildad'),
      description: t('history.humildadDesc')
    }
  ]

  return (
    <section id="club" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Historia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-600 font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            {t('history.nuestraHistoria')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('history.desde1921')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
            <div className="absolute left-[-20%] top-[5%] h-40 w-64 bg-[radial-gradient(circle_at_center,rgba(214,27,27,0.12)_0%,rgba(214,27,27,0)_70%)] blur-3xl" />
            <div className="absolute right-[-18%] top-[38%] h-48 w-72 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.12)_0%,rgba(30,64,175,0)_70%)] blur-3xl" />
            <div className="absolute left-[-15%] bottom-[12%] h-44 w-64 bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.1)_0%,rgba(14,116,144,0)_70%)] blur-3xl" />
          </div>

          {achievements.map((achievement, index) => {
            // Determinar si es la imagen de la escuela de fútbol (1988-89)
            const isEscolaFutbol = achievement.image?.includes('escola-futbol')
            
            return (
            <motion.div
              key={achievement.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 items-start"
            >
              {achievement.image && (
                <div
                  aria-hidden="true"
                  className={`hidden md:block pointer-events-none absolute z-0 overflow-hidden rounded-[24px] border border-white/50 opacity-70 drop-shadow-[0_22px_32px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-out bg-white ${
                    index % 2 === 0
                      ? isEscolaFutbol
                        ? 'left-[-260px] top-[-12px] h-52 w-80 rotate-[-3deg]'
                        : 'left-[-240px] top-[-12px] h-44 w-72 rotate-[-3deg]'
                      : isEscolaFutbol
                        ? 'right-[-260px] top-[-18px] h-52 w-80 rotate-[4deg]'
                        : 'right-[-240px] top-[-18px] h-44 w-72 rotate-[4deg]'
                  }`}
                >
                  <Image
                    src={achievement.image}
                    alt=""
                    fill
                    className={isEscolaFutbol ? "object-contain p-2" : "object-cover"}
                    sizes="320px"
                    loading="lazy"
                  />
                  {!isEscolaFutbol && <div className="pointer-events-none absolute inset-0 bg-white/20" />}
                </div>
              )}
              <div className="flex-shrink-0 w-full sm:w-20 md:w-32 mb-1 sm:mb-0">
                <div className="relative z-10 text-lg sm:text-xl md:text-2xl font-bold text-red-600">{achievement.year}</div>
              </div>
              <Card className="relative z-10 flex-1 w-full">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mb-1 sm:mb-2">{achievement.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 mb-12 sm:mb-16 md:mb-20 shadow-[0_18px_45px_rgba(139,0,0,0.35)]"
        >
          <div className="absolute inset-0 pointer-events-none hidden md:block">
            <div className="absolute -top-24 -right-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4 md:space-y-5">
            <p className="uppercase tracking-[0.3em] sm:tracking-[0.35em] text-blue-100 text-[10px] xs:text-xs">
              {t('history.compromiso')}
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold px-2">
              {t('history.compromisoTexto')}
            </h3>
            <p className="text-white/85 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-3">
              {t('history.compromisoDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold px-2">
              {[t('history.orgullo'), t('history.formacion'), t('history.deporte')].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-white/90 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('history.nuestrosValoresPrimera')} </span>
            <span className="text-red-600">{t('history.nuestrosValoresSegunda')}</span>
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-3">
            {t('history.valoresDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <Icon className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-red-600" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-blue-600 mb-1 sm:mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

