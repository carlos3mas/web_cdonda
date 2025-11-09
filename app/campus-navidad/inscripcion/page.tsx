import { Header } from '@/components/layout/Header'
import { InscripcionForm } from '@/components/inscripcion/InscripcionForm'

export default function InscripcionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl text-blue-600 md:text-5xl font-bold mb-4">
                Inscripción <span className="text-gradient">Campus 2025</span>
              </h1>
              <p className="text-lg text-gray-600">
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

