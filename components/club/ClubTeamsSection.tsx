'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Baby, School, GraduationCap, Heart } from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const categories = [
  {
    icon: Baby,
    title: 'Chupetines',
    age: '3-4 años',
    description: 'Primeros pasos en el fútbol con actividades lúdicas',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Baby,
    title: 'Querubines',
    age: '4-5 años',
    description: 'Estimulación temprana y coordinación motriz',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Baby,
    title: 'Prebenjamín',
    age: '6-7 años',
    description: 'Iniciación al fútbol a través del juego',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: School,
    title: 'Benjamín',
    age: '8-9 años',
    description: 'Desarrollo de habilidades básicas',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: School,
    title: 'Alevín',
    age: '10-11 años',
    description: 'Fundamentos técnicos y trabajo en equipo',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: School,
    title: 'Infantil',
    age: '12-13 años',
    description: 'Consolidación técnico-táctica',
    color: 'bg-teal-100 text-teal-600'
  },
  {
    icon: GraduationCap,
    title: 'Cadete',
    age: '14-15 años',
    description: 'Perfeccionamiento táctico y físico',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: GraduationCap,
    title: 'Juvenil',
    age: '16-18 años',
    description: 'Preparación para el fútbol senior',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: Users,
    title: 'Amateur',
    age: '18+ años',
    description: 'Fútbol amateur y veteranos',
    color: 'bg-gray-100 text-gray-600'
  },
  {
    icon: Users,
    title: 'Veteranos',
    age: '35+ años',
    description: 'Fútbol para veteranos y aficionados',
    color: 'bg-slate-100 text-slate-600'
  },
  {
    icon: Heart,
    title: 'EDI',
    age: 'Todas las edades',
    description: 'Equipo inclusivo para personas con discapacidad',
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    icon: Users,
    title: 'Primer Equipo',
    age: 'Sénior',
    description: 'Competición en ligas regionales',
    color: 'bg-red-100 text-red-600'
  }
]

export function ClubTeamsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros <span className="text-gradient">Equipos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Contamos con equipos en todas las categorías, desde los más pequeños 
            hasta el primer equipo. Una cantera sólida que forma jugadores y personas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <div className="text-sm font-semibold text-red-600">{category.age}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{category.description}</p>
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
          className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <AnimatedCounter end={22} duration={2000} />
              <div className="text-gray-700 mt-2">Equipos en competición</div>
            </div>
            <div>
              <AnimatedCounter end={380} duration={2000} />
              <div className="text-gray-700 mt-2">Jugadores federados</div>
            </div>
            <div>
              <AnimatedCounter end={30} duration={2000} />
              <div className="text-gray-700 mt-2">Entrenadores titulados</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

