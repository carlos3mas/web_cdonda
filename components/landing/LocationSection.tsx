'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Users, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'

export function LocationSection() {
  const { t } = useI18n()
  
  return (
    <section id="instalaciones" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-600 font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            {t('location.nuestrasInstalacionesTitle')} <span className="text-gradient">{t('location.nuestrasInstalacionesSubtitle')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('location.instalacionesDesc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden h-full">
              <div className="aspect-video relative bg-gradient-to-br from-red-500 to-red-700 overflow-hidden">
                <Image
                  src="/images/campos/enrique-saura.webp"
                  alt="Campo Municipal Enrique Saura Gil - Vista aérea del complejo deportivo con campo de fútbol y velódromo"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={75}
                />
                
              </div>
              <CardContent className="p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-red-600">{t('location.campoEnriqueSaura')}</h3>
                <div className="space-y-2 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <strong className="text-blue-600">{t('location.direccion')}:</strong>{' '}
                    <a
                      href="https://www.google.com/maps?q=Calle+Torrechiva+2,+12200+Onda,+Castellón"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline transition-colors break-words"
                    >
                      Calle Torrechiva 2, 12200 Onda (Castellón)
                    </a>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong className="text-blue-600">{t('location.terreno')}:</strong> {t('location.cespedArtificial')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong className="text-blue-600">{t('location.capacidad')}:</strong> {t('location.masDe5000')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong className="text-blue-600">{t('location.medidas')}:</strong> {t('location.medidasEnrique')}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                  {t('location.descripcionEnrique')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden h-full">
              <div className="aspect-video relative bg-gradient-to-br from-gray-600 to-gray-800 overflow-hidden">
                <Image
                  src="/images/campos/la-cossa.webp"
                  alt="Campo Municipal La Cossa"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={75}
                />
              </div>
              <CardContent className="p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-red-600">{t('location.campoLaCossa')}</h3>
                <div className="space-y-2 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    <strong className="text-blue-600">{t('location.direccion')}:</strong>{' '}
                    <a
                      href="https://www.google.com/maps?q=Calle+San+Fermín+s/n,+12200+Onda,+Castellón"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline transition-colors break-words"
                    >
                      Calle San Fermín s/n, 12200 Onda (Castellón)
                    </a>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong className="text-blue-600">{t('location.terreno')}:</strong> {t('location.cespedArtificial')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong className="text-blue-600">{t('location.capacidad')}:</strong> {t('location.aproximadamente1500')}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong className="text-blue-600">{t('location.medidas')}:</strong> {t('location.medidasLaCossa')}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">
                  {t('location.descripcionLaCossa')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-b from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white p-6 sm:p-8 md:p-12 shadow-[0_18px_45px_rgba(139,0,0,0.35)]"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6 md:mb-8 text-center px-2">
           {t('location.informacionContacto')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <MapPin className="h-8 w-8 md:h-9 md:w-9 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2 text-sm md:text-base">{t('location.direccion')}</h4>
              <p className="text-white/80 text-xs md:text-sm">
                {t('location.campoLaCossa')}<br />
                <a
                  href="https://www.google.com/maps?q=Calle+San+Fermín+s/n,+12200+Onda,+Castellón"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-blue-100 hover:underline transition-colors break-all"
                >
                  Calle San Fermín s/n, 12200 Onda (Castellón)
                </a>
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Clock className="h-8 w-8 md:h-9 md:w-9 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2 text-sm md:text-base">{t('location.horario')}</h4>
              <p className="text-white/80 text-xs md:text-sm">
                {t('location.horarioContacto').split('\n')[0]}<br />
                {t('location.horarioContacto').split('\n')[1]}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Phone className="h-8 w-8 md:h-9 md:w-9 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2 text-sm md:text-base">{t('location.telefono')}</h4>
              <p className="text-white/80 text-xs md:text-sm">
                <a href="tel:608337444" className="text-blue-200 hover:text-blue-100 hover:underline transition-colors">
                  608 337 444
                </a>
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                <Mail className="h-8 w-8 md:h-9 md:w-9 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2 text-sm md:text-base">{t('location.email')}</h4>
              <p className="text-white/80 text-xs md:text-sm break-all">
                <a href="mailto:escolafut@gmail.com" className="text-blue-200 hover:text-blue-100 hover:underline transition-colors">
                  escolafut@gmail.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

