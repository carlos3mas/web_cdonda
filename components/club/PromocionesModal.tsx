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
      <DialogContent className="max-w-4xl w-11/12 p-0 gap-0 overflow-hidden !border-0 bg-transparent shadow-2xl">
        <DialogTitle className="sr-only">{t('promocionesModal.titulo')}</DialogTitle>
        <DialogDescription className="sr-only">{t('promocionesModal.descripcion')}</DialogDescription>
        <div className="relative bg-gradient-to-br from-white via-red-50 to-white rounded-2xl overflow-hidden">
          {/* Decoración y botón de cerrar ... */}
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
                  <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2"
                    style={{ width: '1px', height: '8px', background: '#1a1a1a' }}
                  />
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
          <button
            onClick={() => setIsOpen(false)}
            aria-label={t('promocionesModal.cerrar')}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 p-1.5 sm:p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">{t('promocionesModal.cerrar')}</span>
          </button>

          {/* Contenido principal - Grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 pt-12 md:pt-16">
            {/* Columna izquierda - Contenido */}
            <div className="bg-white p-6 md:p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden min-h-[320px] md:min-h-[450px]">
              {/* ... contenido de texto ... */}
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold mb-4"
                >
                  <Gift className="h-4 w-4" />
                  <span>LOTERÍA DE NAVIDAD 2025</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight"
                >
                  <span className="text-red-600">LOTERÍA DE</span>
                  <br />
                  <span className="text-gray-900">NAVIDAD 2025</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base text-gray-600 mb-6 leading-relaxed"
                >
                  {t('promociones.comprarDecimo')}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button
                    onClick={handleContactar}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg transition-transform transform hover:scale-105"
                    size="lg"
                  >
                    {t('promocionesModal.contactanos')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Columna derecha - Imagen del décimo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-red-600 to-red-700 p-6 flex items-center justify-center min-h-[300px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[560px] overflow-hidden"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full max-w-[560px] md:max-w-[520px] lg:max-w-[560px]">
                  <motion.div
                    className="absolute top-[2%] left-[6%] w-[72%] sm:top-[5%] sm:left-[8%] sm:w-[76%] md:top-[8%] md:left-[10%] md:w-[72%] z-10"
                    initial={{ opacity: 0, x: -50, rotate: -12 }}
                    animate={{ opacity: 1, x: 0, rotate: -8 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  >
                    <div className="relative aspect-[5/3] drop-shadow-2xl">
                      <Image src="/images/promociones/decimo-navidad.webp" alt={t('promociones.decimoNavidadAlt')} fill className="object-contain rounded-lg" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 560px" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-[2%] right-[6%] w-[68%] sm:bottom-[5%] sm:right-[8%] sm:w-[72%] md:bottom-[8%] md:right-[10%] md:w-[70%] z-20"
                    initial={{ opacity: 0, x: 50, rotate: 12 }}
                    animate={{ opacity: 1, x: 0, rotate: 8 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  >
                    <div className="relative aspect-[5/3] drop-shadow-2xl">
                      <Image src="/images/promociones/decimo-niño.webp" alt={t('promociones.decimoNinoAlt')} fill className="object-contain rounded-lg" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 560px" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

