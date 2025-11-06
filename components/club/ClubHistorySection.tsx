'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, Heart, Award } from 'lucide-react'

const achievements = [
  {
    year: '1921',
    title: 'Fundación del Club',
    description: 'Nace el Club Deportivo Onda. Hasta 1950 el club pasó por diversas denominaciones y nunca sobrepasó las divisiones regionales.'
  },
  {
    year: '1955-56',
    title: 'Primer Ascenso a Tercera División',
    description: 'El club consigue su primer gran hito al ascender a Tercera División, permaneciendo en esta categoría durante 14 temporadas consecutivas hasta 1969/70.'
  },
  {
    year: '1988-89',
    title: 'Regreso a Tercera División',
    description: 'Tras casi 20 años en regionales, el CD Onda vuelve a Tercera División. Desde entonces se ha mantenido en esta categoría salvo breves descensos.'
  },
  {
    year: '2001-02',
    title: 'Ascenso a Segunda División B',
    description: 'El mayor hito de la historia del club: ascenso a la categoría de bronce del fútbol español tras proclamarse campeón de su liguilla.'
  },
  {
    year: '2008',
    title: 'Estreno del Himno del Club',
    description: 'Bajo la presidencia de Juan Carlos Ten, se estrena el himno del club con música y letra de Joan Castells Badenes.'
  },
  {
    year: 'Actualidad',
    title: 'Formación, Valores y Modernización',
    description: 'El CD Onda continúa su legado formando jugadores y personas, con modernas instalaciones y una sólida cantera.'
  }
]

const values = [
  {
    icon: Trophy,
    title: 'Excelencia',
    description: 'Buscamos la mejora continua en cada entrenamiento'
  },
  {
    icon: Users,
    title: 'Trabajo en Equipo',
    description: 'El éxito es resultado del esfuerzo colectivo'
  },
  {
    icon: Heart,
    title: 'Pasión',
    description: 'Vivimos el fútbol con intensidad y dedicación'
  },
  {
    icon: Award,
    title: 'Compromiso',
    description: 'Con nuestros jugadores, familias y la ciudad'
  }
]

export function ClubHistorySection() {
  return (
    <section id="club" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Historia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestra <span className="text-gradient">Historia</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Desde 1921, el CD Onda ha sido mucho más que un club de fútbol. 
            Con más de 100 años de historia, hemos vivido momentos inolvidables como 
            nuestro ascenso a Segunda División B en 2002, el mayor hito deportivo del club. 
            Somos una institución que ha formado generaciones de deportistas y ha sido 
            testigo de la evolución del fútbol en nuestra región.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-20">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex gap-6 mb-8 items-start"
            >
              <div className="flex-shrink-0 w-32">
                <div className="text-2xl font-bold text-red-600">{achievement.year}</div>
              </div>
              <Card className="flex-1">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <p className="text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestros <span className="text-gradient">Valores</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Los principios que nos guían cada día
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-red-600" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.description}</p>
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

