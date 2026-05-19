import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { CampusInfoSection } from '@/components/campus/CampusInfoSection'
import { CampusDetailsSection } from '@/components/campus/CampusDetailsSection'
import { CampusScheduleSection } from '@/components/campus/CampusScheduleSection'
import { CampusCTASection } from '@/components/campus/CampusCTASection'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus de Verano 2026',
  description: 'Campus de Verano CD Onda. Actividades deportivas, valores y diversión para niños.',
  keywords: [
    'campus verano cd onda',
    'campus fútbol verano',
    'actividades deportivas verano',
    'campus verano castellón',
    'escuela de fútbol verano',
  ],
  openGraph: {
    title: 'Campus de Verano 2026 | CD Onda',
    description: 'Inscríbete en el Campus de Verano del CD Onda.',
  },
}

export default function CampusVeranoPage() {
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
