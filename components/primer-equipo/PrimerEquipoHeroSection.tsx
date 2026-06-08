'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Trophy } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function PrimerEquipoHeroSection() {
  const { t } = useI18n()

  const infoItems = [
    { icon: Calendar, label: t('primerEquipo.fundado'), value: t('primerEquipo.fundadoValor') },
    { icon: Trophy, label: t('primerEquipo.liga'), value: t('primerEquipo.ligaValor') },
    { icon: MapPin, label: t('primerEquipo.estadio'), value: t('primerEquipo.estadioValor') },
  ]

  return (
    <section className="relative min-h-[55vh] sm:min-h-[62vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/club/hero.webp"
          alt="Club Deportivo Onda - Primer Equipo"
          fill
          className="object-cover object-center blur-[6px] sm:blur-[4px]"
          priority
          quality={70}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-[#0f0f0f]/75 to-black/70" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-8 sm:gap-10 lg:gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-28 h-36 xs:w-32 xs:h-40 sm:w-36 sm:h-44 md:w-40 md:h-48">
              <Image
                src="/images/logos/escudo-cd-onda.webp"
                alt="Escudo Club Deportivo Onda"
                fill
                className="object-contain drop-shadow-[0_12px_36px_rgba(220,38,38,0.35)]"
                priority
                sizes="(max-width: 640px) 128px, 160px"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center lg:text-left text-white"
          >
            <p className="text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-red-200 mb-3 sm:mb-4">
              {t('primerEquipo.badge')}
            </p>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-1">
              {t('primerEquipo.titulo')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-red-400 mb-4 sm:mb-5">
              {t('primerEquipo.subtitulo')}
            </p>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8">
              {t('primerEquipo.descripcion')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0">
              {infoItems.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-4 py-3 sm:py-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-red-300 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[10px] xs:text-xs uppercase tracking-wider text-white/60 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-white leading-snug">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
