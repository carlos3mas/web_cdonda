import { Header } from '@/components/layout/Header'
import { HeroSection } from '@/components/landing/HeroSection'
import { CampusInfoSection } from '@/components/campus/CampusInfoSection'
import { CampusDetailsSection } from '@/components/campus/CampusDetailsSection'
import { CampusScheduleSection } from '@/components/campus/CampusScheduleSection'
import { CampusCTASection } from '@/components/campus/CampusCTASection'
import { Footer } from '@/components/landing/Footer'

export default function CampusNavidadPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
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

