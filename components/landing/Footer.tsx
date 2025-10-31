'use client'

import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">CD Onda</h3>
            <p className="text-sm">
              Club Deportivo Onda, formando jugadores y personas desde 1944.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Inicio</Link></li>
              <li>
                <button 
                  onClick={() => document.getElementById('club')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 transition-colors text-left"
                >
                  El Club
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('instalaciones')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 transition-colors text-left"
                >
                  Instalaciones
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-red-500 transition-colors text-left"
                >
                  Contacto
                </button>
              </li>
              <li><Link href="/campus-navidad" className="hover:text-red-500 transition-colors">Campus de Navidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>964 77 00 00</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@cdonda.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-red-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Club Deportivo Onda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

