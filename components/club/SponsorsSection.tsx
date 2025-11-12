'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

const sponsors = [
  { name: 'Sponsor 1', logo: '🏢' },
  { name: 'Sponsor 2', logo: '🏪' },
  { name: 'Sponsor 3', logo: '🏭' },
  { name: 'Sponsor 4', logo: '🏛️' },
  { name: 'Sponsor 5', logo: '🏦' },
  { name: 'Sponsor 6', logo: '🏨' },
  { name: 'Sponsor 7', logo: '🏬' },
  { name: 'Sponsor 8', logo: '🏢' },
]

export function SponsorsSection() {
  const { t } = useI18n()
  const duplicatedSponsors = [...sponsors, ...sponsors]

  return (
    <section id="patrocinadores" className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('sponsors.nuestrosPatrocinadoresTitle')}</span>{' '}
            <span className="text-red-600">{t('sponsors.nuestrosPatrocinadoresSubtitle')}</span>
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('sponsors.descripcion')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h4 className="text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.35em] text-blue-600 mb-3 sm:mb-4 md:mb-6 px-2">
            {t('sponsors.patrocinadoresPrincipales')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
            <div className="rounded-2xl sm:rounded-3xl border border-red-100 bg-white h-32 sm:h-40 md:h-52 lg:h-64 flex flex-col items-center justify-center shadow-sm sm:mt-4 md:mt-6">
              <span className="text-[10px] xs:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-600">Logo 1</span>
            </div>
            <div className="rounded-2xl sm:rounded-3xl border border-red-100 bg-white h-32 sm:h-40 md:h-52 lg:h-64 flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] xs:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-600">Logo 2</span>
            </div>
            <div className="rounded-2xl sm:rounded-3xl border border-red-100 bg-white h-32 sm:h-40 md:h-52 lg:h-64 flex flex-col items-center justify-center shadow-sm sm:mt-4 md:mt-6">
              <span className="text-[10px] xs:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-blue-600">Logo 3</span>
            </div>
          </div>
        </motion.div>

        <div className="relative mt-8 sm:mt-10 md:mt-12 overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white via-white/70 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white via-white/70 to-transparent z-10" />
          <motion.div
            className="flex gap-16"
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 30,
                ease: 'linear'
              }
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="flex-shrink-0 w-36 sm:w-40 md:w-48 h-20 sm:h-24 md:h-28 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl border border-red-100 bg-white text-center shadow-sm"
              >
                <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{sponsor.logo}</span>
                <h5 className="text-xs sm:text-sm font-semibold text-red-600 px-2">{sponsor.name}</h5>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 sm:mt-12 md:mt-16"
        >
          <div className="rounded-2xl sm:rounded-3xl border border-red-100 bg-white/90 px-4 py-4 sm:px-6 sm:py-5 text-center shadow-sm">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2">
              {t('sponsors.quieresColaborar')}
              <a href="#contacto" className="ml-1 font-semibold text-red-600 hover:text-red-500 transition-colors">
                {t('sponsors.escribenos')}
              </a>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 sm:mt-12 md:mt-16"
        >
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#b10c0c] via-[#d02121] to-[#8f0909] px-5 py-6 sm:px-6 sm:py-8 md:px-10 text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
              <div className="relative h-16 w-24 sm:h-20 sm:w-32 md:h-24 md:w-40">
                <Image
                  src="/images/logos/ayuntamiento-onda.png"
                  alt="Ayuntamiento de Onda"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-[10px] xs:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/70 px-2">{t('sponsors.agradecimientoEspecial')}</p>
              <p className="text-xs sm:text-sm text-white/85 max-w-2xl px-3 leading-relaxed">
                {t('sponsors.agradecimientoTexto')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


