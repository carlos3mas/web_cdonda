"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ClubHeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Fondo dividido diagonalmente en blanco y rojo optimizado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-y-[-35%] left-[39%] w-[140%] origin-top-left -skew-x-[14deg] bg-[#d61b1b]" />
        
      </div>  
      {/* Textura sutil en resoluciones grandes */}
      <div
        className="absolute inset-0 hidden lg:block opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12px 12px, rgba(30,64,175,0.14) 1.4px, transparent 0)",
          backgroundSize: "46px 46px",
        }}
      />
      {/* Halos de luz suavizados */}
      <div className="absolute -top-40 left-[10%] h-[320px] w-[320px] rounded-full bg-red-500/25 blur-[80px]" />
      <div className="absolute -bottom-48 right-[12%] h-[280px] w-[280px] rounded-full bg-blue-500/18 blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-[0.7fr,1.9fr] lg:gap-6 items-center max-w-7xl mx-auto py-14 lg:py-18">
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
              className="relative w-full max-w-[140px] sm:max-w-[170px] md:max-w-[200px]"
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src="/images/logos/escudo-cd-onda.png"
                  alt="Escudo CD Onda"
                  fill
                  priority
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 32vw, 45vw"
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
              className="relative w-full max-w-[200px] sm:max-w-[230px] md:max-w-[260px]"
            >
              <Image
                src="/images/logos/escola-futbol.png"
                alt="Escola de Futbol CD Onda"
                width={260}
                height={130}
                loading="lazy"
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 36vw, 55vw"
                className="w-full h-auto drop-shadow-[0_10px_28px_rgba(0,0,0,0.2)]"
              />
            </motion.div>
          </motion.div>

          {/* Columna derecha - Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 flex flex-col items-center text-center text-gray-900 w-full max-w-4xl mx-auto px-2 md:px-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm md:text-base uppercase tracking-[0.4em] text-gray-900 font-bold mb-5"
            >
              Desde 1921 · Orgullo rojo y blanco
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[2.25rem] sm:text-[3.1rem] lg:text-[3.6rem] xl:text-[4rem] font-black leading-tight uppercase mb-5 drop-shadow-[0_18px_55px_rgba(0,0,0,0.24)]"
            >
              <span className="block text-black">
                El futuro del fútbol empieza aquí
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-[0.05em] text-white drop-shadow-[0_16px_45px_rgba(0,0,0,0.35)]">
                    CD ONDA
                  </span>
                </div>
                <span
                  className="block h-[2px] w-20 rounded-full bg-white/80"
                  aria-hidden
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base md:text-lg text-black font-semibold max-w-2xl mb-10 drop-shadow-[0_10px_32px_rgba(0,0,0,0.18)]"
            >
              Un club centenario que transforma talento en fútbol de élite,
              impulsando la cantera, la afición y los valores de toda una
              ciudad.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center"
            >
              <Link href="#contacto">
                <Button
                  size="lg"
                  className="group bg-white text-red-600 hover:bg-red-50 text-lg px-10 py-6 font-semibold tracking-wide shadow-[0_18px_45px_rgba(255,255,255,0.35)] border border-red-200 transition-colors"
                >
                  Contacta con el club
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
