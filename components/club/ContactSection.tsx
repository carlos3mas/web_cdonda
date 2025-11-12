'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function ContactSection() {
  const { t } = useI18n()
  
  const contactDetails = [
    {
      icon: MapPin,
      label: t('contact.direccion'),
      content: (
        <>
          {t('contact.campoLaCossa')}
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
      label: t('contact.telefono'),
      content: (
        <a href="tel:608337444" className="text-blue-600 hover:text-blue-500 font-semibold">
          608 337 444
        </a>
      )
    },
    {
      icon: Mail,
      label: t('contact.correoElectronico'),
      content: (
        <a href="mailto:escolafut@gmail.com" className="text-blue-600 hover:text-blue-500 font-semibold">
          escolafut@gmail.com
        </a>
      )
    },
    {
      icon: Clock,
      label: t('contact.horario'),
      content: (
        <>
          {t('contact.lunesAViernes')}
          <br />
          {t('contact.horarioContacto')}
        </>
      )
    }
  ]
  
  return (
    <section id="contacto" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('contact.contacto')}</span> <span className="text-red-600">{t('contact.cdo')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('contact.descripcion')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 items-start"
        >
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {contactDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-2 sm:gap-3 md:gap-4"
                >
                  <span className="mt-0.5 sm:mt-1 flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-red-600 mb-0.5 sm:mb-1">{detail.label}</h3>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed mt-0.5 sm:mt-1 break-words">{detail.content}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(25,25,25,0.15)] w-full h-[280px] sm:h-[320px] md:h-[360px]">
            <iframe
              title="Ubicación CD Onda"
              src="https://www.google.com/maps?q=Calle+San+Ferm%C3%ADn+s/n,+12200+Onda,+Castell%C3%B3n&output=embed"
              width="100%"
              height="100%"
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

