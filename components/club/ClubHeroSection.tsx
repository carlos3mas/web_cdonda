"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export function ClubHeroSection() {
  const { t } = useI18n();
  
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Imagen de fondo con blur */}
      <div className="absolute inset-0">
        <Image
          src="/images/club/hero.webp"
          alt="CD Onda"
          fill
          className="object-cover object-center blur-[8px] sm:blur-[6px] md:blur-[4px]"
          priority
          quality={80}
          sizes="100vw"
        />
        {/* Overlay sutil para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />
      </div>  

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 lg:grid-cols-[0.7fr,1.9fr] lg:gap-6 items-center max-w-7xl mx-auto py-8 sm:py-12 md:py-14 lg:py-18">
          {/* Columna izquierda - Imágenes apiladas */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-5 order-2 lg:order-1 w-full"
          >
            {/* Escudo principal */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-[120px] xs:max-w-[140px] sm:max-w-[170px] md:max-w-[200px]"
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src="/images/logos/escudo-cd-onda.webp"
                  alt="Escudo CD Onda"
                  fill
                  priority
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 32vw, (min-width: 475px) 45vw, 48vw"
                  className="object-contain drop-shadow-[0_12px_36px_rgba(220,38,38,0.32)]"
                />
              </div>
            </motion.div>

            {/* Logo Escola de Futbol */}
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[230px] md:max-w-[260px]"
            >
              <Image
                src="/images/logos/escola-futbol.webp"
                alt="Escola de Futbol CD Onda"
                width={260}
                height={130}
                loading="lazy"
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 36vw, (min-width: 475px) 55vw, 60vw"
                className="w-full h-auto drop-shadow-[0_10px_28px_rgba(0,0,0,0.2)]"
              />
            </motion.div>
          </motion.div>

          {/* Columna derecha - Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 flex flex-col items-center text-center lg:text-left text-white w-full max-w-4xl mx-auto px-1 sm:px-2 md:px-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[10px] xs:text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-white font-bold mb-2 sm:mb-3 md:mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            >
              {t('hero.desde1921')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl xs:text-2xl sm:text-[2rem] md:text-[3.1rem] lg:text-[3.6rem] xl:text-[4rem] font-black leading-[1.1] sm:leading-tight uppercase mb-3 sm:mb-4 md:mb-5 drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] sm:drop-shadow-[0_18px_55px_rgba(0,0,0,0.6)] text-center"
            >
              <span className="block text-white px-1">
                {t('hero.futuroFutbol')}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-4 sm:mb-6 md:mb-8 flex justify-center"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                  <span className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-[0.05em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] sm:drop-shadow-[0_16px_45px_rgba(0,0,0,0.35)] px-1">
                    CD ONDA
                  </span>
                </div>
                <span
                  className="block h-[1.5px] sm:h-[2px] w-12 sm:w-16 md:w-20 rounded-full bg-white/80"
                  aria-hidden
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold italic text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_12px_40px_rgba(0,0,0,0.3)] mb-4 sm:mb-6 md:mb-8 text-center px-2"
            >
              Units per un sentiment
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-semibold max-w-2xl mb-4 sm:mb-6 md:mb-10 drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)] sm:drop-shadow-[0_10px_32px_rgba(0,0,0,0.5)] px-2 sm:px-3"
            >
              {t('hero.clubCentenario')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center w-full"
            >
              <Link href="#contacto" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-white text-red-600 hover:bg-red-50 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 font-semibold tracking-wide shadow-[0_18px_45px_rgba(255,255,255,0.35)] border border-red-200 transition-colors"
                >
                  {t('hero.contactaClub')}
                  <ArrowRight className="ml-2 sm:ml-3 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Líneas decorativas eliminadas para evitar interferencias visuales */}
    </section>
  );
}
