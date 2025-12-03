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
    ,
    {
      id: 'decimo-nino',
      image: '/images/promociones/decimo-niño.webp',
      alt: t('promociones.decimoNinoAlt')
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
          className="max-w-5xl mx-auto mb-10 sm:mb-12 md:mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {decimos.map((decimo, index) => (
              <motion.div
                key={decimo.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl sm:rounded-2xl border border-red-100 bg-white shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                  <Image
                    src={decimo.image}
                    alt={decimo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 500px"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                  <span className="inline-block text-xs sm:text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    {decimo.alt}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
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

