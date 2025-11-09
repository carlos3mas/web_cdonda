'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

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
  const duplicatedSponsors = [...sponsors, ...sponsors]

  return (
    <section id="patrocinadores" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-blue-600">Nuestros</span> <span className="text-red-600">Patrocinadores</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Aliados que impulsan proyectos, cantera y sueños del CD Onda.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h4 className="text-sm uppercase tracking-[0.35em] text-blue-600 mb-6">
            Patrocinadores principales
          </h4>
          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div className="rounded-3xl border border-red-100 bg-white h-52 md:h-64 flex flex-col items-center justify-center shadow-sm md:mt-6">
              <span className="text-xs uppercase tracking-[0.3em] text-blue-600">Logo 1</span>
            </div>
            <div className="rounded-3xl border border-red-100 bg-white h-52 md:h-64 flex flex-col items-center justify-center shadow-sm">
              <span className="text-xs uppercase tracking-[0.3em] text-blue-600">Logo 2</span>
            </div>
            <div className="rounded-3xl border border-red-100 bg-white h-52 md:h-64 flex flex-col items-center justify-center shadow-sm md:mt-6">
              <span className="text-xs uppercase tracking-[0.3em] text-blue-600">Logo 3</span>
            </div>
          </div>
        </motion.div>

        <div className="relative mt-12">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/70 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/70 to-transparent" />
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
                className="flex-shrink-0 w-48 h-28 flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white text-center shadow-sm"
              >
                <span className="text-3xl mb-2">{sponsor.logo}</span>
                <h5 className="text-sm font-semibold text-red-600">{sponsor.name}</h5>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16"
        >
          <div className="rounded-3xl border border-red-100 bg-white/90 px-6 py-5 text-center shadow-sm">
            <p className="text-sm text-gray-600">
              ¿Quieres colaborar con el club y convertirte en patrocinador?
              <a href="#contacto" className="ml-1 font-semibold text-red-600 hover:text-red-500">
                Escríbenos
              </a>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <div className="rounded-3xl bg-gradient-to-r from-[#b10c0c] via-[#d02121] to-[#8f0909] px-6 py-8 md:px-10 text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative h-20 w-32 md:h-24 md:w-40">
                <Image
                  src="/images/logos/ayuntamiento-onda.png"
                  alt="Ayuntamiento de Onda"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">Agradecimiento especial</p>
              <p className="text-sm text-white/85 max-w-2xl">
                Con el respaldo del Ayuntamiento de Onda seguimos elevando nuestras instalaciones, proyectos de cantera y programas sociales.
                Compartimos la ilusión de hacer del deporte un orgullo para toda la ciudad.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


