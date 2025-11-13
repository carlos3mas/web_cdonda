'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface AutoCarouselProps {
  images: string[]
  alt: string
  interval?: number // en milisegundos
  className?: string
}

export function AutoCarousel({ images, alt, interval = 4000, className = '' }: AutoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Indicadores de posición */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

