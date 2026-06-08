'use client'

import { ClasificacionPanel } from './ClasificacionPanel'

export function PrimerEquipoStandingsSection() {
  return (
    <section id="primer-equipo-clasificacion" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <ClasificacionPanel />
      </div>
    </section>
  )
}
