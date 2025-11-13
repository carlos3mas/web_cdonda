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
      id: 'decimo-navidad-club',
      image: '/images/promociones/decimo-navidad-club.jpg',
      alt: t('promociones.decimoNavidadClubAlt')
    },
    {
      id: 'decimo-nino',
      image: '/images/promociones/decimo-nino.jpg',
      alt: t('promociones.decimoNinoAlt')
    }
  ]

  return (
    <section id="promociones" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {decimos.map((decimo, index) => (
              <motion.div
                key={decimo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                <div className="relative aspect-[21/9] sm:aspect-[5/3] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Image
                    src={decimo.image}
                    alt={decimo.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                  />
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

