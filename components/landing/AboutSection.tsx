'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, Target, Heart } from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'Excelencia Deportiva',
    description: 'Entrenadores profesionales con experiencia en formación de jóvenes talentos del fútbol.'
  },
  {
    icon: Users,
    title: 'Ambiente Familiar',
    description: 'Un entorno seguro y acogedor donde cada jugador es parte de nuestra gran familia.'
  },
  {
    icon: Target,
    title: 'Desarrollo Integral',
    description: 'Nos enfocamos en el crecimiento técnico, táctico y personal de cada participante.'
  },
  {
    icon: Heart,
    title: 'Pasión por el Fútbol',
    description: 'Transmitimos los valores del deporte: respeto, trabajo en equipo y superación.'
  }
]

export function AboutSection() {
  return (
    <section id="informacion" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sobre el <span className="text-gradient">CD Onda</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fundado en 1944, el Club Deportivo Onda es una institución emblemática del fútbol valenciano. 
            Con más de 75 años de historia, nos dedicamos a formar jugadores y personas, 
            transmitiendo valores y pasión por el deporte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg"
        >
          <h3 className="text-3xl font-bold mb-6 text-center">¿Qué incluye el Campus?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Entrenamiento técnico y táctico diario</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Partidos y torneos entre equipos</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Actividades recreativas y juegos</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Camiseta oficial del Campus 2025</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Material deportivo incluido</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Seguro de accidentes deportivos</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Diploma de participación</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></div>
                <p className="text-gray-700">Fotos y recuerdos del campus</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

