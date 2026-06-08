'use client'

import { PartidosCarousel } from './PartidosCarousel'

export function PrimerEquipoMatchesSection() {
  return (
    <section id="primer-equipo-partidos" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <PartidosCarousel />
      </div>
    </section>
  )
}
