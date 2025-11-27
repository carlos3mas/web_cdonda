'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'

export function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const { hasConsent, isLoading } = useCookieConsent()
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Solo cargar si hay consentimiento y no está cargando
    if (!isLoading && hasConsent) {
      setShouldLoad(true)
    }
  }, [hasConsent, isLoading])

  // Solo cargar en producción, si existe el ID y hay consentimiento
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production' || !shouldLoad) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

