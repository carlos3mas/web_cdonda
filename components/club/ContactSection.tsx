'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactDetails = [
  {
    icon: MapPin,
    label: 'Dirección',
    content: (
      <>
        Campo Municipal de Fútbol "La Cossa"
        <br />
        <a
          href="https://maps.app.goo.gl/hn2Lwe22NsmcUy4y6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-500 font-semibold"
        >
          Calle San Fermín s/n, 12200 Onda (Castellón)
        </a>
      </>
    )
  },
  {
    icon: Phone,
    label: 'Teléfono',
    content: (
      <a href="tel:608337444" className="text-blue-600 hover:text-blue-500 font-semibold">
        608 337 444
      </a>
    )
  },
  {
    icon: Mail,
    label: 'Correo electrónico',
    content: (
      <a href="mailto:escolafut@gmail.com" className="text-blue-600 hover:text-blue-500 font-semibold">
        escolafut@gmail.com
      </a>
    )
  },
  {
    icon: Clock,
    label: 'Horario',
    content: (
      <>
        Lunes a Viernes
        <br />
        17:00 - 20:00h
      </>
    )
  }
]

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-600">Contacto</span> <span className="text-red-600">CD Onda</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos a tu disposición para resolver dudas, acompañarte en el proceso de inscripción y escuchar nuevas propuestas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-2 items-start"
        >
          <div className="space-y-6">
            {contactDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-red-600">{detail.label}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mt-1">{detail.content}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(25,25,25,0.15)]">
            <iframe
              title="Ubicación CD Onda"
              src="https://www.google.com/maps?q=Calle+San+Ferm%C3%ADn+s/n,+12200+Onda,+Castell%C3%B3n&output=embed"
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

