'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { datosCompeticion } from '@/lib/primer-equipo/data'
import type { PartidoPrimerEquipo } from '@/lib/primer-equipo/types'
import { PrimerEquipoSectionHeader } from './PrimerEquipoSectionHeader'
import { TeamLogo } from './TeamLogo'

const CLUB_LOGO = '/images/logos/escudo-cd-onda.webp'
const CLUB_NAME = 'CD Onda'

function formatScore(partido: PartidoPrimerEquipo, t: (key: string) => string) {
  if (
    partido.finalizado &&
    partido.golesLocal != null &&
    partido.golesVisitante != null
  ) {
    const local = partido.local ? partido.golesLocal : partido.golesVisitante
    const visitante = partido.local ? partido.golesVisitante : partido.golesLocal
    return `${local} - ${visitante}`
  }
  return t('primerEquipo.vs')
}

function MatchCard({ partido, t }: { partido: PartidoPrimerEquipo; t: (key: string) => string }) {
  const homeName = partido.local ? CLUB_NAME : partido.rival
  const awayName = partido.local ? partido.rival : CLUB_NAME
  const homeLogo = partido.local ? CLUB_LOGO : partido.rivalLogo
  const awayLogo = partido.local ? partido.rivalLogo : CLUB_LOGO

  return (
    <article className="snap-center flex-shrink-0 w-[min(85vw,280px)] sm:w-[300px] md:w-[320px] rounded-2xl bg-white border border-red-100 shadow-md hover:shadow-lg transition-shadow p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wide leading-tight max-w-[55%]">
          {datosCompeticion.liga}
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-red-600 uppercase">
          {t('primerEquipo.jornada')} {partido.jornada}
        </span>
      </div>

      <p className="text-center text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        {partido.fecha}
        {partido.hora ? `, ${partido.hora}` : ''}
      </p>

      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <TeamLogo src={homeLogo} alt={homeName} />
          <span className="text-[10px] sm:text-xs font-semibold text-gray-900 text-center truncate w-full">
            {homeName}
          </span>
        </div>

        <span className="text-2xl sm:text-3xl font-black text-red-600 tabular-nums shrink-0">
          {formatScore(partido, t)}
        </span>

        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <TeamLogo src={awayLogo} alt={awayName} />
          <span className="text-[10px] sm:text-xs font-semibold text-gray-900 text-center truncate w-full">
            {awayName}
          </span>
        </div>
      </div>

      <p className="text-center text-[10px] sm:text-xs font-medium text-gray-600 uppercase leading-snug border-t border-gray-100 pt-3">
        {partido.estadio}
      </p>
    </article>
  )
}

function PlaceholderCard({ t }: { t: (key: string) => string }) {
  return (
    <article className="snap-center flex-shrink-0 w-[min(85vw,280px)] sm:w-[300px] md:w-[320px] rounded-2xl bg-white border border-dashed border-red-200 shadow-sm p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[10px] sm:text-xs font-semibold text-blue-600/80 uppercase">
          {datosCompeticion.liga}
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-red-600/80 uppercase">
          {t('primerEquipo.jornada')} —
        </span>
      </div>
      <p className="text-center text-xs font-semibold text-gray-500 uppercase mb-4">
        {t('primerEquipo.fechaPorConfirmar')}
      </p>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16">
            <Image src={CLUB_LOGO} alt="CD Onda" fill className="object-contain" sizes="64px" />
          </div>
          <span className="text-xs font-semibold text-gray-900">{CLUB_NAME}</span>
        </div>
        <span className="text-xl font-black text-red-600/50">{t('primerEquipo.vs')}</span>
        <div className="flex flex-col items-center gap-1.5">
          <TeamLogo alt="?" size="md" />
          <span className="text-xs font-semibold text-gray-400">—</span>
        </div>
      </div>
      <p className="text-center text-[10px] sm:text-xs font-medium text-gray-500 uppercase border-t border-gray-100 pt-3">
        {t('primerEquipo.estadioValor')}
      </p>
    </article>
  )
}

export function PartidosCarousel() {
  const { t } = useI18n()
  const scrollRef = useRef<HTMLDivElement>(null)
  const partidos = datosCompeticion.partidos
  const hasPartidos = partidos.length > 0

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('article')?.clientWidth ?? 320
    const gap = 20
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + gap) : cardWidth + gap, behavior: 'smooth' })
  }

  return (
    <div>
      <PrimerEquipoSectionHeader
        titleBlue={t('primerEquipo.proximosEnfrentamientos')}
        titleRed={t('primerEquipo.proximosEnfrentamientosSub')}
        description={t('primerEquipo.proximosEnfrentamientosDesc')}
      />

      <div className="flex items-center gap-2 sm:gap-4 max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label={t('primerEquipo.anterior')}
          className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex-1 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {hasPartidos ? (
            partidos.map((partido) => (
              <MatchCard key={partido.id} partido={partido} t={t} />
            ))
          ) : (
            <>
              <PlaceholderCard t={t} />
              <PlaceholderCard t={t} />
              <PlaceholderCard t={t} />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label={t('primerEquipo.siguiente')}
          className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {!hasPartidos && (
        <p className="text-center text-sm text-gray-500 mt-6 max-w-md mx-auto">
          {t('primerEquipo.sinPartidos')}
        </p>
      )}
    </div>
  )
}
