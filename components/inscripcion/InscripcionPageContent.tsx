'use client'

import { useI18n } from '@/lib/i18n/context'

export function InscripcionPageContent() {
  const { t } = useI18n()

  return (
    <div className="text-center mb-6 sm:mb-8 px-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-600 font-bold mb-2 sm:mb-3 md:mb-4">
        {t('inscripcionPage.titulo')} <span className="text-gradient">{t('inscripcionPage.campus2025')}</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
        {t('inscripcionPage.descripcion')}
      </p>
    </div>
  )
}

