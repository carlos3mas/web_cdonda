'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Users, Trophy, Shirt, Shield, Camera, Award } from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'Entrenamiento Técnico',
    description: 'Mejora de habilidades individuales y fundamentos del fútbol'
  },
  {
    icon: Users,
    title: 'Trabajo en Equipo',
    description: 'Partidos y ejercicios para fomentar la cooperación'
  },
  {
    icon: Shirt,
    title: 'Camiseta Oficial',
    description: 'Equipación exclusiva del Campus de Navidad 2025'
  },
  {
    icon: Shield,
    title: 'Seguro Incluido',
    description: 'Cobertura completa de accidentes deportivos'
  },
  {
    icon: Camera,
    title: 'Fotos y Recuerdos',
    description: 'Reportaje fotográfico de toda la experiencia'
  },
  {
    icon: Award,
    title: 'Diploma',
    description: 'Certificado oficial de participación'
  }
]

export function CampusInfoSection() {
  return (
    <section id="campus-incluye" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Qué Incluye el <span className="text-gradient">Campus?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Una semana completa de fútbol, diversión y aprendizaje con todo incluido
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
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

