'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, ChevronLeft, Download, Loader2 } from 'lucide-react'
import SignaturePad from 'signature_pad'
import { InscripcionAnualStep1 } from './InscripcionAnualStep1'
import { InscripcionAnualStep2, type AnualFormData } from './InscripcionAnualStep2'
import { InscripcionAnualCuotas } from './InscripcionAnualCuotas'
import { type TipoAnualId, getTipoAnual } from '@/lib/anualConfig'
import {
  getInscripcionAnualSchema,
  issuesToFieldErrors,
  scrollToField,
} from '@/lib/inscripcionValidation'

const FORM_INICIAL: AnualFormData = {
  nombreJugador: '', apellidos: '', dniJugador: '', fechaNacimiento: '', sexo: '', email: '',
  direccion: '', localidad: '', codigoPostal: '',
  nombreTutor: '', dni: '', relacionTutor: '', telefono1: '', telefono2: '',
  enfermedad: '', medicacion: '', alergico: '', numeroSeguridadSocial: '',
  tallaCamiseta: '', tallaPantalon: '', tallaCalcetines: '',
  modalidadPago: '', descuentoHermanos: 'no', padresSeparados: false, derechosImagen: false, lopd: false, comentarios: '',
}

function ProgressBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Paso {step} de 2
        </span>
        <span className="text-xs text-gray-400">
          {step === 1 ? 'Selección de categoría' : 'Datos de inscripción'}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-600 rounded-full"
          initial={{ width: step === 1 ? '50%' : '0%' }}
          animate={{ width: step === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  )
}

