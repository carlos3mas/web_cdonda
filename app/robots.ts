import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://cdonda.es'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/storage/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

