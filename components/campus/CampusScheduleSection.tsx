'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export function CampusScheduleSection() {
  const { t } = useI18n()
  
  const schedule = [
    { time: '9:00 - 9:30', activity: t('campusSchedule.recepcion'), description: t('campusSchedule.recepcionDesc') },
    { time: '9:30 - 10:45', activity: t('campusSchedule.entrenamientoTecnico'), description: t('campusSchedule.entrenamientoTecnicoDesc') },
    { time: '10:45 - 11:15', activity: t('campusSchedule.almuerzo'), description: t('campusSchedule.almuerzoDesc') },
    { time: '11:15 - 12:30', activity: t('campusSchedule.partidos'), description: t('campusSchedule.partidosDesc') },
    { time: '12:30 - 13:00', activity: t('campusSchedule.actividades'), description: t('campusSchedule.actividadesDesc') },
  ]

  return (
    <section id="campus-horario" className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
            <span className="text-blue-600">{t('campusSchedule.horarioDiarioTitle')}</span>{' '}
            <span className="text-red-600">{t('campusSchedule.horarioDiarioSubtitle')}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-3">
            {t('campusSchedule.diaTipico')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {schedule.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
                <Card className="border border-red-100 bg-white/95 hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
                        <h3 className="font-bold text-sm sm:text-base md:text-lg text-red-600 leading-tight">{item.activity}</h3>
                        <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-red-600 bg-red-50 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full self-start sm:self-auto whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="mx-auto max-w-4xl rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-6 py-5 sm:px-8 sm:py-5 md:px-10 md:py-6 text-center text-white shadow-[0_18px_45px_rgba(139,0,0,0.35)]">
            <p className="text-xs sm:text-sm text-white/90 px-3 leading-relaxed">
              <strong>{t('campusSchedule.nota')}</strong> {t('campusSchedule.notaHorario')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