export function InscripcionAnualForm() {
  const [mode, setMode] = useState<'inscripcion' | 'cuotas'>('inscripcion')
  const [step, setStep] = useState<1 | 2>(1)
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoAnualId | null>(null)
  const [formData, setFormData] = useState<AnualFormData>(FORM_INICIAL)
  const [dniFrontal, setDniFrontal] = useState<File | null>(null)
  const [dniReverso, setDniReverso] = useState<File | null>(null)
  const [justificante, setJustificante] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const signaturePadRef = useRef<SignaturePad | null>(null)
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleChange = (field: keyof AnualFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      if (!prev[field as string]) return prev
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  const handleContinuar = () => {
    if (tipoSeleccionado) setStep(2)
  }

  const canvasToBlob = async (): Promise<Blob | null> => {
    if (!signatureCanvasRef.current) return null
    const canvas = signatureCanvasRef.current
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setErrorMessage('')

    // Validación LOPD
    if (!formData.lopd) {
      setFieldErrors({ lopd: 'Debes aceptar la política de privacidad para continuar' })
      scrollToField('lopd')
      return
    }

    // Validación Zod
    const parsed = getInscripcionAnualSchema().safeParse({
      ...formData,
      categoria: tipoSeleccionado,
    })
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({ path: i.path, message: i.message }))
      const errors = issuesToFieldErrors(issues)
      setFieldErrors(errors)
      setErrorMessage('Revisa los campos marcados en rojo')
      const firstField = Object.keys(errors)[0]
      if (firstField) scrollToField(firstField)
      return
    }

    if (formData.modalidadPago !== 'unico' && !justificante) {
      setFieldErrors({ justificante: 'Debes adjuntar el justificante de pago (cuota 1)' })
      scrollToField('justificante')
      return
    }

    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      setFieldErrors({ firmaTutor: 'La firma del tutor/a es obligatoria' })
      scrollToField('firmaTutor')
      return
    }

    setSubmitStatus('submitting')

    try {
      const fd = new FormData()
      fd.append('tipoInscripcion', 'anual')
      fd.append('categoria', tipoSeleccionado!)

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'derechosImagen' || key === 'lopd' || key === 'padresSeparados') {
          fd.append(key, String(value))
        } else if (typeof value === 'string' && value.trim()) {
          fd.append(key, value.trim())
        }
      })

      if (dniFrontal) fd.append('dniFrontal', dniFrontal)
      if (dniReverso) fd.append('dniReverso', dniReverso)
      if (justificante) fd.append('justificantePago', justificante)

      const firmaBlob = await canvasToBlob()
      if (firmaBlob) fd.append('firmaTutor', firmaBlob, 'firma.png')

      const res = await fetch('/api/inscripciones', { method: 'POST', body: fd })
      const data = await res.json() as {
        success?: boolean
        inscripcionId?: string
        error?: string
        details?: string
        issues?: { path: (string | number)[]; message: string }[]
      }

      if (!res.ok) {
        if (data.issues?.length) {
          const errors = issuesToFieldErrors(data.issues)
          setFieldErrors(errors)
          setErrorMessage('Revisa los campos marcados')
          setSubmitStatus('error')
          return
        }
        throw new Error(data.error || data.details || 'Error al enviar la inscripción')
      }

      setSubmitStatus('success')
      if (data.inscripcionId) void downloadPdf(data.inscripcionId)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error desconocido')
      setSubmitStatus('error')
    }
  }

  const downloadPdf = async (id: string) => {
    try {
      const res = await fetch(`/api/inscripciones/${id}/pdf`)
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inscripcion-anual-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      // sin bloquear
    }
  }

  if (mode === 'inscripcion' && submitStatus === 'success') {
    const tipo = tipoSeleccionado ? getTipoAnual(tipoSeleccionado) : null
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card>
          <CardContent className="pt-10 pb-10 px-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Inscripción completada!</h2>
            {tipo && (
              <p className="text-gray-600 mb-2">Categoría: <strong>{tipo.label}</strong></p>
            )}
            <p className="text-sm text-gray-500 leading-relaxed">
              Hemos recibido tu inscripción. En breve el club se pondrá en contacto contigo para confirmar los detalles.
            </p>
            {formData.modalidadPago === 'unico' && !justificante && (
              <p className="text-sm text-amber-700 mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                Recuerda subir el justificante del pago único antes del <strong>5 de agosto</strong> en la pestaña
                «Añadir o actualizar justificantes».
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant={mode === 'inscripcion' ? 'default' : 'outline'}
          className={mode === 'inscripcion' ? 'bg-red-600 hover:bg-red-700' : ''}
          onClick={() => setMode('inscripcion')}
        >
          Nueva inscripción anual
        </Button>
        <Button
          type="button"
          variant={mode === 'cuotas' ? 'default' : 'outline'}
          className={mode === 'cuotas' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          onClick={() => setMode('cuotas')}
        >
          Añadir o actualizar justificantes
        </Button>
      </div>

      {mode === 'cuotas' ? (
        <InscripcionAnualCuotas />
      ) : (
      <Card className="border border-red-100">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-red-600">
            Inscripción Anual CD Onda
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Temporada 2026 · Completa los datos para formalizar la inscripción
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ProgressBar step={step} />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
                  <InscripcionAnualStep1
                    tipoSeleccionado={tipoSeleccionado}
                    onSeleccionar={setTipoSeleccionado}
                    onContinuar={handleContinuar}
                  />
                </motion.div>
              ) : (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

                  {/* Banner categoría seleccionada */}
                  {tipoSeleccionado && (() => {
                    const tipo = getTipoAnual(tipoSeleccionado)
                    return tipo ? (
                      <div className={`mb-6 rounded-xl bg-gradient-to-r ${tipo.color} p-4 text-white flex items-center justify-between`}>
                        <div>
                          <p className="text-xs uppercase tracking-wider opacity-80">Categoría seleccionada</p>
                          <p className="font-bold text-lg">{tipo.label}</p>
                          <p className="text-sm opacity-90">{tipo.descripcion}</p>
                        </div>
                        <Button type="button" variant="ghost" size="sm"
                          className="text-white hover:bg-white/20 text-xs"
                          onClick={() => setStep(1)}>
                          <ChevronLeft className="h-3 w-3 mr-1" /> Cambiar
                        </Button>
                      </div>
                    ) : null
                  })()}

                  <InscripcionAnualStep2
                    formData={formData}
                    onChange={handleChange}
                    categoriaSeleccionada={tipoSeleccionado}
                    dniFrontal={dniFrontal}
                    dniReverso={dniReverso}
                    justificante={justificante}
                    onDniFrontal={setDniFrontal}
                    onDniReverso={setDniReverso}
                    onJustificante={setJustificante}
                    signaturePadRef={signaturePadRef}
                    signatureCanvasRef={signatureCanvasRef}
                    fieldErrors={fieldErrors}
                  />

                  {submitStatus === 'error' && errorMessage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="mt-6 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                      role="alert">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{errorMessage}</p>
                    </motion.div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Button type="button" variant="outline" size="lg"
                      className="sm:w-auto border-gray-300"
                      onClick={() => setStep(1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> Volver
                    </Button>
                    <Button type="submit" size="lg"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-5 text-base"
                      disabled={submitStatus === 'submitting'}>
                      {submitStatus === 'submitting' ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando...</>
                      ) : (
                        <><Download className="mr-2 h-5 w-5" /> Enviar inscripción</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
      )}
    </motion.div>
  )
}
