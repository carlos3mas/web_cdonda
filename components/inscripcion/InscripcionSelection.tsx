'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, GraduationCap, ArrowRight, Check } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function InscripcionSelection() {
  const { t } = useI18n()

  // Tipos de inscripción disponibles
  const inscripciones = [
    {
      id: 'campus-navidad',
      title: t('inscripcionSelection.campusNavidad'),
      description: t('inscripcionSelection.campusNavidadDesc'),
      icon: Calendar,
      available: true,
      href: '/campus-navidad/inscripcion?tipo=campus-navidad',
      features: [
        t('inscripcionSelection.campusNavidadFeature1'),
        t('inscripcionSelection.campusNavidadFeature2'),
        t('inscripcionSelection.campusNavidadFeature3'),
        t('inscripcionSelection.campusNavidadFeature4')
      ],
      badge: t('inscripcionSelection.disponible')
    },
    {
      id: 'campus-pascua',
      title: t('inscripcionSelection.campusPascua'),
      description: t('inscripcionSelection.campusPascuaDesc'),
      icon: Calendar,
      available: false,
      href: '#',
      features: [
        t('inscripcionSelection.proximamente'),
        t('inscripcionSelection.campusPascuaFeature1'),
        t('inscripcionSelection.campusPascuaFeature2'),
        t('inscripcionSelection.campusPascuaFeature3')
      ],
      badge: t('inscripcionSelection.proximamente')
    },
    {
      id: 'campus-verano',
      title: t('inscripcionSelection.campusVerano'),
      description: t('inscripcionSelection.campusVeranoDesc'),
      icon: Calendar,
      available: false,
      href: '#',
      features: [
        t('inscripcionSelection.proximamente'),
        t('inscripcionSelection.campusVeranoFeature1'),
        t('inscripcionSelection.campusVeranoFeature2'),
        t('inscripcionSelection.campusVeranoFeature3')
      ],
      badge: t('inscripcionSelection.proximamente')
    },
    {
      id: 'anual',
      title: t('inscripcionSelection.anual'),
      description: t('inscripcionSelection.anualDesc'),
      icon: GraduationCap,
      available: false,
      href: '#',
      features: [
        t('inscripcionSelection.proximamente'),
        t('inscripcionSelection.anualFeature1'),
        t('inscripcionSelection.anualFeature2'),
        t('inscripcionSelection.anualFeature3'),
        t('inscripcionSelection.anualFeature4')
      ],
      badge: t('inscripcionSelection.proximamente')
    }
  ]

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-blue-600">{t('inscripcionSelection.eligeTu')}</span> <span className="text-red-600">{t('inscripcionSelection.inscripcion')}</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('inscripcionSelection.descripcion')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
        {inscripciones.map((inscripcion, index) => {
          const Icon = inscripcion.icon
          return (
            <motion.div
              key={inscripcion.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full flex flex-col transition-all hover:shadow-xl ${
                inscripcion.available 
                  ? 'border-red-200 hover:border-red-400' 
                  : 'opacity-75 border-gray-200'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${inscripcion.available ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        inscripcion.available
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {inscripcion.badge}
                      </span>
                    </div>
                  </div>
                  <CardTitle className={`text-2xl mb-2 ${inscripcion.available ? 'text-red-600' : 'text-gray-500'}`}>
                    {inscripcion.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {inscripcion.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <ul className="space-y-3 mb-6 flex-grow">
                    {inscripcion.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          inscripcion.available 
                            ? 'text-red-600' 
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          inscripcion.available 
                            ? 'text-gray-700' 
                            : 'text-gray-500'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {inscripcion.available ? (
                    <Link href={inscripcion.href} className="w-full">
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        size="lg"
                      >
                        {t('inscripcionSelection.inscribirse')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                      size="lg"
                      disabled
                    >
                      {t('inscripcionSelection.proximamente')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] rounded-2xl p-8 text-center max-w-4xl mx-auto text-white shadow-[0_18px_45px_rgba(139,0,0,0.25)]"
      >
        <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-[0.35em] text-white/70 mb-4">
          <Users className="h-9 w-9 text-blue-600" />
          <span>{t('inscripcionSelection.atencionPersonalizada')}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {t('inscripcionSelection.necesitasInfo')}
        </h3>
        <p className="text-white/85 mb-6">
          {t('inscripcionSelection.contactoDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/#contacto">
            <Button variant="outline" className="border-white text-red-600 hover:bg-red-600 hover:text-white">
              {t('inscripcionSelection.verContacto')}
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

