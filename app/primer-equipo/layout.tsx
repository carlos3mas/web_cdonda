import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Primer Equipo | CD Onda',
  description:
    'Primer equipo del Club Deportivo Onda (1921). Liga Comunitat FFCV y estadio Enrique Saura.',
}

export default function PrimerEquipoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
