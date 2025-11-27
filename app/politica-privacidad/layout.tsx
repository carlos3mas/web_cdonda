import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales de cdonda.es',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PoliticaPrivacidadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

