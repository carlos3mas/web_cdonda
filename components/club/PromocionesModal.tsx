'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gift, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function PromocionesModal() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Mostrar el modal después de un pequeño delay al cargar la página
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleContactar = () => {
    setIsOpen(false)
    // Scroll suave a la sección de contacto
    setTimeout(() => {
      const element = document.getElementById('contacto')
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-full p-0 gap-0 overflow-hidden !border-0 bg-transparent shadow-2xl">
        <DialogTitle className="sr-only">{t('promocionesModal.titulo')}</DialogTitle>
        <DialogDescription className="sr-only">{t('promocionesModal.descripcion')}</DialogDescription>
        <div className="relative bg-gradient-to-br from-white via-red-50 to-white rounded-2xl overflow-hidden">
          {/* Decoración navideña superior - adornos colgantes */}
          <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 z-20 pointer-events-none overflow-visible">
            <div className="flex items-start justify-around w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="relative"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    y: { duration: 0.5, delay: i * 0.1 },
                    opacity: { duration: 0.5, delay: i * 0.1 },
                    rotate: {
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                >
                  {/* Cable */}
                  <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2"
                    style={{
                      width: '1px',
                      height: '8px',
                      background: '#1a1a1a',
                    }}
                  />
                  {/* Adorno */}
                  <div 
                    className="rounded-full mt-2"
                    style={{
                      width: i % 3 === 0 ? '12px' : i % 2 === 0 ? '10px' : '14px',
                      height: i % 3 === 0 ? '12px' : i % 2 === 0 ? '10px' : '14px',
                      background: i % 3 === 0 ? '#dc2626' : i % 2 === 0 ? '#fbbf24' : '#16a34a',
                      boxShadow: `0 2px 8px ${i % 3 === 0 ? '#dc2626' : i % 2 === 0 ? '#fbbf24' : '#16a34a'}`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Botón de cerrar personalizado */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label={t('promocionesModal.cerrar')}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 p-1.5 sm:p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">{t('promocionesModal.cerrar')}</span>
          </button>

          {/* Contenido principal - Grid de dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 pt-10 sm:pt-12 md:pt-16">
            {/* Columna izquierda - Contenido */}
            <div className="bg-white p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center relative overflow-hidden min-h-[280px] sm:min-h-[350px] md:min-h-[400px]">
              {/* Imagen del árbol de navidad de fondo */}
              <div className="absolute inset-0 pointer-events-none opacity-40 -top-10 sm:-top-12">
                <Image
                  src="/images/promociones/arbol-navidad.webp"
                  alt="Árbol de Navidad"
                  fill
                  className="object-contain object-center"
                  sizes="50vw"
                  style={{ filter: 'saturate(1.2) brightness(1.1)' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Copos de nieve decorativos en el fondo */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-red-600 text-4xl"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    ❄
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6"
                >
                  <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>LOTERÍA DE NAVIDAD 2025</span>
                </motion.div>

                {/* Título principal */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black mb-3 sm:mb-4 leading-tight"
                >
                  <span className="text-red-600">LOTERÍA DE</span>
                  <br />
                  <span className="text-gray-900">NAVIDAD 2025</span>
                </motion.h2>

                {/* Descripción */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed"
                >
                  {t('promociones.comprarDecimo')}
                </motion.p>

                {/* Botón de contacto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={handleContactar}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-4 sm:px-8 sm:py-5 text-sm sm:text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    size="lg"
                  >
                    {t('promocionesModal.contactanos')}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Columna derecha - Imagen del décimo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-red-600 to-red-700 p-4 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center min-h-[250px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px]"
            >
              {/* Decoración de fondo eliminada */}

              {/* Imagen del décimo con marco decorativo */}
              <div className="absolute inset-0 z-10">
                <div className="relative">
                  
                  {/* Composición solapada ocupando todo el panel rojo */}
                  <div className="absolute inset-0">
                      {/* Décimo Navidad (arriba-izquierda, rotado) */}
                      <div className="absolute left-3 sm:left-4 md:left-6 top-28 sm:top-40 md:top-52 translate-y-2 sm:translate-y-4 w-[78%] sm:w-[68%] md:w-[60%] rotate-[-6deg] z-20 drop-shadow-2xl">
                        <div className="relative aspect-[3/2] rounded-lg sm:rounded-xl overflow-hidden bg-white">
                          <Image
                            src="/images/promociones/decimo-navidad.webp"
                            alt={t('promociones.decimoNavidadAlt')}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 85vw, 45vw"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                      </div>

                      {/* Décimo Niño (abajo-derecha, rotado) */}
                      <div className="absolute right-3 sm:right-4 md:right-6 -bottom-20 sm:-bottom-28 md:-bottom-36 translate-y-12 sm:translate-y-16 md:translate-y-20 w-[78%] sm:w-[68%] md:w-[60%] rotate-[4deg] z-10 drop-shadow-2xl">
                        <div className="relative aspect-[3/2] rounded-lg sm:rounded-xl overflow-hidden bg-white">
                          <Image
                            src="/images/promociones/decimo-niño.webp"
                            alt={t('promociones.decimoNinoAlt')}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 90vw, (max-width: 768px) 85vw, 45vw"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        
                      </div>
                    </div>

                  {/* Decoración navideña eliminada */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

