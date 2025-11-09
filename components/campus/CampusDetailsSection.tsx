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
            <span className="text-blue-600">Información</span> <span className="text-red-600">Práctica</span>
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
                <Card className="h-full text-center border border-red-100 bg-white/95 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-center">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg text-red-600">{detail.title}</h3>
                    <div className="space-y-1">
                      {detail.info.map((line, i) => (
                        <p key={i} className="text-sm text-gray-600">{line}</p>
                      ))}
                    </div>
                    <span className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 uppercase tracking-wide">
                      {detail.highlight}
                    </span>
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
          className="mt-16"
        >
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-12 py-10 text-center text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <p className="text-xs uppercase tracking-[0.45em] text-white/70">Descuento especial</p>
            <p className="mt-3 text-sm text-white/90">
              <span className="font-semibold">Hermanos:</span> 10% en la segunda inscripción y siguientes. Consulta opciones personalizadas para clubes y grupos.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

