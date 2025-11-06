'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

// Patrocinador principal de la escuela
const mainSponsor = {
  name: 'Patrocinador Principal',
  logo: '⭐',
  description: 'Patrocinador oficial de la escuela'
}

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
    <section id="patrocinadores" className="py-16 bg-white border-y border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Nuestros <span className="text-gradient">Patrocinadores</span>
          </h3>
          <p className="text-gray-600">Gracias por confiar en nosotros</p>
        </motion.div>

        {/* Patrocinador Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-red-600 mb-2">
              <Star className="h-5 w-5 fill-current" />
              <span className="text-sm font-semibold">Patrocinador Principal</span>
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-gray-50 rounded-2xl p-8 border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">{mainSponsor.logo}</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{mainSponsor.name}</h4>
                <p className="text-sm text-gray-600 text-center">{mainSponsor.description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Título para los demás patrocinadores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h4 className="text-lg font-semibold text-gray-700">Otros Patrocinadores</h4>
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

