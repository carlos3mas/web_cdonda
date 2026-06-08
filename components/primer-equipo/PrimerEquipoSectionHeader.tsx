'use client'

import { motion } from 'framer-motion'

type PrimerEquipoSectionHeaderProps = {
  titleBlue: string
  titleRed: string
  description: string
}

export function PrimerEquipoSectionHeader({
  titleBlue,
  titleRed,
  description,
}: PrimerEquipoSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-10 sm:mb-12 md:mb-16"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
        <span className="text-blue-600">{titleBlue}</span>{' '}
        <span className="text-red-600">{titleRed}</span>
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
        {description}
      </p>
    </motion.div>
  )
}
