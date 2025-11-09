'use client'

import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' }
]

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'El Club', anchor: 'club' },
  { label: 'Instalaciones', anchor: 'instalaciones' },
  { label: 'Equipos', anchor: 'equipos' },
  { label: 'Contacto', anchor: 'contacto' },
  { label: 'Campus Navidad', href: '/campus-navidad' }
]

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b border-white/10 pb-10">
            <div className="space-y-3">
              <h3 className="text-3xl font-black tracking-wide">CD ONDA</h3>
              <p className="text-gray-400 max-w-xl text-sm md:text-base">
                Más de un siglo formando jugadores, creando comunidad y llevando los colores rojiblancos por toda la provincia.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="uppercase tracking-[0.35em] text-xs text-gray-400">
                Síguenos
              </span>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ name, icon: Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    aria-label={name}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-red-600/90 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h4 className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-4">Enlaces</h4>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                {navLinks.map(({ label, href, anchor }) =>
                  href ? (
                    <Link key={label} href={href} className="hover:text-red-500 transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <button
                      key={label}
                      onClick={() => document.getElementById(anchor ?? '')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-red-500 transition-colors text-left"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-4">Contacto</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-red-500" />
                  <span>608 337 444</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span>escolafut@gmail.com</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 text-sm text-gray-300">
              <h4 className="text-sm uppercase tracking-[0.35em] text-gray-400 mb-4">Dirección</h4>
              <p>
                Campo Municipal La Cossa
                <br />Calle San Fermín s/n, 12200 Onda (Castellón)
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Club Deportivo Onda. Todos los derechos reservados.
            </p>
            <p className="text-[11px] text-gray-500">
              Sitio web diseñado y desarrollado por Carlos Mas.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

