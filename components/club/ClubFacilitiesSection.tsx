'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Warehouse, Users as UsersIcon, ShowerHead } from 'lucide-react'

const facilities = [
  {
    icon: MapPin,
    title: 'Campo Principal',
    description: 'Césped artificial de última generación con iluminación profesional y gradas para 500 espectadores',
    features: ['Césped artificial', 'Iluminación LED', 'Gradas cubiertas']
  },
  {
    icon: Warehouse,
    title: 'Campos de Entrenamiento',
    description: 'Dos campos adicionales adaptados para todas las categorías del club',
    features: ['2 campos auxiliares', 'Césped natural', 'Zona techada']
  },
  {
    icon: ShowerHead,
    title: 'Vestuarios',
    description: 'Instalaciones modernas y espaciosas con todas las comodidades',
    features: ['6 vestuarios', 'Duchas individuales', 'Taquillas']
  },
  {
    icon: UsersIcon,
    title: 'Zona Social',
    description: 'Espacios para familias y aficionados con cafetería y sala de reuniones',
    features: ['Cafetería', 'Sala de juntas', 'Terraza exterior']
  }
]

export function ClubFacilitiesSection() {
  return (
    <section id="instalaciones" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestras <span className="text-gradient">Instalaciones</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Contamos con instalaciones deportivas de primer nivel, diseñadas para 
            el desarrollo óptimo de nuestros jugadores y la comodidad de las familias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {facilities.map((facility, index) => {
            const Icon = facility.icon
            return (
              <motion.div
                key={facility.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                        <p className="text-gray-600 mb-4">{facility.description}</p>
                        <ul className="space-y-2">
                          {facility.features.map((feature) => (
                            <li key={feature} className="flex items-center text-sm text-gray-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

