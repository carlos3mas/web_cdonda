import { Header } from '@/components/layout/Header'
import { InscripcionSelection } from '@/components/inscripcion/InscripcionSelection'

export default function InscripcionSelectionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <InscripcionSelection />
      </main>
    </>
  )
}

