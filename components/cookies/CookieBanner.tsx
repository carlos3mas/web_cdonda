'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCookieConsent } from '@/lib/hooks/useCookieConsent'
import { useI18n } from '@/lib/i18n/context'
import Link from 'next/link'
import { X, Settings, Check } from 'lucide-react'

export function CookieBanner() {
  const { showBanner, acceptCookies, rejectCookies } = useCookieConsent()
  const { t } = useI18n()
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  if (!showBanner) return null

  const handleAcceptAll = () => {
    acceptCookies()
  }

  const handleRejectAll = () => {
    rejectCookies()
  }

  const handleAcceptSelected = () => {
    if (analyticsEnabled) {
      acceptCookies()
    } else {
      rejectCookies()
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-4 sm:py-6">
            {!showSettings ? (
              // Vista principal del banner
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('cookies.titulo')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('cookies.descripcion')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('cookies.masInfo')}{' '}
                    <Link
                      href="/politica-cookies"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {t('cookies.politicaCookies')}
                    </Link>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {t('cookies.configurar')}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {t('cookies.rechazar')}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {t('cookies.aceptar')}
                  </button>
                </div>
              </div>
            ) : (
              // Vista de configuración
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('cookies.configurarCookies')}
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={t('cookies.cerrar')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {t('cookies.analiticas')}
                        </h4>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                          {t('cookies.opcional')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t('cookies.analiticasDesc')}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={analyticsEnabled}
                        onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {t('cookies.cancelar')}
                  </button>
                  <button
                    onClick={handleAcceptSelected}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {t('cookies.guardarPreferencias')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

