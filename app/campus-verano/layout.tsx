import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus de Verano 2026 | CD Onda',
  description:
    'Inscríbete en el Campus de Verano 2026 del CD Onda: entrenamientos técnicos, actividades y grupos por edades.',
}

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
