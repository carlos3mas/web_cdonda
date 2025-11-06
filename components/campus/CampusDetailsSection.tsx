'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Users, MapPin, Euro } from 'lucide-react'

const details = [
  {
    icon: Calendar,
    title: 'Fechas',
    info: ['Del 23 al 30 de Diciembre', '2025'],
    highlight: '8 días de campus'
  },
  {
    icon: Clock,
    title: 'Horario',
    info: ['Lunes a Viernes', '9:00h - 14:00h'],
    highlight: '5 horas diarias'
  },
  {
    icon: Users,
    title: 'Edades',
    info: ['De 6 a 14 años', 'Grupos por edades'],
    highlight: 'Máx. 20 por grupo'
  },
  {
    icon: MapPin,
    title: 'Lugar',
    info: ['Campo Municipal', 'Onda, Castellón'],
    highlight: 'Instalaciones de primer nivel'
  },
  {
    icon: Euro,
    title: 'Precio',
    info: ['120€ por participante', 'Descuentos para hermanos'],
    highlight: 'Todo incluido'
  }
]

export function CampusDetailsSection() {
  return (
    <section id="campus-info" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Información <span className="text-gradient">Práctica</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Todo lo que necesitas saber antes de inscribirte
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {details.map((detail, index) => {
            const Icon = detail.icon
            return (
              <motion.div
                key={detail.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-red-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-3">{detail.title}</h3>
                    <div className="space-y-1 mb-3">
                      {detail.info.map((line, i) => (
                        <p key={i} className="text-sm text-gray-600">{line}</p>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-red-600">{detail.highlight}</p>
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
          className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center"
        >
          <p className="text-blue-800">
            <strong>💡 Descuento Hermanos:</strong> 10% de descuento para el segundo hermano y siguientes
          </p>
        </motion.div>
      </div>
    </section>
  )
}

