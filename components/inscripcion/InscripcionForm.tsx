'use client'

import { useState, useEffect } from 'react'
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
  
  const [formData, setFormData] = useState<Omit<InscripcionFormData, 'justificantePago'>>({
    tipoInscripcion: tipoFromUrl,
    nombreJugador: '',
    apellidos: '',
    fechaNacimiento: '',
    dni: '',
    nombreTutor: '',
    telefono1: '',
    telefono2: '',
    email: '',
    tieneHermanos: 'no',
    alergias: '',
    observaciones: '',
    derechosImagen: false
  })

  // Actualizar tipoInscripcion cuando cambie la URL
  useEffect(() => {
    const tipo = searchParams?.get('tipo') || tipoInscripcion || 'campus-navidad'
    setFormData(prev => ({ ...prev, tipoInscripcion: tipo }))
  }, [searchParams, tipoInscripcion])

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
      // Validar tipo de archivo (imágenes y PDFs)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setErrorMessage('El archivo debe ser una imagen (JPG, PNG, WEBP) o PDF')
        setSubmitStatus('error')
        return
      }
      
      // Validar tamaño (máximo 5MB)
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
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Inscripción</CardTitle>
          <CardDescription>
            Todos los campos marcados con * son obligatorios
          </CardDescription>
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

              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    required
                    value={formData.dni}
                    onChange={(e) => handleChange('dni', e.target.value)}
                    placeholder="12345678A"
                  />
                </div>
              </div>
            </div>

            {/* Datos del Tutor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Datos del Padre/Madre/Tutor</h3>
              
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

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono1">Teléfono 1 *</Label>
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
                  <Label htmlFor="telefono2">Teléfono 2 (opcional)</Label>
                  <Input
                    id="telefono2"
                    type="tel"
                    value={formData.telefono2}
                    onChange={(e) => handleChange('telefono2', e.target.value)}
                    placeholder="600 000 000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@ejemplo.com"
                />
              </div>
            </div>

            {/* Información Adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Información Adicional</h3>
              
              <div>
                <Label htmlFor="tieneHermanos">¿Tiene hermanos en el campus? *</Label>
                <Select
                  value={formData.tieneHermanos}
                  onValueChange={(value) => handleChange('tieneHermanos', value)}
                >
                  <SelectTrigger id="tieneHermanos">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="alergias">Alergias o Enfermedades</Label>
                <Textarea
                  id="alergias"
                  value={formData.alergias}
                  onChange={(e) => handleChange('alergias', e.target.value)}
                  placeholder="Indique si el jugador tiene alguna alergia o enfermedad relevante"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  placeholder="Cualquier información adicional que considere relevante"
                  rows={3}
                />
              </div>

              {/* Justificante de Pago */}
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

