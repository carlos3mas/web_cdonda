'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

const schedule = [
  { time: '9:00 - 9:30', activity: 'Recepción y Calentamiento', description: 'Llegada de participantes y preparación física' },
  { time: '9:30 - 11:00', activity: 'Entrenamiento Técnico', description: 'Fundamentos, control, pase y regate' },
  { time: '11:00 - 11:30', activity: 'Descanso y Almuerzo', description: 'Bocadillo y hidratación' },
  { time: '11:30 - 13:00', activity: 'Partidos y Juegos', description: 'Aplicación práctica en situaciones reales' },
  { time: '13:00 - 14:00', activity: 'Actividades Recreativas', description: 'Juegos, dinámicas y estiramientos' },
]

export function CampusScheduleSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Horario <span className="text-gradient">Diario</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un día típico en el Campus de Navidad
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {schedule.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{item.activity}</h3>
                        <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">
            <strong>Nota:</strong> El horario puede sufrir ligeras modificaciones según las condiciones meteorológicas
          </p>
        </motion.div>
      </div>
    </section>
  )
}

