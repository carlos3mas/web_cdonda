import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { InscripcionForm } from '@/components/inscripcion/InscripcionForm'
import { InscripcionPageContent } from '@/components/inscripcion/InscripcionPageContent'

export default function InscripcionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-10 md:py-12 pt-20 sm:pt-24 md:pt-32">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <InscripcionPageContent />
            <Suspense fallback={<div className="text-center py-8">Cargando formulario...</div>}>
              <InscripcionForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  )
}

