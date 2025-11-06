'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const benefits = [
  'Grupos reducidos para mejor atención',
  'Monitores titulados y con experiencia',
  'Material deportivo de calidad incluido',
  'Seguro de accidentes deportivos',
  'Actividades adaptadas por edades',
  'Ambiente seguro y familiar'
]

export function CampusCTASection() {
  return (
    <section id="campus-cta" className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para la Experiencia?
          </h2>
          <p className="text-xl text-red-50 mb-8">
            No pierdas la oportunidad de vivir un Campus de Navidad inolvidable. 
            ¡Las plazas son limitadas!
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-10 text-left">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-red-50">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campus-navidad/inscripcion">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-red-50 text-lg px-10 py-7 text-xl font-bold"
              >
                <Calendar className="mr-3 h-6 w-6" />
                Inscríbete Ahora
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <a href="#contacto">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-10 py-7"
              >
                ¿Tienes dudas? Contáctanos
              </Button>
            </a>
          </div>

          <p className="mt-8 text-red-100 text-sm">
            📞 Para más información: <strong>964 77 00 00</strong> | 📧 <strong>campus@cdonda.com</strong>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

