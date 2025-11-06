'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Users, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export function LocationSection() {
  return (
    <section id="instalaciones" className="py-20 bg-white">
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
              <div className="aspect-video relative bg-gradient-to-br from-red-500 to-red-700 overflow-hidden">
                <Image
                  src="/images/campos/enrique-saura.jpg"
                  alt="Campo Municipal Enrique Saura Gil - Vista aérea del complejo deportivo con campo de fútbol y velódromo"
                  fill
                  className="object-cover"
                  priority
                />
                
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-red-600">Campo Municipal Enrique Saura Gil</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Dirección:</strong>{' '}
                    <a
                      href="https://www.google.com/maps?q=Calle+Torrechiva+2,+12200+Onda,+Castellón"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline transition-colors"
                    >
                      Calle Torrechiva 2, 12200 Onda (Castellón)
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Terreno:</strong> Césped artificial
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Capacidad:</strong> Aproximadamente 5.000 espectadores
                  </p>
                  
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Campo principal, vestuarios equipados y apto para competiciones federadas. 
                  Renombrado en honor de Enrique Saura, jugador internacional con España.
                  Está ubicado en zona accesible en Onda, con aparcamiento cercano listado entre los servicios.
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
              <div className="aspect-video relative bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                                                       
                <Image
                  src="/images/campos/la-cossa.webp"
                  alt="Campo Municipal La Cossa"
                  fill
                  className="object-cover"
                  priority
                />
                             
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3 text-red-600">Campo Municipal La Cossa</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Dirección:</strong>{' '}
                    <a
                      href="https://www.google.com/maps?q=Calle+San+Fermín+s/n,+12200+Onda,+Castellón"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline transition-colors"
                    >
                      Calle San Fermín s/n, 12200 Onda (Castellón)
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Terreno:</strong> Césped artificial
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Horario oficinas del club:</strong> 17:00-20:00h
                  </p>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Campo municipal con césped artificial para entrenamientos 
                  y actividades del club. Espacios adaptados para todas las categorías y edades.
                  Junto al campo un nuevo aparcamiento público de más de 200 plazas, con acceso directo al recinto deportivo.
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
              Campo Municipal La Cossa<br />
                <a
                  href="https://www.google.com/maps?q=Calle+San+Fermín+s/n,+12200+Onda,+Castellón"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 hover:underline transition-colors"
                >
                  Calle San Fermín s/n, 12200 Onda (Castellón)
                </a>
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Horario</h4>
              <p className="text-gray-300 text-sm">
                Lunes a Viernes<br />
                17:00 - 20:00h
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h4 className="font-semibold mb-2">Teléfono</h4>
              <p className="text-gray-300 text-sm">
                Municipal: 964 600 050<br />
                Club: 964 77 00 00
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

