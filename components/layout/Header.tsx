'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import { LanguageSelector } from './LanguageSelector'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isCampusPage = pathname?.startsWith('/campus-navidad')
  const { t } = useI18n()

  // Cerrar menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false)
    
    // Manejar scroll a hash guardado después de navegar
    const scrollToHash = sessionStorage.getItem('scrollToHash')
    if (scrollToHash) {
      sessionStorage.removeItem('scrollToHash')
      setTimeout(() => {
        const element = document.getElementById(scrollToHash)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
    
    // Manejar hash en la URL actual
    if (pathname === '/' && window.location.hash) {
      const hash = window.location.hash.substring(1)
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 300)
    }
  }, [pathname])

  // Subsecciones del campus
  const campusSubsections = [
    { href: '/campus-navidad#campus-incluye', label: t('campus.queIncluyeSub') },
    { href: '/campus-navidad#campus-info', label: t('campus.informacionPractica') },
    { href: '/campus-navidad#campus-horario', label: t('campus.horarioDiario') },
    { href: '/campus-navidad#campus-cta', label: t('campus.inscrbete') },
  ]

  // Manejar scroll suave para enlaces de anclaje
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault()
      const [path, hash] = href.split('#')
      const normalizedPath = path || '/'
      const currentPath = pathname || '/'
      
      // Si el hash es para la página del campus y estamos en ella
      if (hash && isCampusPage && normalizedPath === '/campus-navidad') {
        setIsMenuOpen(false)
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            // Header (64px) + Sub-navbar (48px) = 112px
            const headerOffset = 112
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }, 100)
        return
      }
      
      // Si estamos en otra página, navegar primero y luego hacer scroll
      if (currentPath !== normalizedPath) {
        setIsMenuOpen(false)
        // Guardar el hash para hacer scroll después de navegar
        if (hash) {
          sessionStorage.setItem('scrollToHash', hash)
        }
        window.location.href = href
        return
      }
      
      // Si estamos en la página correcta, hacer scroll suave
      setIsMenuOpen(false)
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    } else {
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { href: '/', label: t('header.inicio') },
    { href: '/#club', label: t('header.historia') },
    { href: '/#trayectoria', label: t('header.trayectoria') },
    { href: '/#instalaciones', label: t('header.instalaciones') },
    { href: '/#equipajes', label: t('header.equipajes') },
    { href: '/#equipos', label: t('header.equipos') },
    { href: '/#promociones', label: t('header.promociones') },
    { href: '/#patrocinadores', label: t('header.patrocinadores') },
    { href: '/#contacto', label: t('header.contacto') },
    { href: '/campus-navidad', label: t('header.campusNavidad'), highlight: true },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group z-50 min-w-0">
            <div className="relative w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 transition-transform group-hover:scale-110 flex-shrink-0">
              <Image
                src="/images/logos/escudo-cd-onda.png"
                alt="Escudo CD Onda"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 475px) 40px, (max-width: 640px) 48px, 56px"
              />
            </div>
            <span className="hidden xs:inline text-sm sm:text-lg font-black uppercase tracking-[0.08em] text-red-600 whitespace-nowrap">
              CD ONDA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={`text-xs font-medium text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap relative group py-2 ${
                  link.highlight ? 'text-red-600' : ''
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link href="/inscripcion">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                {t('header.inscrbete')}
              </Button>
            </Link>
            <LanguageSelector />
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-md transition-colors z-50 relative flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            aria-label="Toggle menu"
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile/Tablet Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t bg-white"
            >
            <div className="py-3 sm:py-4 space-y-1 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                  }}
                  className={`block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 ${
                    link.highlight ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Subsecciones del campus en móvil */}
              {isCampusPage && (
                <>
                  <div className="px-3 sm:px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-200 mt-2 pt-3 sm:pt-4">
                    {t('header.campusNavidad')}
                  </div>
                  {campusSubsections.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={(e) => {
                        handleAnchorClick(e, sub.href)
                      }}
                      className="block px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors active:bg-gray-200"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </>
              )}
              <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 space-y-2">
                <Link href="/inscripcion" onClick={() => setIsMenuOpen(false)} className="block">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-sm sm:text-base py-5 sm:py-6">
                    {t('header.inscrbete')}
                  </Button>
                </Link>
                <div className="flex justify-center">
                  <LanguageSelector />
                </div>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Sub-navbar para el campus */}
      {isCampusPage && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="hidden lg:block border-t border-gray-200 bg-white/98 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-end gap-4 h-12">
              {campusSubsections.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={(e) => handleAnchorClick(e, sub.href)}
                  className="text-xs font-medium text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap relative group"
                >
                  {sub.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </header>
  )
}

