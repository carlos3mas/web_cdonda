import { MetadataRoute } from 'next'
import { isPrimerEquipoEnabled } from '@/lib/feature-flags'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cdonda.es'
  const lastModified = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/campus-verano`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/campus-verano/inscripcion`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/inscripcion`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/politica-cookies`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-privacidad`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  if (isPrimerEquipoEnabled()) {
    entries.splice(1, 0, {
      url: `${baseUrl}/primer-equipo`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  return entries
}

