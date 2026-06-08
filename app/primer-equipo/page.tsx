import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/landing/Footer'
import { isPrimerEquipoEnabled } from '@/lib/feature-flags'
import { PrimerEquipoHeroSection } from '@/components/primer-equipo/PrimerEquipoHeroSection'
import { PrimerEquipoMatchesSection } from '@/components/primer-equipo/PrimerEquipoMatchesSection'
import { PrimerEquipoStandingsSection } from '@/components/primer-equipo/PrimerEquipoStandingsSection'
import { PrimerEquipoSquadSection } from '@/components/primer-equipo/PrimerEquipoSquadSection'
import { PrimerEquipoSponsorsSection } from '@/components/primer-equipo/PrimerEquipoSponsorsSection'
import { PrimerEquipoNewsSection } from '@/components/primer-equipo/PrimerEquipoNewsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Primer Equipo',
  description:
    'Primer equipo del Club Deportivo Onda. Liga Comunitat FFCV, estadio Enrique Saura. Calendario, clasificación, plantilla y noticias.',
  keywords: [
    'club deportivo onda',
    'primer equipo cd onda',
    'liga comunitat ffcv',
    'estadio enrique saura',
    'fútbol senior onda',
  ],
  openGraph: {
    title: 'Primer Equipo | CD Onda',
    description: 'Actualidad del primer equipo del CD Onda.',
  },
}

export default function PrimerEquipoPage() {
  if (!isPrimerEquipoEnabled()) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 md:pt-28">
        <PrimerEquipoHeroSection />
        <PrimerEquipoMatchesSection />
        <PrimerEquipoStandingsSection />
        <PrimerEquipoSquadSection />
        <PrimerEquipoSponsorsSection />
        <PrimerEquipoNewsSection />
        <Footer />
      </main>
    </>
  )
}
