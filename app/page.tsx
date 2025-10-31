import { Header } from '@/components/layout/Header'
import { ClubHeroSection } from '@/components/club/ClubHeroSection'
import { ClubHistorySection } from '@/components/club/ClubHistorySection'
import { LocationSection } from '@/components/landing/LocationSection'
import { ClubTeamsSection } from '@/components/club/ClubTeamsSection'
import { ClubStatsSection } from '@/components/club/ClubStatsSection'
import { ContactSection } from '@/components/club/ContactSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        <ClubHeroSection />
        <ClubHistorySection />
        <ClubStatsSection />
        <LocationSection />
        <ClubTeamsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
