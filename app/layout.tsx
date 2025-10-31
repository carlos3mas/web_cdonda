import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SponsorsBanner } from '@/components/layout/SponsorsBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Campus de Navidad 2025 - CD Onda',
  description: 'Campus de Navidad del Club Deportivo Onda. Inscríbete ahora para vivir una experiencia deportiva única.',
  keywords: 'campus navidad, cd onda, fútbol, deporte, valencia, castellón',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SponsorsBanner />
        {children}
      </body>
    </html>
  )
}

