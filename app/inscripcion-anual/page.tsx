import { Header } from '@/components/layout/Header'
import { InscripcionAnualForm } from '@/components/inscripcion/InscripcionAnualForm'

export default function InscripcionAnualPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <InscripcionAnualForm />
        </div>
      </main>
    </>
  )
}
