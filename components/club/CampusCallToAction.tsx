'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

export function CampusCallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
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
          className="text-center mb-12"
        >
          <Calendar className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Campus de Navidad 2025
          </h2>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-8">
            Vive una experiencia única estas navidades. Mejora tu técnica, 
            diviértete y haz nuevos amigos en nuestro campus de invierno.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fechas</h3>
            <p className="text-red-100">Del 23 al 30 de Diciembre 2025</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Edades</h3>
            <p className="text-red-100">De 6 a 14 años</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Incluye</h3>
            <p className="text-red-100">Camiseta, material, seguro y diploma</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campus-navidad">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-6"
              >
                Más Información
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/campus-navidad/inscripcion">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-6"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Inscríbete Ahora
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

