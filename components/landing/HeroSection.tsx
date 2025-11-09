'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
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

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-3xl bg-black/20 blur-2xl" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
              <Image
                src="/images/campus/cartel-campus-2025.png"
                alt="Cartel Campus de Navidad 2025"
                width={540}
                height={720}
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-red-200 mb-4">
              Campus de Navidad · 23-30 Diciembre 2025
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
              Vive una experiencia única en el Campus CD Onda
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-2xl">
              Entrenamientos de alto rendimiento, actividades lúdicas y convivencia en un entorno seguro.
              Entrenadores titulados, metodología CD Onda y grupos adaptados por edades.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/campus-navidad/inscripcion">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-100 text-lg px-8 py-6">
                  <Calendar className="mr-2 h-5 w-5" />
                  Reserva tu plaza
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 text-sm text-white/70">
              <div>
                <p className="font-semibold text-white">Servicios</p>
                <p>Comidas diarias · Actividades técnicas y lúdicas · Seguro para federados</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="font-semibold text-white">Ubicación</p>
                <p>Campos Municipales La Cossa & Enrique Saura</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

