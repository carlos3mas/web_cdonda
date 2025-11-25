'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Todos los patrocinadores (excluyendo escudo y escola-futbol)
const sponsors = [
  'caja-rural.webp',
  'ayuntamiento-onda.webp',
  'Diputacion-Castellon.webp',
  'AITAPI.webp',
  'angeli.webp',
  'BESTILE.webp',
  'Curto.webp',
  'ELITE-PARFUM.webp',
  'Esmaltile.webp',
  'ESPORTS-LIZONDO.webp',
  'GALAXY-TILES.webp',
  'Globeenergy.webp',
  'J.P.E.webp',
  'LOGILOP.webp',
  'Marplac.webp',
  'MOZ-TILES.webp',
  'PURA-MAGIA.webp',
  'rotulos.webp',
  'sara-blazquez-placeholder.svg',
  'SERCAS.webp',
  'termocontrol.webp',
  'vipecons.webp',
]

export function SponsorsBanner() {
  const pathname = usePathname()
  
  // No mostrar el banner en rutas de administración
  if (pathname?.startsWith('/admin')) {
    return null
  }

  // Duplicar los sponsors para crear el efecto infinito
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors]

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 overflow-hidden py-2 shadow-sm">
      <div className="relative">
        {/* Gradientes de fade en los extremos */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Carrusel infinito compacto */}
        <motion.div
          className="flex gap-8 items-center"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedSponsors.map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex-shrink-0 flex items-center h-8 sm:h-10 opacity-70 hover:opacity-100 transition-opacity px-2"
            >
              <div className="relative w-auto h-full" style={{ aspectRatio: 'auto' }}>
                <Image
                  src={`/images/logos/${logo}`}
                  alt={logo.replace(/\.(jpg|png|jpeg|tif|webp)$/i, '').replace(/-/g, ' ')}
                  width={80}
                  height={32}
                  className="h-full w-auto object-contain"
                  loading="lazy"
                  sizes="80px"
                  quality={60}
                  unoptimized={logo.endsWith('.webp')}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

