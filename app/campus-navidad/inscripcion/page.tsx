import { Header } from '@/components/layout/Header'
import { InscripcionForm } from '@/components/inscripcion/InscripcionForm'

export default function InscripcionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-10 md:py-12 pt-20 sm:pt-24 md:pt-32">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 px-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-600 font-bold mb-2 sm:mb-3 md:mb-4">
                Inscripción <span className="text-gradient">Campus 2025</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Completa el formulario para reservar tu plaza en el Campus de Navidad
              </p>
            </div>
            <InscripcionForm />
          </div>
        </div>
      </main>
    </>
  )
}

