'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'

interface KitImage {
  src: string
  alt: string
}

interface Kit {
  name: string
  description: string
  image: KitImage
}

function KitCard({ kit, priority }: { kit: Kit; priority?: boolean }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
        <Image
          src={kit.image.src}
          alt={kit.image.alt}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          quality={75}
        />
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-1 sm:mb-2">{kit.name}</h3>
        <p className="text-sm sm:text-base text-gray-600">{kit.description}</p>
      </div>
    </div>
  )
}

export function ClubKitsSection() {
  const { t } = useI18n()
  
  const kits: Kit[] = [
    {
      name: t('kits.primeraEquipacion'),
      description: t('kits.primeraEquipacionDesc'),
      image: {
        src: '/images/kits/primera-chico.jpg',
        alt: t('kits.primeraEquipacionAlt') + ' - Chico'
      }
    },
    {
      name: t('kits.segundaEquipacion'),
      description: t('kits.segundaEquipacionDesc'),
      image: {
        src: '/images/kits/segunda-chica.jpg',
        alt: t('kits.segundaEquipacionAlt') + ' - Chica'
      }
    }
  ]

  return (
    <section id="equipajes" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('kits.nuestros')}</span> <span className="text-gradient">{t('kits.equipajes')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('kits.descripcion')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {kits.map((kit, kitIndex) => (
            <motion.div
              key={kit.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: kitIndex * 0.2 }}
            >
              <KitCard kit={kit} priority={kitIndex === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

