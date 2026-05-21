'use client'

import { motion } from 'framer-motion'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TIPOS_INSCRIPCION_ANUAL, type TipoAnualId } from '@/lib/anualConfig'
import { cn } from '@/lib/utils'

interface InscripcionAnualStep1Props {
  tipoSeleccionado: TipoAnualId | null
  onSeleccionar: (id: TipoAnualId) => void
  onContinuar: () => void
}

export function InscripcionAnualStep1({
  tipoSeleccionado,
  onSeleccionar,
  onContinuar,
}: InscripcionAnualStep1Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Selecciona tu categoría
        </h2>
        <p className="text-sm text-gray-500">
          Elige el tipo de inscripción que corresponde a la edad del jugador/a
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {TIPOS_INSCRIPCION_ANUAL.map((tipo, index) => {
          const seleccionado = tipoSeleccionado === tipo.id
          return (
            <motion.button
              key={tipo.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              onClick={() => onSeleccionar(tipo.id as TipoAnualId)}
              className={cn(
                'w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
                seleccionado
                  ? 'border-red-600 bg-red-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-sm'
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={cn(
                      'h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-black text-lg shadow-sm',
                      tipo.color
                    )}
                  >
                    {tipo.id === 'querubines-chupetin' ? '⭐' : tipo.id === 'futbol-8' ? '8' : '11'}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('font-bold text-base sm:text-lg', seleccionado ? 'text-red-700' : 'text-gray-900')}>
                      {tipo.label}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{tipo.descripcion}</p>
                    <span className={cn(
                      'inline-block mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      seleccionado ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {tipo.edades}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {seleccionado ? (
                    <CheckCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full bg-red-600 hover:bg-red-700 text-white py-5 text-base font-semibold"
        disabled={!tipoSeleccionado}
        onClick={onContinuar}
      >
        Continuar
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  )
}
