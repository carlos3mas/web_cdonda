import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { CampusInfoSection } from '@/components/campus/CampusInfoSection'
import { CampusDetailsSection } from '@/components/campus/CampusDetailsSection'
import { CampusScheduleSection } from '@/components/campus/CampusScheduleSection'
import { CampusCTASection } from '@/components/campus/CampusCTASection'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus de Pascua 2025',
  description: 'Campus de Pascua CD Onda. Abril. Actividades deportivas, valores y diversión para niños.',
  keywords: [
    'campus pascua cd onda',
    'campus fútbol pascua',
    'actividades deportivas pascua',
    'campus pascua castellón',
    'escuela de fútbol pascua',
  ],
  openGraph: {
    title: 'Campus de Pascua 2025 | CD Onda',
    description: 'Inscríbete en el Campus de Pascua del CD Onda. Abril de 2025.',
  },
}

export default function CampusPascuaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 md:pt-28">
        <HeroSection />
        <CampusInfoSection />
        <CampusDetailsSection />
        <CampusScheduleSection />
        <CampusCTASection />
        <Footer />
      </main>
    </>
  )
}

