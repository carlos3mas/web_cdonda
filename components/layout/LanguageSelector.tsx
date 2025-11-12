'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { Locale } from '@/lib/i18n/translations'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FlagSpain } from '@/components/ui/FlagSpain'
import { FlagValencia } from '@/components/ui/FlagValencia'

interface LanguageOption {
  code: Locale
  label: string
  FlagComponent: React.ComponentType<{ className?: string }>
}

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const languages: LanguageOption[] = [
    { code: 'es', label: t('common.espanol'), FlagComponent: FlagSpain },
    { code: 'ca-val', label: t('common.valenciano'), FlagComponent: FlagValencia },
  ]

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]
  const CurrentFlag = currentLanguage.FlagComponent

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs font-medium hover:text-red-600 p-1.5 sm:p-2"
        aria-label={t('common.cambiarIdioma')}
      >
        <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline-block border border-gray-200 rounded overflow-hidden bg-white shadow-sm w-4 h-4 sm:w-5 sm:h-5 relative flex-shrink-0">
          <CurrentFlag className="w-full h-full" />
        </span>
        <span className="hidden sm:inline text-xs sm:text-sm">{currentLanguage.label}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 sm:mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
            {languages.map((lang) => {
              const Flag = lang.FlagComponent
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 hover:bg-gray-50 transition-colors ${
                    locale === lang.code ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="border border-gray-200 rounded flex-shrink-0 overflow-hidden bg-white shadow-sm w-5 h-5 sm:w-6 sm:h-6 relative">
                    <Flag className="w-full h-full" />
                  </span>
                  <span className="whitespace-nowrap">{lang.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

