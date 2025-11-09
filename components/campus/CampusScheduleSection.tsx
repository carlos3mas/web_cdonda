'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

const schedule = [
  { time: '9:00 - 9:30', activity: 'Recepción y Bienvenida', description: 'Llegada, control de asistencia y activación ligera' },
  { time: '9:30 - 10:45', activity: 'Entrenamiento Técnico', description: 'Fundamentos, control, pase y finalización por grupos' },
  { time: '10:45 - 11:15', activity: 'Almuerzo', description: 'Descanso, hidratación y bocadillo' },
  { time: '11:15 - 12:30', activity: 'Partidos y Juegos', description: 'Competencias adaptadas por edades y dinámicas colectivas' },
  { time: '12:30 - 13:00', activity: 'Actividades Recreativas', description: 'Retos, juegos cooperativos y vuelta a la calma' },
]

export function CampusScheduleSection() {
  return (
    <section id="campus-horario" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-600">Horario</span> <span className="text-red-600">Diario</span>
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
y              <Card className="border border-red-100 bg-white/95 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center">
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-red-600">{item.activity}</h3>
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
          className="mt-16"
        >
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-10 py-6 text-center text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <p className="text-sm text-white/90">
              <strong>Nota:</strong> El horario puede verse ajustado por condiciones meteorológicas o actividades especiales.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

