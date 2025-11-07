'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function ClubHeroSection() {
  const floatingBadges = [
    {
      label: 'Pasión',
      className: 'top-[-20px] left-[-20px]',
      color: 'bg-red-600/90 text-white border border-white/40 shadow-[0_18px_40px_rgba(220,38,38,0.5)]'
    },
    {
      label: 'Valores',
      className: 'top-[-50px] right-[-50px]',
      color: 'bg-white/90 text-red-700 border border-red-500/60 shadow-[0_18px_40px_rgba(255,255,255,0.35)]'
    },
    {
      label: 'Cantera',
      className: 'bottom-[8%] left-[-55px]',
      color: 'bg-white/90 text-red-700 border border-red-500/60 shadow-[0_18px_40px_rgba(220,38,38,0.35)]'
    },
    {
      label: '+ de 100 años',
      className: 'bottom-[-60px] right-[-10px]',
      color: 'bg-red-500/90 text-white border border-white/40 shadow-[0_18px_40px_rgba(220,38,38,0.5)]'
    }
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#fffbfb]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#8b0000] via-[#d53030] to-white" />
      <div className="absolute -top-32 -left-20 h-[420px] w-[420px] bg-red-500/40 blur-[150px]" />
      <div className="absolute -bottom-36 right-[-12%] h-[420px] w-[420px] bg-white/70 blur-[160px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="relative flex flex-col items-center">
            {floatingBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: [0, 1, 0.35, 1], y: [0, -12, 0] }}
                transition={{ delay: 0.4 + index * 0.2, duration: 6.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                className={`hidden md:flex absolute ${badge.className}`}
                style={{ transform: `rotate(${index % 2 === 0 ? -8 : 6}deg)` }}
              >
                <span className={`px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] rounded-full backdrop-blur-sm ${badge.color}`}>
                  {badge.label}
                </span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-sm md:text-base uppercase tracking-[0.4em] text-red-100 mb-5"
              >
                Desde 1921 · Orgullo rojo y blanco
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] uppercase"
              >
                <span className="block text-white drop-shadow-[0_15px_50px_rgba(0,0,0,0.45)]">
                  El futuro del fútbol
                </span>
                <span className="block text-white drop-shadow-[0_15px_50px_rgba(0,0,0,0.45)]">
                  empieza aquí.
                </span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 mb-10 flex justify-center"
              >
                <span className="relative inline-flex">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.12em] text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-red-500 drop-shadow-[0_18px_45px_rgba(220,38,38,0.45)]">
                    CD ONDA
                  </span>
                  <span className="absolute left-0 right-0 -bottom-4 h-1 rounded-full bg-gradient-to-r from-white via-red-300 to-red-600 opacity-80" aria-hidden />
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-base md:text-lg text-white/90 max-w-2xl"
              >
                Un club centenario que transforma talento en fútbol de élite, impulsando la cantera, la afición y los valores de toda una ciudad.
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex justify-center"
          >
            <Link href="#contacto">
              <Button size="lg" className="group bg-red-500 text-white hover:bg-red-400 text-lg px-10 py-6 font-semibold tracking-wide shadow-[0_18px_45px_rgba(220,38,38,0.45)]">
                Contacta con el club
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

