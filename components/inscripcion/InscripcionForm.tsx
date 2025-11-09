'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InscripcionFormData } from '@/types'
import { Download, Loader2, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import SignaturePad from 'signature_pad'

interface InscripcionFormProps {
  tipoInscripcion?: string
}

export function InscripcionForm({ tipoInscripcion }: InscripcionFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoFromUrl = searchParams?.get('tipo') || tipoInscripcion || 'campus-navidad'
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [justificanteFile, setJustificanteFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)
  
  const [formData, setFormData] = useState<Omit<InscripcionFormData, 'justificantePago'>>({
    tipoInscripcion: tipoFromUrl,
    nombreJugador: '',
    apellidos: '',
    fechaNacimiento: '',
    dni: '',
    nombreTutor: '',
    telefono1: '',
    telefono2: '',
    enfermedad: '',
    medicacion: '',
    alergico: '',
    numeroSeguridadSocial: '',
    derechosImagen: false
  })

  // Actualizar tipoInscripcion cuando cambie la URL
  useEffect(() => {
    const tipo = searchParams?.get('tipo') || tipoInscripcion || 'campus-navidad'
    setFormData(prev => ({ ...prev, tipoInscripcion: tipo }))
  }, [searchParams, tipoInscripcion])

  useEffect(() => {
    if (!signatureCanvasRef.current) return

    const pad = new SignaturePad(signatureCanvasRef.current, {
      minWidth: 1,
      maxWidth: 2.5,
      penColor: '#111827',
      backgroundColor: 'rgba(255,255,255,0)',
    })

    signaturePadRef.current = pad

    const resizeCanvas = () => {
      const canvas = signatureCanvasRef.current
      if (!canvas) return
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d')?.scale(ratio, ratio)
      pad.clear()
      setSignatureFile(null)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      pad.off()
      signaturePadRef.current = null
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    // Validar que se haya adjuntado el justificante
    if (!justificanteFile) {
      setSubmitStatus('error')
      setErrorMessage('Debes adjuntar el justificante de pago')
      setIsSubmitting(false)
      return
    }

    try {
      if (signaturePadRef.current && signaturePadRef.current.isEmpty()) {
        setSubmitStatus('error')
        setErrorMessage('Debes firmar en el recuadro antes de enviar la inscripción')
        setIsSubmitting(false)
        return
      }

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData()
      
      // Añadir todos los campos del formulario
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'derechosImagen') {
          formDataToSend.append(key, String(value))
        } else {
          formDataToSend.append(key, value as string)
        }
      })
      
      // Añadir el archivo
      formDataToSend.append('justificantePago', justificanteFile)
      if (signaturePadRef.current) {
        const dataUrl = signaturePadRef.current.toDataURL('image/png')
        const blob = await (await fetch(dataUrl)).blob()
        formDataToSend.append('firmaTutor', blob, 'firma.png')
      }

      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al procesar la inscripción')
      }

      const data = await response.json()
      setSubmitStatus('success')
      
      // Descargar el PDF
      if (data.inscripcionId) {
        const pdfResponse = await fetch(`/api/inscripciones/${data.inscripcionId}/pdf`)
        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `inscripcion-${data.inscripcionId}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }
      }

      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof Omit<InscripcionFormData, 'justificantePago'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setErrorMessage('El archivo debe ser una imagen (JPG, PNG, WEBP) o PDF')
        setSubmitStatus('error')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('El archivo no debe superar los 5MB')
        setSubmitStatus('error')
        return
      }

      setJustificanteFile(file)
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }

  const clearSignature = () => {
    signaturePadRef.current?.clear()
    setSignatureFile(null)
  }

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <Card>
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">¡Inscripción Completada!</h2>
            <p className="text-gray-600 mb-4">
              Tu inscripción se ha procesado correctamente. El PDF con los datos se ha descargado automáticamente.
            </p>
            <p className="text-sm text-gray-500">
              Serás redirigido a la página principal en unos segundos...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border border-red-100">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            <span className="text-red-600">Formulario de</span>{' '}
            <span className="text-red-600">Inscripción</span>
          </CardTitle>
          <CardDescription>
            Completa los datos del jugador. Todas las posiciones marcadas con * son obligatorias.
          </CardDescription>
          <div className="mt-4 rounded-xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-5 py-4 text-sm text-white shadow">
            <p className="font-semibold">Información importante</p>
            <p className="mt-1 text-white/85">
              El campus incluye entrenamientos, actividades y comidas. El seguro deportivo se aplica únicamente a jugadores federados.
              No se entrega camiseta ni diploma; el justificante de pago es obligatorio para completar la inscripción.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos del Jugador */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Datos del Jugador</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreJugador">Nombre *</Label>
                  <Input
                    id="nombreJugador"
                    required
                    value={formData.nombreJugador}
                    onChange={(e) => handleChange('nombreJugador', e.target.value)}
                    placeholder="Nombre del jugador"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    required
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    placeholder="Apellidos del jugador"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  required
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="numeroSeguridadSocial">SIP del Jugador *</Label>
                <Input
                  id="numeroSeguridadSocial"
                  required
                  value={formData.numeroSeguridadSocial}
                  onChange={(e) => handleChange('numeroSeguridadSocial', e.target.value)}
                  placeholder="Ej.: 12 1234567890"
                />
              </div>
            </div>

            {/* Datos del Tutor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Datos del Padre/Madre/Tutor</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreTutor">Nombre del Tutor *</Label>
                  <Input
                    id="nombreTutor"
                    required
                    value={formData.nombreTutor}
                    onChange={(e) => handleChange('nombreTutor', e.target.value)}
                    placeholder="Nombre completo del tutor"
                  />
                </div>
                <div>
                  <Label htmlFor="dni">DNI del Tutor *</Label>
                  <Input
                    id="dni"
                    required
                    value={formData.dni}
                    onChange={(e) => handleChange('dni', e.target.value)}
                    placeholder="12345678A"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono1">Teléfono Madre/Tutor *</Label>
                  <Input
                    id="telefono1"
                    type="tel"
                    required
                    value={formData.telefono1}
                    onChange={(e) => handleChange('telefono1', e.target.value)}
                    placeholder="600 000 000"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono2">Teléfono Padre/Tutor</Label>
                  <Input
                    id="telefono2"
                    type="tel"
                    value={formData.telefono2}
                    onChange={(e) => handleChange('telefono2', e.target.value)}
                    placeholder="600 000 000"
                  />
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información Médica</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="enfermedad">¿Padece alguna enfermedad?</Label>
                  <Input
                    id="enfermedad"
                    value={formData.enfermedad}
                    onChange={(e) => handleChange('enfermedad', e.target.value)}
                    placeholder="Indique la enfermedad o escriba 'No'"
                  />
                </div>
                <div>
                  <Label htmlFor="medicacion">¿Necesita medicación?</Label>
                  <Input
                    id="medicacion"
                    value={formData.medicacion}
                    onChange={(e) => handleChange('medicacion', e.target.value)}
                    placeholder="Detalle la medicación, si procede"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alergico">Alérgico / Intolerante a</Label>
                <Input
                  id="alergico"
                  value={formData.alergico}
                  onChange={(e) => handleChange('alergico', e.target.value)}
                  placeholder="Sustancias, alimentos o intolerancias"
                />
              </div>
            </div>

            {/* Firma */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Firma del Tutor</h3>

              <div className="space-y-3">
                <p className="font-semibold text-red-600">Firma padre/madre o tutor *</p>
                <div className="rounded-xl border border-red-200 bg-white p-4 shadow-sm">
                  <canvas
                    ref={signatureCanvasRef}
                    className="w-full h-40 touch-none"
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                    <span>Dibuja tu firma con el ratón o el dedo.</span>
                    <Button type="button" variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={clearSignature}
                    >
                      Limpiar firma
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Justificante de Pago */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Justificante de Pago</h3>

              <div>
                <Label htmlFor="justificantePago" className="flex items-center gap-2">
                  Justificante de Pago * 
                  <span className="text-xs text-gray-500 font-normal">(Imagen o PDF, máx. 5MB)</span>
                </Label>
                <div className="mt-2">
                  <label 
                    htmlFor="justificantePago" 
                    className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      justificanteFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    {justificanteFile ? (
                      <>
                        <FileText className="h-8 w-8 text-green-600" />
                        <div className="text-left">
                          <p className="font-medium text-green-700">{justificanteFile.name}</p>
                          <p className="text-sm text-green-600">
                            {(justificanteFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-600 ml-auto" />
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">
                            Haz clic para seleccionar el justificante de pago
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, WEBP o PDF (máx. 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                  <input
                    id="justificantePago"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                {justificanteFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600 hover:text-red-700"
                    onClick={() => {
                      setJustificanteFile(null)
                      const input = document.getElementById('justificantePago') as HTMLInputElement
                      if (input) input.value = ''
                    }}
                  >
                    Eliminar archivo
                  </Button>
                )}
              </div>
            </div>

            {/* Autorización de Derechos de Imagen */}
            <div className="border-t pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="derechosImagen"
                    checked={formData.derechosImagen}
                    onChange={(e) => handleChange('derechosImagen', e.target.checked)}
                    className="mt-1 h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    required
                  />
                  <label htmlFor="derechosImagen" className="flex-1 cursor-pointer">
                    <span className="font-semibold text-gray-900">
                      Autorización de Derechos de Imagen *
                    </span>
                    <p className="text-sm text-gray-700 mt-2">
                      Autorizo al Club Deportivo Onda a realizar fotografías y/o vídeos del menor durante las actividades 
                      del campus y a su publicación en redes sociales, página web y medios de comunicación del club con 
                      fines informativos y promocionales.
                    </p>
                    <p className="text-xs text-gray-600 mt-2 italic">
                      Esta autorización es obligatoria para participar en las actividades del club.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Inscribirse y Descargar PDF
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

