import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal y condiciones de uso de cdonda.es',
  robots: {
    index: true,
    follow: true,
  },
}

export default function AvisoLegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

