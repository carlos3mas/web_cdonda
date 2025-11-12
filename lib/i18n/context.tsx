'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, translations } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')
  const [mounted, setMounted] = useState(false)

  // Load locale from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && (stored === 'es' || stored === 'ca-val')) {
      setLocaleState(stored)
    }
    setMounted(true)
  }, [])

  // Save locale to localStorage when it changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale === 'ca-val' ? 'ca' : 'es'
    }
  }

  // Update HTML lang attribute when locale changes
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.lang = locale === 'ca-val' ? 'ca' : 'es'
    }
  }, [locale, mounted])

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to Spanish if key not found
        value = translations.es
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key
          }
        }
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  if (!mounted) {
    // Return default values during SSR
    return (
      <I18nContext.Provider value={{ locale: 'es', setLocale, t }}>
        {children}
      </I18nContext.Provider>
    )
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

