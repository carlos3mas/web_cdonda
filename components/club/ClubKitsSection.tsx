'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'
import { useEffect, useState } from 'react'

interface KitImage {
  src: string
  alt: string
}

interface Kit {
  name: string
  description: string
  images: KitImage[]
}

function KitCarousel({ kit, kitId }: { kit: Kit; kitId: number }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Carrusel automático que cambia cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % kit.images.length)
    }, 10000) // 10 segundos

    return () => clearInterval(interval)
  }, [kit.images.length])

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${kitId}-${currentImageIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={kit.images[currentImageIndex].src}
              alt={kit.images[currentImageIndex].alt}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={kitId === 0 && currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Indicadores de imagen */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {kit.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentImageIndex === index
                  ? 'w-8 bg-white shadow-md'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Imagen ${index + 1} de ${kit.name}`}
            />
          ))}
        </div>
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
      images: [
        {
          src: '/images/kits/primera-chico.jpg',
          alt: t('kits.primeraEquipacionAlt') + ' - Chico'
        },
      ]
    },
    {
      name: t('kits.segundaEquipacion'),
      description: t('kits.segundaEquipacionDesc'),
      images: [
        {
          src: '/images/kits/segunda-chica.jpg',
          alt: t('kits.segundaEquipacionAlt') + ' - Chica'
        },
       
      ]
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
              <KitCarousel kit={kit} kitId={kitIndex} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

