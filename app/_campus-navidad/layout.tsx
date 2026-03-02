import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus de Navidad 2025 | CD Onda',
  description:
    'Inscríbete en el Campus de Navidad 2025 del CD Onda: entrenamientos técnicos, actividades y grupos por edades.',
}

export default function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

