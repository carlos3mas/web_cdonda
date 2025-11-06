'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isCampusPage = pathname?.startsWith('/campus-navidad')

  // Cerrar menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Subsecciones del campus
  const campusSubsections = [
    { href: '/campus-navidad#campus-incluye', label: '¿Qué Incluye?' },
    { href: '/campus-navidad#campus-info', label: 'Información Práctica' },
    { href: '/campus-navidad#campus-horario', label: 'Horario Diario' },
    { href: '/campus-navidad#campus-cta', label: 'Inscríbete' },
  ]

  // Manejar scroll suave para enlaces de anclaje
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault()
      const [path, hash] = href.split('#')
      
      // Si el hash es para la página del campus y estamos en ella
      if (hash && isCampusPage && path === '/campus-navidad') {
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
        setIsMenuOpen(false)
        return
      }
      
      // Si estamos en otra página, navegar primero
      if (pathname !== path) {
        window.location.href = href
        return
      }
      
      // Si estamos en la página correcta, hacer scroll suave
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
      setIsMenuOpen(false)
    } else {
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#club', label: 'El Club' },
    { href: '/#trayectoria', label: 'Trayectoria' },
    { href: '/#instalaciones', label: 'Instalaciones' },
    { href: '/#equipajes', label: 'Equipajes' },
    { href: '/#equipos', label: 'Equipos' },
    { href: '/#patrocinadores', label: 'Patrocinadores' },
    { href: '/#contacto', label: 'Contacto' },
    { href: '/campus-navidad', label: 'Campus de Navidad', highlight: true },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-red-600 group z-50">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
              <Image
                src="/images/logo/cd-onda-logo.png"
                alt="CD Onda Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline">CD ONDA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={`text-xs font-medium transition-colors hover:text-red-600 whitespace-nowrap ${
                  link.highlight ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/inscripcion">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                Inscríbete
              </Button>
            </Link>
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors z-50 relative"
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            aria-label="Toggle menu"
            type="button"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
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
            <div className="py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleAnchorClick(e, link.href)
                  }}
                  className={`block px-4 py-3 text-base font-medium transition-colors hover:bg-gray-50 active:bg-gray-100 ${
                    link.highlight ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Subsecciones del campus en móvil */}
              {isCampusPage && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-200 mt-2 pt-4">
                    Campus de Navidad
                  </div>
                  {campusSubsections.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={(e) => {
                        handleAnchorClick(e, sub.href)
                      }}
                      className="block px-8 py-3 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors active:bg-gray-200"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </>
              )}
              <div className="px-4 pt-4 pb-2">
                <Link href="/inscripcion" onClick={() => setIsMenuOpen(false)} className="block">
                  <Button size="lg" className="w-full bg-red-600 hover:bg-red-700">
                    Inscríbete
                  </Button>
                </Link>
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
          className="border-t border-gray-200 bg-white/98 backdrop-blur-sm"
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

