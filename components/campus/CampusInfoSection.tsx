'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, Users, Trophy, Shield, Camera } from 'lucide-react'

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
    icon: Calendar,
    title: 'Planificación Completa',
    description: 'Sesiones técnicas, actividades lúdicas y dinámicas de grupo cada día'
  },
  {
    icon: Shield,
    title: 'Seguro Deportivo',
    description: 'Cobertura para jugadores federados durante el campus'
  },
  {
    icon: Camera,
    title: 'Fotos y Recuerdos',
    description: 'Reportaje fotográfico de toda la experiencia'
  },
  {
    icon: Clock,
    title: 'Atención Personalizada',
    description: 'Grupos reducidos y monitores titulados adaptados a cada edad'
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
            <span className="text-blue-600">¿Qué Incluye</span> <span className="text-red-600">el Campus?</span>
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
                <Card className="h-full border border-red-100 bg-white/95 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg text-red-600 text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm text-center">{feature.description}</p>
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-12 py-12 text-center text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <p className="text-xs uppercase tracking-[0.45em] text-white/75">Campus de Navidad CD Onda</p>
            <p className="text-2xl font-semibold text-white/95 max-w-3xl">
              Una experiencia inolvidable guiada por profesionales del club, con metodología propia y atención cercana a cada jugador.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

