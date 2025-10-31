'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'

export function ClubHeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden hero-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <Trophy className="h-20 w-20" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Club Deportivo Onda
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-red-50">
              Más de 75 años formando jugadores y personas
            </p>
            <p className="text-lg md:text-xl mb-8 text-red-100 max-w-3xl mx-auto">
              Un club con historia, pasión y valores. Desde 1944 transmitiendo 
              el amor por el fútbol en el corazón de Castellón.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/campus-navidad">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-6">
                Campus de Navidad 2025
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-6"
              onClick={() => {
                document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Contacto
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

