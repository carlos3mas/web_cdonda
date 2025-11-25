import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { CampusInfoSection } from '@/components/campus/CampusInfoSection'
import { CampusDetailsSection } from '@/components/campus/CampusDetailsSection'
import { CampusScheduleSection } from '@/components/campus/CampusScheduleSection'
import { CampusCTASection } from '@/components/campus/CampusCTASection'
import { Footer } from '@/components/landing/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus de Navidad 2025',
  description: 'Campus de Navidad CD Onda. Del 23 de diciembre al 3 de enero. Actividades deportivas, valores y diversión para niños de 5 a 14 años.',
  keywords: [
    'campus navidad cd onda',
    'campus fútbol navidad',
    'actividades deportivas navidad',
    'campus navidad castellón',
    'escuela de fútbol navidad',
  ],
  openGraph: {
    title: 'Campus de Navidad 2025 | CD Onda',
    description: 'Inscríbete en el Campus de Navidad del CD Onda. Del 23 de diciembre al 3 de enero.',
  },
}

export default function CampusNavidadPage() {
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

