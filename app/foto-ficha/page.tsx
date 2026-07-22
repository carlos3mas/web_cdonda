import { Header } from '@/components/layout/Header'
import { InscripcionAnualFotoFicha } from '@/components/inscripcion/InscripcionAnualFotoFicha'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Foto de ficha | CD Onda',
  description:
    'Sube o actualiza la foto tipo carnet de tu ficha federativa si ya estás inscrito en la inscripción anual del CD Onda.',
}

export default function FotoFichaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <div className="container mx-auto px-4 max-w-5xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">
                Ya inscritos · Inscripción anual
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                Foto de ficha
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Si ya has formalizado la inscripción anual, puedes añadir o actualizar aquí la foto
                tipo carnet que se asociará a tu ficha.
              </p>
            </div>
            <Link
              href="/inscripcion"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a inscripciones
            </Link>
          </div>

          <InscripcionAnualFotoFicha />
        </div>
      </main>
    </>
  )
}
