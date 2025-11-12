'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export function CampusCTASection() {
  const { t } = useI18n()
  
  const benefits = [
    t('cta.gruposReducidos'),
    t('cta.monitoresTitulados'),
    t('cta.materialDeportivo'),
    t('cta.seguroAccidentes'),
    t('cta.actividadesAdaptadas'),
    t('cta.ambienteSeguro')
  ]

  return (
    <section id="campus-cta" className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] hidden md:block">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c91818' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 px-2">
            <span className="text-blue-600">{t('cta.listoExperiencia')}</span> <span className="text-red-600">{t('cta.experiencia')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-5 sm:mb-6 md:mb-8 px-3">
            {t('cta.descripcion')}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start sm:items-center gap-2 sm:gap-3"
              >
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/campus-navidad/inscripcion" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 font-bold"
              >
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                {t('cta.inscrbeteAhora')}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </Button>
            </Link>
            <a href="#contacto" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7"
              >
                {t('cta.tienesDudas')}
              </Button>
            </a>
          </div>

          <p className="mt-5 sm:mt-6 md:mt-8 text-gray-600 text-[11px] xs:text-xs sm:text-sm px-3 sm:px-4 break-words leading-relaxed">
            📞 {t('cta.masInformacion')} <strong>608 337 444</strong> | 📧 <strong className="break-all">escolafut@gmail.com</strong>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

