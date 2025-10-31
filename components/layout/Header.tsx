'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/campus-navidad', label: 'Campus de Navidad', highlight: true },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
            <Trophy className="h-6 w-6" />
            <span>CD ONDA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  link.highlight ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/campus-navidad/inscripcion">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Inscríbete
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 ${
                      link.highlight ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4">
                  <Link href="/campus-navidad/inscripcion" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                      Inscríbete
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

