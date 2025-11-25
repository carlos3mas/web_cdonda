'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface AutoCarouselProps {
  images: string[]
  alt: string
  interval?: number // en milisegundos
  className?: string
  priority?: boolean
}

export function AutoCarousel({ images, alt, interval = 4000, className = '', priority = false }: AutoCarouselProps) {
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
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          quality={75}
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <AnimatePresence mode="sync" initial={false}>
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
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            quality={75}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Precargar las siguientes imágenes */}
      {images.map((src, index) => {
        if (index === currentIndex) return null
        return (
          <link 
            key={src} 
            rel="prefetch" 
            as="image" 
            href={src}
          />
        )
      })}
    </div>
  )
}

