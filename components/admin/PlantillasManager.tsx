'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlantillaPDF } from '@/types'
import { Upload, Download, Trash2, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// Tipos de inscripción disponibles
const tiposInscripcion = [
  { value: 'campus-navidad', label: 'Campus de Navidad', icon: '🎄' },
  { value: 'campus-pascua', label: 'Campus de Pascua', icon: '🐣' },
  { value: 'campus-verano', label: 'Campus de Verano', icon: '☀️' },
  { value: 'anual', label: 'Inscripción Anual', icon: '📅' }
]

export function PlantillasManager() {
  const [plantillas, setPlantillas] = useState<Record<string, PlantillaPDF | null>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadPlantillas()
  }, [loadPlantillas])

  const loadPlantillas = useCallback(async () => {
    try {
      const response = await fetch('/api/plantillas')
      const data: PlantillaPDF[] = await response.json()
      
      // Organizar plantillas por tipo
      const plantillasMap: Record<string, PlantillaPDF | null> = {}
      tiposInscripcion.forEach(tipo => {
        plantillasMap[tipo.value] = data.find(p => p.tipoInscripcion === tipo.value) || null
      })
      
      setPlantillas(plantillasMap)
    } catch (error) {
      console.error('Error al cargar plantillas:', error)
      showMessage('error', 'Error al cargar plantillas')
    }
  }, [])

  const handleUpload = async (tipo: string, file: File) => {
    setUploading(tipo)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tipoInscripcion', tipo)

      const response = await fetch('/api/plantillas', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir plantilla')
      }

      await loadPlantillas()
      showMessage('success', 'Plantilla subida correctamente')
    } catch (error) {
      console.error('Error al subir plantilla:', error)
      showMessage('error', error instanceof Error ? error.message : 'Error al subir plantilla')
    } finally {
      setUploading(null)
    }
  }

  const handleDelete = async (tipo: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      return
    }

    try {
      const response = await fetch(`/api/plantillas?tipo=${tipo}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar plantilla')
      }

      await loadPlantillas()
      showMessage('success', 'Plantilla eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar plantilla:', error)
      showMessage('error', 'Error al eliminar plantilla')
    }
  }

  const handleFileSelect = (tipo: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.pdf')) {
        showMessage('error', 'El archivo debe ser un PDF')
        return
      }
      handleUpload(tipo, file)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Plantillas PDF</CardTitle>
          <CardDescription>
            Sube plantillas PDF personalizadas para cada tipo de inscripción. 
            Los PDFs deben tener campos de formulario con los nombres correctos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {tiposInscripcion.map((tipo) => {
              const plantilla = plantillas[tipo.value]
              const isUploading = uploading === tipo.value

              return (
                <motion.div
                  key={tipo.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:border-red-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tipo.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{tipo.label}</h3>
                        <p className="text-sm text-gray-500">{tipo.value}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {plantilla ? (
                        <>
                          <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Configurada
                          </Badge>
                          <div className="flex gap-2">
                            <a 
                              href={plantilla.rutaArchivo} 
                              download
                              className="inline-flex"
                            >
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </Button>
                            </a>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(tipo.value)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Sin plantilla
                        </Badge>
                      )}

                      <label htmlFor={`upload-${tipo.value}`}>
                        <Button 
                          type="button"
                          size="sm"
                          disabled={isUploading}
                          onClick={() => document.getElementById(`upload-${tipo.value}`)?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? 'Subiendo...' : plantilla ? 'Actualizar' : 'Subir'}
                        </Button>
                        <input
                          id={`upload-${tipo.value}`}
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => handleFileSelect(tipo.value, e)}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  {plantilla && (
                    <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{plantilla.nombreArchivo}</span>
                        <span className="text-gray-400">•</span>
                        <span>Actualizado: {new Date(plantilla.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Instrucciones para crear plantillas PDF
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
              <li>Crea tu PDF en Word, LibreOffice u otro editor</li>
              <li>Añade campos de formulario con estos nombres exactos:</li>
              <li className="ml-4">
                <code className="bg-blue-100 px-1 rounded">nombreJugador</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">apellidos</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">fechaNacimiento</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">dni</code>
              </li>
              <li className="ml-4">
                <code className="bg-blue-100 px-1 rounded">nombreTutor</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">telefono1</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">telefono2</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">email</code>
              </li>
              <li className="ml-4">
                <code className="bg-blue-100 px-1 rounded">tieneHermanos</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">alergias</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">observaciones</code>
              </li>
              <li className="ml-4">
                <code className="bg-blue-100 px-1 rounded">fechaInscripcion</code>, 
                <code className="bg-blue-100 px-1 rounded ml-1">idInscripcion</code>
              </li>
              <li>Exporta/guarda como PDF con campos de formulario</li>
              <li>Sube el archivo usando el botón correspondiente</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

