'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Users,
  Baby,
  School,
  GraduationCap,
  Heart,
  Sparkles,
  Flag,
  Shield,
  Rocket,
  Award,
  Stars,
  Crown
} from 'lucide-react'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const categories = [
  {
    icon: Baby,
    title: 'Chupetines',
    age: '3-4 años',
    description: 'Primeros pasos en el fútbol con actividades lúdicas',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Sparkles,
    title: 'Querubines',
    age: '4-5 años',
    description: 'Estimulación temprana y coordinación motriz',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Flag,
    title: 'Prebenjamín',
    age: '6-7 años',
    description: 'Iniciación al fútbol a través del juego',
    iconSize: 'h-9 w-9'
  },
  {
    icon: School,
    title: 'Benjamín',
    age: '8-9 años',
    description: 'Desarrollo de habilidades básicas',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Shield,
    title: 'Alevín',
    age: '10-11 años',
    description: 'Fundamentos técnicos y trabajo en equipo',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Rocket,
    title: 'Infantil',
    age: '12-13 años',
    description: 'Consolidación técnico-táctica',
    iconSize: 'h-9 w-9'
  },
  {
    icon: GraduationCap,
    title: 'Cadete',
    age: '14-15 años',
    description: 'Perfeccionamiento táctico y físico',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Award,
    title: 'Juvenil',
    age: '16-18 años',
    description: 'Preparación para el fútbol senior',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Users,
    title: 'Amateur',
    age: '18+ años',
    description: 'Fútbol amateur',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Heart,
    title: 'Veteranos',
    age: '35+ años',
    description: 'Fútbol para veteranos y aficionados',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Stars,
    title: 'EDI',
    age: 'Todas las edades',
    description: 'Equipo inclusivo ',
    iconSize: 'h-9 w-9'
  },
  {
    icon: Crown,
    title: 'Primer Equipo',
    age: 'Sénior',
    description: 'Rendimiento en ligas regionales',
    iconSize: 'h-9 w-9'
  }
]

export function ClubTeamsSection() {
  return (
    <section id="equipos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-600">Nuestros</span> <span className="text-red-600">Equipos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Contamos con 37 equipos en la escuela, presentes en todas las categorías desde los más pequeños hasta el primer equipo.
            Una cantera sólida que forma jugadores y personas.
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
                <Card className="h-full border border-red-100 bg-white/95 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                      <Icon className={`text-blue-600 ${category.iconSize}`} />
                    </span>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-red-600">{category.title}</h3>
                      <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {category.age}
                      </span>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
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
          className="rounded-2xl bg-gradient-to-b from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white p-8 md:p-12 shadow-[0_18px_45px_rgba(139,0,0,0.35)]"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <AnimatedCounter end={31} duration={2000} className="text-white" />
              <div className="text-white/90 mt-2">Equipos en competición</div>
            </div>
            <div>
              <AnimatedCounter end={612} duration={2000} className="text-white" />
              <div className="text-white/90 mt-2">Jugadores federados</div>
            </div>
            <div>
              <AnimatedCounter end={40} duration={2000} className="text-white" />
              <div className="text-white/90 mt-2">Entrenadores titulados</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

