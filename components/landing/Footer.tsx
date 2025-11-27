'use client'

import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

// Icono de TikTok personalizado
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100064530709562' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/cdonda_escueladefutbol/' },
  { name: 'TikTok', icon: TikTokIcon, href: 'https://www.tiktok.com/@escueladefutbolcdonda' }
]

export function Footer() {
  const { t } = useI18n()
  
  const navLinks = [
    { label: t('header.inicio'), href: '/' },
    { label: t('header.historia'), anchor: 'club' },
    { label: t('header.instalaciones'), anchor: 'instalaciones' },
    { label: t('header.equipos'), anchor: 'equipos' },
    { label: t('header.contacto'), anchor: 'contacto' },
    { label: t('header.campusNavidad'), href: '/campus-navidad' }
  ]
  
  return (
    <footer className="bg-gray-950 text-white pt-12 sm:pt-14 md:pt-16 pb-8 sm:pb-10">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8 border-b border-white/10 pb-8 sm:pb-10">
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black tracking-wide">CD ONDA</h3>
              <p className="text-gray-400 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed">
                {t('footer.descripcion')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4">
              <span className="uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[10px] xs:text-xs text-gray-400">
                {t('footer.siguenos')}
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {socialLinks.map(({ name, icon: Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-red-600/90 hover:text-white"
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            <div>
              <h4 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-400 mb-3 sm:mb-4">{t('footer.enlaces')}</h4>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                {navLinks.map(({ label, href, anchor }) =>
                  href ? (
                    <Link key={label} href={href} className="hover:text-red-500 transition-colors break-words">
                      {label}
                    </Link>
                  ) : (
                    <button
                      key={label}
                      onClick={() => document.getElementById(anchor ?? '')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-red-500 transition-colors text-left break-words"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-400 mb-3 sm:mb-4">{t('footer.contacto')}</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
                <li className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                  <a href="tel:608337444" className="hover:text-red-500 transition-colors break-all">608 337 444</a>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                  <a href="mailto:escolafut@gmail.com" className="hover:text-red-500 transition-colors break-all">escolafut@gmail.com</a>
                </li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
              <h4 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.35em] text-gray-400 mb-3 sm:mb-4">{t('footer.direccion')}</h4>
              <p className="leading-relaxed break-words">
                {t('location.campoLaCossa')}
                <br />Calle San Fermín s/n, 12200 Onda (Castellón)
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-[10px] xs:text-xs text-gray-400">
              <Link href="/politica-cookies" className="hover:text-red-500 transition-colors">
                Política de Cookies
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/politica-privacidad" className="hover:text-red-500 transition-colors">
                Política de Privacidad
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/aviso-legal" className="hover:text-red-500 transition-colors">
                Aviso Legal
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3 text-[10px] xs:text-xs text-gray-300">
              <p className="text-center md:text-left">
                &copy; {new Date().getFullYear()} Club Deportivo Onda. {t('footer.derechosReservados')}
              </p>
              <p className="text-[9px] xs:text-[10px] sm:text-[11px] text-gray-300 text-center md:text-right">
                {t('footer.disenadoPor')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

