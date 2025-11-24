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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-[4px] sm:blur-[3px] md:blur-[2px]"
        >
          <source src="/images/campus/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#0f0f0f]/70 to-black/60" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-full mx-auto lg:mx-0"
          >
            <div className="absolute -inset-4 sm:-inset-5 md:-inset-6 rounded-2xl sm:rounded-3xl bg-black/20 blur-2xl hidden lg:block" aria-hidden />
            <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] sm:shadow-[0_25px_60px_rgba(0,0,0,0.5)] md:shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
              <Image
                src="/images/campus/cartel-campus.jpg"
                alt="Cartel Campus de Navidad 2025"
                width={800}
                height={1067}
                className="object-contain w-full h-auto"
                priority
                sizes="(max-width: 475px) 85vw, (max-width: 640px) 75vw, (max-width: 768px) 65vw, (max-width: 1024px) 55vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white text-center lg:text-left px-2 sm:px-3 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7"
          >
            <div>
              <p className="text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-red-200 mb-3 sm:mb-4 md:mb-5">
                {t('campusHero.campusNavidad')}
              </p>
            </div>
            
            <div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.2] sm:leading-[1.15] md:leading-[1.1] mb-4 sm:mb-5 md:mb-6 px-1">
                Vive una experiencia única en el Campus <span className="whitespace-nowrap">CD ONDA</span>
              </h1>
            </div>
            
            <div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-7 md:mb-8">
                {t('campusHero.descripcion')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/campus-navidad/inscripcion" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-red-600 hover:bg-red-100 text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
                  <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {t('campusHero.inscrbeteAhora')}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 md:gap-8 lg:gap-10 text-xs sm:text-sm md:text-base text-white/70 justify-center lg:justify-start pt-2 sm:pt-3">
              <div className="text-center lg:text-left mb-3 sm:mb-0">
                <p className="font-semibold text-white mb-2 sm:mb-2.5">{t('campusHero.servicios')}</p>
                <p className="leading-relaxed">{t('campusHero.serviciosDesc')}</p>
              </div>
              <div className="mt-3 sm:mt-0 text-center lg:text-left">
                <p className="font-semibold text-white mb-2 sm:mb-2.5">{t('campusHero.ubicacion')}</p>
                <p className="leading-relaxed">{t('campusHero.ubicacionDesc')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

