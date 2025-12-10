import { Header } from '@/components/layout/Header'
import { ClubHeroSection } from '@/components/club/ClubHeroSection'
import { ClubHistorySection } from '@/components/club/ClubHistorySection'
import { LocationSection } from '@/components/landing/LocationSection'
import { ClubTeamsSection } from '@/components/club/ClubTeamsSection'
import { ClubStatsSection } from '@/components/club/ClubStatsSection'
import { ClubKitsSection } from '@/components/club/ClubKitsSection'
import { PromocionesSection } from '@/components/club/PromocionesSection'
import { PromocionesModal } from '@/components/club/PromocionesModal'
import { SponsorsSection } from '@/components/club/SponsorsSection'
import { ContactSection } from '@/components/club/ContactSection'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <PromocionesModal />
      {/* pt-28 en móvil para header (64px) + banner sponsors (48px) */}
      <main className="min-h-screen pt-28 sm:pt-32 md:pt-36">
        <ClubHeroSection />
        <ClubHistorySection />
        <ClubStatsSection />
        <LocationSection />
        <ClubKitsSection />
        <ClubTeamsSection />
        <PromocionesSection />
        <SponsorsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
