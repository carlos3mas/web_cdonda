'use client'

import { motion } from 'framer-motion'

// Sponsors del club (placeholder - reemplazar con logos reales)
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

export function SponsorsSection() {
  // Duplicar los sponsors para crear el efecto infinito
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors]

  return (
    <section className="py-16 bg-white border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Nuestros <span className="text-gradient">Patrocinadores</span>
          </h3>
          <p className="text-gray-600">Gracias por confiar en nosotros</p>
        </motion.div>
      </div>

      <div className="relative">
        {/* Gradientes de fade en los extremos */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Carrusel infinito */}
        <motion.div
          className="flex gap-16"
          animate={{
            x: [0, -1920], // Ajustar según el ancho total
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
              className="flex-shrink-0 w-40 h-24 flex items-center justify-center bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{sponsor.logo}</div>
                <p className="text-xs font-medium text-gray-600">{sponsor.name}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          ¿Quieres ser patrocinador? 
          <a href="#contacto" className="text-red-600 hover:text-red-700 font-semibold ml-1">
            Contáctanos
          </a>
        </p>
      </div>
    </section>
  )
}

