'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function LocationSection() {
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
            Nuestras <span className="text-gradient">Instalaciones</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Contamos con campos de última generación para garantizar la mejor experiencia deportiva.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden h-full">
              <div className="aspect-video bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">Campo Principal</p>
                  <p className="text-red-100">Césped artificial de última generación</p>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Campo Municipal de Fútbol</h3>
                <p className="text-gray-600">
                  Nuestro campo principal cuenta con césped artificial de última generación, 
                  iluminación profesional y gradas para espectadores. Un espacio ideal para 
                  el desarrollo de nuestros jóvenes talentos.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden h-full">
              <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold">Campos de Entrenamiento</p>
                  <p className="text-gray-200">Espacios adaptados para todas las edades</p>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Instalaciones Complementarias</h3>
                <p className="text-gray-600">
                  Disponemos de campos de entrenamiento adicionales, vestuarios equipados, 
                  zona de descanso y áreas recreativas para garantizar la comodidad de 
                  todos los participantes.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-900 text-white rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold mb-8 text-center">Información de Contacto</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Dirección</h4>
              <p className="text-gray-300 text-sm">
                Campo Municipal de Fútbol<br />
                Onda, Castellón
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Horario</h4>
              <p className="text-gray-300 text-sm">
                Lunes a Viernes<br />
                9:00 - 14:00h
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Teléfono</h4>
              <p className="text-gray-300 text-sm">
                964 77 00 00<br />
                688 00 00 00
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-gray-300 text-sm">
                info@cdonda.com<br />
                campus@cdonda.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

