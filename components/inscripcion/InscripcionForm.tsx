'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
 
import { InscripcionFormData } from '@/types'
import { Download, Loader2, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import SignaturePad from 'signature_pad'
import { useI18n } from '@/lib/i18n/context'

interface InscripcionFormProps {
  tipoInscripcion?: string
}

export function InscripcionForm({ tipoInscripcion }: InscripcionFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoFromUrl = searchParams?.get('tipo') || tipoInscripcion || 'campus-navidad'
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [justificanteFile, setJustificanteFile] = useState<File | null>(null)
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
    derechosImagen: false,
    comentarios: ''
  })

  // Actualizar tipoInscripcion cuando cambie la URL
  useEffect(() => {
    const tipo = searchParams?.get('tipo') || tipoInscripcion || 'campus-navidad'
    setFormData(prev => ({ ...prev, tipoInscripcion: tipo }))
  }, [searchParams, tipoInscripcion])

  useEffect(() => {
    if (!signatureCanvasRef.current) return;

    const canvas = signatureCanvasRef.current;
    const pad = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 2.5,
      penColor: '#111827',
      backgroundColor: 'rgba(255,255,255,0)',
    });
    signaturePadRef.current = pad;

    let resizeTimeout: NodeJS.Timeout | null = null;

    const resizeCanvas = () => {
      if (!canvas || !signaturePadRef.current) return;

      // Guardar los datos de la firma antes de redimensionar
      const data = signaturePadRef.current.toData();

      // Ajustar el tamaño del canvas según el contenedor y la densidad de píxeles
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(ratio, ratio);
      }

      // Restaurar los datos de la firma en el canvas redimensionado
      signaturePadRef.current.fromData(data);
    };

    // Redimensionar inicialmente
    resizeCanvas();

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
      pad.off();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    // Validar que se haya adjuntado el justificante
    if (!justificanteFile) {
      setSubmitStatus('error')
      setErrorMessage(t('form.errorJustificante'))
      setIsSubmitting(false)
      return
    }

    try {
      if (signaturePadRef.current && signaturePadRef.current.isEmpty()) {
        setSubmitStatus('error')
        setErrorMessage(t('form.errorFirma'))
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
      {
        const blob = await canvasToBlob()
        if (blob) formDataToSend.append('firmaTutor', blob, 'firma.png')
      }

      const response = await fetch('/api/inscripciones', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('form.errorJustificante'))
      }

      const data = await response.json()
      setSubmitStatus('success')
      setIsSubmitting(false)
      if (data.inscripcionId) void downloadPdf(data.inscripcionId)

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
        setErrorMessage(t('form.errorArchivo'))
        setSubmitStatus('error')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(t('form.errorTamano'))
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
  }

  const canvasToBlob = async (): Promise<Blob | null> => {
    if (!signatureCanvasRef.current) return null
    const canvas = signatureCanvasRef.current
    if (canvas.toBlob) {
      return await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })
    }
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const res = await fetch(dataUrl)
      return await res.blob()
    } catch {
      return null
    }
  }

  const downloadPdf = async (id: string) => {
    try {
      const url = `/api/inscripciones/${id}/pdf`
      window.open(url, '_blank', 'noopener')
    } catch {}
  }

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 sm:py-10 md:py-12"
      >
        <Card>
          <CardContent className="pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12 px-4 sm:px-6">
            <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-2">{t('form.inscripcionCompletada')}</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-3 leading-relaxed">
              {t('form.inscripcionProcesada')}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 px-3">
              {t('form.redireccionando')}
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
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-semibold">
            <span className="text-red-600">{t('form.formularioInscripcion')}</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-2">
            {t('form.completarDatos')}
          </CardDescription>
          <div className="mt-3 sm:mt-4 rounded-xl bg-gradient-to-r from-[#8b0000] via-[#c91818] to-[#5c0303] px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-white shadow">
            <p className="font-semibold">{t('form.informacionImportante')}</p>
            <p className="mt-1 text-white/85 leading-relaxed">
              {t('form.informacionCampus')}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Datos del Jugador */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.datosJugador')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="nombreJugador" className="text-sm">{t('form.nombre')} *</Label>
                  <Input
                    id="nombreJugador"
                    required
                    value={formData.nombreJugador}
                    onChange={(e) => handleChange('nombreJugador', e.target.value)}
                    placeholder={t('form.nombrePlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos" className="text-sm">{t('form.apellidos')} *</Label>
                  <Input
                    id="apellidos"
                    required
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    placeholder={t('form.apellidosPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fechaNacimiento" className="text-sm">{t('form.fechaNacimiento')} *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  required
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="numeroSeguridadSocial" className="text-sm">{t('form.sipJugador')} *</Label>
                <Input
                  id="numeroSeguridadSocial"
                  required
                  value={formData.numeroSeguridadSocial}
                  onChange={(e) => handleChange('numeroSeguridadSocial', e.target.value)}
                  placeholder={t('form.sipPlaceholder')}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Datos del Tutor */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.datosTutor')}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="nombreTutor" className="text-sm">{t('form.nombreTutor')} *</Label>
                  <Input
                    id="nombreTutor"
                    required
                    value={formData.nombreTutor}
                    onChange={(e) => handleChange('nombreTutor', e.target.value)}
                    placeholder={t('form.nombreTutorPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="dni" className="text-sm">{t('form.dniTutor')} *</Label>
                  <Input
                    id="dni"
                    required
                    value={formData.dni}
                    onChange={(e) => handleChange('dni', e.target.value)}
                    placeholder={t('form.dniPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="telefono1" className="text-sm">{t('form.telefonoMadre')} *</Label>
                  <Input
                    id="telefono1"
                    type="tel"
                    required
                    value={formData.telefono1}
                    onChange={(e) => handleChange('telefono1', e.target.value)}
                    placeholder={t('form.telefonoPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="telefono2" className="text-sm">{t('form.telefonoPadre')}</Label>
                  <Input
                    id="telefono2"
                    type="tel"
                    value={formData.telefono2}
                    onChange={(e) => handleChange('telefono2', e.target.value)}
                    placeholder={t('form.telefonoPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.informacionMedica')}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="enfermedad" className="text-sm">{t('form.enfermedad')}</Label>
                  <Input
                    id="enfermedad"
                    value={formData.enfermedad}
                    onChange={(e) => handleChange('enfermedad', e.target.value)}
                    placeholder={t('form.enfermedadPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="medicacion" className="text-sm">{t('form.medicacion')}</Label>
                  <Input
                    id="medicacion"
                    value={formData.medicacion}
                    onChange={(e) => handleChange('medicacion', e.target.value)}
                    placeholder={t('form.medicacionPlaceholder')}
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alergico" className="text-sm">{t('form.alergico')}</Label>
                <Input
                  id="alergico"
                  value={formData.alergico}
                  onChange={(e) => handleChange('alergico', e.target.value)}
                  placeholder={t('form.alergicoPlaceholder')}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Firma */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.firmaTutor')}</h3>

              <div className="space-y-2 sm:space-y-3">
                <p className="font-semibold text-sm sm:text-base text-red-600">{t('form.firmaPadre')} *</p>
                <div className="rounded-xl border border-red-200 bg-white p-2 sm:p-3 md:p-4 shadow-sm">
                  <canvas
                    ref={signatureCanvasRef}
                    className="w-full h-28 sm:h-32 md:h-40 touch-none border border-gray-200 rounded"
                    style={{ 
                      touchAction: 'none',
                      willChange: 'contents',
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)'
                    }}
                  />
                  <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] xs:text-xs text-gray-500">
                    <span className="text-center sm:text-left">{t('form.dibujaFirma')}</span>
                    <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 text-xs"
                      onClick={clearSignature}
                    >
                      {t('form.limpiarFirma')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Justificante de Pago */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.justificantePago')}</h3>

              {/* Información de cuentas bancarias */}
              <div className="rounded-lg bg-blue-50 border-2 border-blue-400 p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900 text-sm sm:text-base mb-3">
                      Cuentas bancarias para el pago:
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="bg-white rounded-md p-3 sm:p-4 border border-blue-200">
                        <p className="font-semibold text-blue-800 text-xs sm:text-sm mb-1">
                          Caja Rural Onda
                        </p>
                        <p className="text-xs sm:text-sm text-blue-900 font-mono break-all">
                          ES78 3134 - 3499 - 9620 - 1552 - 5021
                        </p>
                      </div>
                      <div className="bg-white rounded-md p-3 sm:p-4 border border-blue-200">
                        <p className="font-semibold text-blue-800 text-xs sm:text-sm mb-1">
                          IBERCAJA
                        </p>
                        <p className="text-xs sm:text-sm text-blue-900 font-mono break-all">
                          ES63 2085 - 9564 - 8603 - 3026 - 2351
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner de alerta sobre el pago */}
              <div className="rounded-lg bg-amber-50 border-2 border-amber-400 p-4 sm:p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 text-sm sm:text-base mb-1.5">
                      {t('form.alertaPagoTitulo')}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                      {t('form.alertaPagoTexto')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="justificantePago" className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span>{t('form.justificantePagoLabel')} *</span>
                  <span className="text-xs text-gray-500 font-normal">{t('form.justificantePagoSub')}</span>
                </Label>
                <div className="mt-2">
                  <label 
                    htmlFor="justificantePago" 
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      justificanteFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    {justificanteFile ? (
                      <>
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-green-600 flex-shrink-0" />
                        <div className="text-center sm:text-left flex-1 min-w-0 px-2">
                          <p className="font-medium text-green-700 text-xs sm:text-sm md:text-base break-words">{justificanteFile.name}</p>
                          <p className="text-xs sm:text-sm text-green-600 mt-0.5">
                            {(justificanteFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0 sm:ml-auto" />
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-gray-400 flex-shrink-0" />
                        <div className="text-center px-2">
                          <p className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
                            {t('form.seleccionarJustificante')}
                          </p>
                          <p className="text-[10px] xs:text-xs text-gray-500 mt-1 leading-relaxed">
                            {t('form.formatosAceptados')}
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
                    {t('form.eliminarArchivo')}
                  </Button>
                )}
              </div>
            </div>

            {/* Comentarios */}
            <div className="border-t pt-4 sm:pt-5 md:pt-6">
              <div>
                <Label htmlFor="comentarios" className="text-sm">{t('form.comentarios')}</Label>
                <Textarea
                  id="comentarios"
                  value={formData.comentarios}
                  onChange={(e) => handleChange('comentarios', e.target.value)}
                  placeholder={t('form.comentariosPlaceholder')}
                  className="text-sm sm:text-base min-h-[100px]"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('form.comentariosDesc')}
                </p>
              </div>
            </div>

            {/* Autorización de Derechos de Imagen */}
            <div className="border-t pt-4 sm:pt-5 md:pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <input
                    type="checkbox"
                    id="derechosImagen"
                    checked={formData.derechosImagen}
                    onChange={(e) => handleChange('derechosImagen', e.target.checked)}
                    className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-red-600 border-gray-300 rounded focus:ring-red-500 flex-shrink-0"
                    required
                  />
                  <label htmlFor="derechosImagen" className="flex-1 cursor-pointer min-w-0">
                    <span className="font-semibold text-sm sm:text-base text-gray-900 block">
                      {t('form.derechosImagen')} *
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2 leading-relaxed">
                      {t('form.derechosImagenTexto')}
                    </p>
                    <p className="text-[10px] xs:text-xs text-gray-600 mt-1 sm:mt-2 italic leading-relaxed">
                      {t('form.derechosImagenObligatorio')}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start sm:items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-xs sm:text-sm leading-relaxed">{errorMessage}</p>
              </motion.div>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-sm sm:text-base py-5 sm:py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  {t('form.procesando')}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('form.inscribirseDescargar')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

