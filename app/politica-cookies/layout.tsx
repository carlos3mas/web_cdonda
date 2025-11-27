import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en cdonda.es',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PoliticaCookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

