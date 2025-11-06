'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Dirección',
    details: ['Campo Municipal de Fútbol "La Cossa"', 'Onda, Castellón']
  },
  {
    icon: Phone,
    title: 'Teléfono',
    details: ['964 77 00 00', '688 00 00 00']
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@cdonda.com', 'campus@cdonda.com']
  },
  {
    icon: Clock,
    title: 'Horario',
    details: ['Lunes a Viernes', '17:00 - 20:00h']
  }
]

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Contacto
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            ¿Tienes alguna duda? Estamos aquí para ayudarte. Ponte en contacto con nosotros.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-white">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail) => (
                        <p key={detail} className="text-gray-300 text-sm">
                          {detail}
                        </p>
                      ))}
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
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">¿Listo para formar parte del CD Onda?</h3>
          <p className="text-xl text-red-50 mb-6 max-w-2xl mx-auto">
            Ya sea en nuestros equipos regulares o en el Campus de Navidad, 
            te esperamos para compartir la pasión por el fútbol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:964770000"
              className="inline-block px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              <Phone className="inline-block h-5 w-5 mr-2" />
              Llámanos
            </a>
            <a 
              href="mailto:info@cdonda.com"
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              <Mail className="inline-block h-5 w-5 mr-2" />
              Escríbenos
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

