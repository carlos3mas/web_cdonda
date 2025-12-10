import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SponsorsBanner } from '@/components/layout/SponsorsBanner'
import { Providers } from '@/components/providers/I18nProvider'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics/GoogleTagManager'
import { CookieBanner } from '@/components/cookies/CookieBanner'
// Nota: La validación de variables de entorno se hace en runtime en las rutas API

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#8b0000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://cdonda.es'),
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'dns-prefetch': 'https://www.googletagmanager.com',
    'google-site-verification': '4GkomvpOgXCmZmr8o1_VY-j0fLNbxn4rydks_5bcV-I',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <GoogleAnalytics />
        <GoogleTagManager />
      </head>
      <body className={inter.className}>
        <GoogleTagManagerNoScript />
        <Providers>
          <SponsorsBanner />
          {children}
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}

