'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, Gift } from 'lucide-react'
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="relative bg-gradient-to-br from-red-50 to-white">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-6 py-6 sm:px-8 sm:py-8 text-white">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <DialogTitle className="text-2xl sm:text-3xl font-bold">
                  {t('promocionesModal.titulo')}
                </DialogTitle>
              </div>
              <DialogDescription className="text-white/90 text-sm sm:text-base">
                {t('promocionesModal.descripcion')}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Contenido con imágenes */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {decimos.map((decimo, index) => (
                <motion.div
                  key={decimo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="relative aspect-[21/9] sm:aspect-[5/3] rounded-xl overflow-hidden border-2 border-red-200 shadow-md">
                    <Image
                      src={decimo.image}
                      alt={decimo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-sm sm:text-base text-gray-700 text-center mb-6 sm:mb-8">
              {t('promociones.comprarDecimo')}
            </p>

            {/* Botón */}
            <div className="flex justify-center">
              <Button
                onClick={handleContactar}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base sm:text-lg"
                size="lg"
              >
                {t('promocionesModal.contactanos')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

