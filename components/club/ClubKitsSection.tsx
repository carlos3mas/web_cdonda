'use client'

import { motion } from 'framer-motion'
import { Shirt } from 'lucide-react'
import Image from 'next/image'

// Equipajes del club - el usuario añadirá las fotos
const kits = [
  {
    name: 'Primera Equipación',
    description: 'Equipación para partidos en casa',
    image: '/images/kits/local.jpg', // El usuario añadirá esta imagen
    alt: 'Equipaje local CD Onda'
  },
  {
    name: 'Segunda Equipación',
    description: 'Equipación para partidos fuera',
    image: '/images/kits/visitante.jpg', // El usuario añadirá esta imagen
    alt: 'Equipaje visitante CD Onda'
  }
]

export function ClubKitsSection() {
  return (
    <section id="equipajes" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
           <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-600">Nuestros</span> <span className="text-gradient">Equipajes</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre las equipaciones oficiales del Club Deportivo Onda. 
            Diseñadas para representar nuestros colores y valores en cada partido.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {kits.map((kit, index) => (
            <motion.div
              key={kit.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-80 bg-gray-100 overflow-hidden">
                  {/* Placeholder mientras no hay imagen - se ocultará cuando añadas la imagen */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
                    <div className="text-center">
                      <Shirt className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm">Añade la imagen aquí</p>
                      <p className="text-gray-500 text-xs mt-2">{kit.name}</p>
                    </div>
                  </div>
                  
                  {/* Imagen real - descomenta cuando añadas las fotos en public/images/kits/ */}
                  {/* 
                  <Image
                    src={kit.image}
                    alt={kit.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                  />
                  */}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-red-600 mb-2">{kit.name}</h3>
                  <p className="text-gray-600">{kit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

