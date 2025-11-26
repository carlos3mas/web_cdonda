'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function PromocionesSection() {
  const { t } = useI18n()

  const decimos = [
    {
      id: 'decimo-navidad',
      image: '/images/promociones/decimo-navidad.webp',
      alt: t('promociones.decimoNavidadAlt')
    }
  ]

  return (
    <section id="promociones" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('promociones.nuestrasPromocionesTitle')}</span>{' '}
            <span className="text-red-600">{t('promociones.nuestrasPromocionesSubtitle')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('promociones.descripcion')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16"
        >
          {decimos.map((decimo, index) => (
            <motion.div
              key={decimo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative w-full flex justify-center"
            >
              <div className="relative w-full max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                <Image
                  src={decimo.image}
                  alt={decimo.alt}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 70vw"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 max-w-2xl mx-auto px-3">
            {t('promociones.comprarDecimo')}
          </p>
          <a href="#contacto">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base sm:text-lg"
              size="lg"
            >
              {t('promociones.contactar')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

