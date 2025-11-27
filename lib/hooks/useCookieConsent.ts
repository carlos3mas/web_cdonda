'use client'

import { useState, useEffect } from 'react'

export type CookieConsent = 'accepted' | 'rejected' | null

const COOKIE_CONSENT_KEY = 'cdonda-cookie-consent'

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Solo leer del localStorage en el cliente
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent
      setConsent(stored || null)
      setIsLoading(false)
    }
  }, [])

  const acceptCookies = () => {
    setConsent('accepted')
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    }
  }

  const rejectCookies = () => {
    setConsent('rejected')
    if (typeof window !== 'undefined') {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
    }
  }

  const hasConsent = consent === 'accepted'
  const hasRejected = consent === 'rejected'
  const showBanner = consent === null && !isLoading

  return {
    consent,
    hasConsent,
    hasRejected,
    showBanner,
    isLoading,
    acceptCookies,
    rejectCookies,
  }
}

