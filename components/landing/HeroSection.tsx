'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export function HeroSection() {
  const { t } = useI18n()
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/campus/campus-hero-bg.jpg"
          alt="Campus de Navidad CD Onda"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b0000]/85 via-[#640606]/65 to-[#090909]/65" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-10 sm:py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:gap-12 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-[280px] sm:max-w-sm mx-auto lg:max-w-none"
          >
            <div className="absolute -inset-5 rounded-3xl bg-black/20 blur-2xl hidden lg:block" aria-hidden />
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
              <Image
                src="/images/campus/cartel-campus-2025.png"
                alt="Cartel Campus de Navidad 2025"
                width={540}
                height={720}
                className="object-cover w-full h-auto"
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white text-center lg:text-left px-2 sm:px-3"
          >
            <p className="text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-red-200 mb-2 sm:mb-3 md:mb-4">
              {t('campusHero.campusNavidad')}
            </p>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] sm:leading-tight mb-3 sm:mb-4 md:mb-5 px-1">
              {t('campusHero.experienciaUnica')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/85 mb-5 sm:mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0">
              {t('campusHero.descripcion')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6 justify-center lg:justify-start">
              <Link href="/campus-navidad/inscripcion" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-red-600 hover:bg-red-100 text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                  <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {t('campusHero.inscrbeteAhora')}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 md:gap-6 lg:gap-8 text-[11px] xs:text-xs sm:text-sm text-white/70 justify-center lg:justify-start">
              <div className="text-center lg:text-left mb-2 sm:mb-0">
                <p className="font-semibold text-white mb-0.5 sm:mb-1">{t('campusHero.servicios')}</p>
                <p className="leading-relaxed">{t('campusHero.serviciosDesc')}</p>
              </div>
              <div className="mt-2 sm:mt-0 text-center lg:text-left">
                <p className="font-semibold text-white mb-0.5 sm:mb-1">{t('campusHero.ubicacion')}</p>
                <p className="leading-relaxed">{t('campusHero.ubicacionDesc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

