'use client'

import { motion } from 'framer-motion'

// Sponsors del club (versión compacta para banner global)
const sponsors = [
  { name: 'Sponsor 1', logo: '🏢' },
  { name: 'Sponsor 2', logo: '🏪' },
  { name: 'Sponsor 3', logo: '🏭' },
  { name: 'Sponsor 4', logo: '🏛️' },
  { name: 'Sponsor 5', logo: '🏦' },
  { name: 'Sponsor 6', logo: '🏨' },
  { name: 'Sponsor 7', logo: '🏬' },
  { name: 'Sponsor 8', logo: '🏢' },
]

export function SponsorsBanner() {
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
          {duplicatedSponsors.map((sponsor, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-1.5 text-gray-500 opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="text-lg">{sponsor.logo}</span>
              <span className="text-xs font-medium whitespace-nowrap">{sponsor.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

