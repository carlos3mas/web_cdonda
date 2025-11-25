import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CD Onda - Club Deportivo Onda',
    short_name: 'CD Onda',
    description: 'Club Deportivo Onda: información del club, equipos, campus de Navidad y contacto oficial.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0066CC',
    icons: [
      {
        src: '/images/logos/escudo-cd-onda.webp',
        sizes: 'any',
        type: 'image/webp',
      },
    ],
  }
}

