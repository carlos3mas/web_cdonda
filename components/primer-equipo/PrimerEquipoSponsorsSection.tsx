'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import { PrimerEquipoSectionHeader } from './PrimerEquipoSectionHeader'

const mainSponsors = [
  { src: '/images/logos/ayuntamiento-onda.webp', alt: 'Ayuntamiento de Onda' },
  { src: '/images/logos/caja-rural.webp', alt: 'Caja Rural' },
  { src: '/images/logos/Diputacion-Castellon.webp', alt: 'Diputación de Castellón' },
  { src: '/images/logos/ESPORTS-LIZONDO.webp', alt: 'Esports Lizondo' },
]

export function PrimerEquipoSponsorsSection() {
  const { t } = useI18n()

  return (
    <section id="primer-equipo-patrocinadores" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <PrimerEquipoSectionHeader
          titleBlue={t('primerEquipo.patrocinadores')}
          titleRed={t('primerEquipo.patrocinadoresSub')}
          description={t('primerEquipo.patrocinadoresDesc')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {mainSponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.alt}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-xl sm:rounded-2xl border border-red-100 bg-white p-5 sm:p-6 h-32 sm:h-40 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-full max-h-24 sm:max-h-28">
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  fill
                  className="object-contain"
                  loading="lazy"
                  sizes="(max-width: 640px) 90vw, 400px"
                  quality={75}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 sm:mt-12 max-w-2xl mx-auto text-center rounded-2xl border border-red-100 bg-gray-50 px-4 py-5 sm:px-6 sm:py-6"
        >
          <p className="text-sm text-gray-600">
            {t('primerEquipo.contactoPatrocinio')}{' '}
            <Link href="/#contacto" className="font-semibold text-red-600 hover:text-red-500 transition-colors">
              {t('primerEquipo.contactoPatrocinioLink')}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
