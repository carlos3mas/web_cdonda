import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SponsorsBanner } from '@/components/layout/SponsorsBanner'
import { Providers } from '@/components/providers/I18nProvider'
// Nota: La validación de variables de entorno se hace en runtime en las rutas API

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cdonda.com'),
  title: {
    default: 'CD Onda | Club y Campus Oficial',
    template: '%s | CD Onda',
  },
  description:
    'Club Deportivo Onda: información del club, equipos, campus de Navidad y contacto oficial.',
  keywords: [
    'CD Onda',
    'club deportivo onda',
    'fútbol base',
    'campus navidad cd onda',
    'escuela de fútbol castellón',
  ],
  icons: {
    icon: '/images/logos/escudo-cd-onda.webp',
    shortcut: '/images/logos/escudo-cd-onda.webp',
    apple: '/images/logos/escudo-cd-onda.webp',
  },
  openGraph: {
    title: 'CD Onda | Club y Campus Oficial',
    description:
      'Descubre el club, nuestros equipos y el Campus de Navidad. Inscripciones abiertas.',
    url: '/',
    siteName: 'CD Onda',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CD Onda | Club y Campus Oficial',
    description:
      'Toda la información del CD Onda y el Campus de Navidad 2025.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <SponsorsBanner />
          {children}
        </Providers>
      </body>
    </html>
  )
}

