'use client'

import { useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Upload, FileText, CheckCircle, ShieldCheck, X } from 'lucide-react'
import {
  SEXOS_ANUAL,
  MODALIDADES_PAGO_ANUAL,
  RELACIONES_TUTOR,
  INSCRIPCION_ANUAL_TALLAS,
} from '@/lib/anualConfig'
import { cn } from '@/lib/utils'
import SignaturePad from 'signature_pad'

export interface AnualFormData {
  nombreJugador: string
  apellidos: string
  fechaNacimiento: string
  sexo: string
  email: string
  direccion: string
  localidad: string
  codigoPostal: string
  nombreTutor: string
  dni: string
  relacionTutor: string
  telefono1: string
  telefono2: string
  enfermedad: string
  medicacion: string
  alergico: string
  numeroSeguridadSocial: string
  tallaCamiseta: string
  tallaPantalon: string
  tallaCalcetines: string
  modalidadPago: string
  descuentoHermanos: string
  derechosImagen: boolean
  lopd: boolean
  comentarios: string
}

interface InscripcionAnualStep2Props {
  formData: AnualFormData
  onChange: (field: keyof AnualFormData, value: string | boolean) => void
  categoriaSeleccionada?: string | null
  dniFrontal: File | null
  dniReverso: File | null
  justificante: File | null
  onDniFrontal: (file: File | null) => void
  onDniReverso: (file: File | null) => void
  onJustificante: (file: File | null) => void
  signaturePadRef: React.MutableRefObject<SignaturePad | null>
  signatureCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>
  fieldErrors: Record<string, string>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base sm:text-lg font-semibold border-b border-gray-200 pb-2 text-gray-800">
      {children}
    </h3>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-600 mt-1">{message}</p>
}

function TallaSelect({
  id,
  label,
  value,
  options,
  onChange,
  error,
}: {
  id: string
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm">
        {label} <span className="text-red-600">*</span>
      </Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={cn(
            'text-sm sm:text-base',
            error && 'border-red-500 focus:ring-red-500'
          )}
        >
          <SelectValue placeholder="Seleccionar talla" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError message={error} />
    </div>
  )
}

function FileUploadZone({
  id,
  label,
  file,
  onFile,
  required,
  aviso,
}: {
  id: string
  label: string
  file: File | null
  onFile: (f: File | null) => void
  required?: boolean
  aviso?: string
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFile(e.target.files?.[0] ?? null)
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      {aviso && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex gap-2 items-start">
          <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
          {aviso}
        </p>
      )}
      <label
        htmlFor={id}
        className={cn(
          'flex items-center gap-3 p-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          file
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
        )}
      >
        {file ? (
          <>
            <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium truncate flex-1">{file.name}</span>
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600">Seleccionar archivo (JPG, PNG, PDF — máx. 10MB)</span>
          </>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      {file && (
        <button
          type="button"
          onClick={() => onFile(null)}
          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Eliminar
        </button>
      )}
    </div>
  )
}

export function InscripcionAnualStep2({
  formData,
  onChange,
  categoriaSeleccionada,
  dniFrontal,
  dniReverso,
  justificante,
  onDniFrontal,
  onDniReverso,
  onJustificante,
  signaturePadRef,
  signatureCanvasRef,
  fieldErrors,
}: InscripcionAnualStep2Props) {
  const err = (f: string) => fieldErrors[f]
  const ic = (f: string) =>
    cn('text-sm sm:text-base', err(f) && 'border-red-500 focus-visible:ring-red-500')

  useEffect(() => {
    if (!signatureCanvasRef.current) return
    const canvas = signatureCanvasRef.current
    const pad = new SignaturePad(canvas, {
      minWidth: 1, maxWidth: 2.5,
      penColor: '#111827',
      backgroundColor: 'rgba(255,255,255,0)',
    })
    signaturePadRef.current = pad

    let timeout: NodeJS.Timeout | null = null
    const resize = () => {
      if (!canvas || !signaturePadRef.current) return
      const data = signaturePadRef.current.toData()
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(ratio, ratio)
      signaturePadRef.current.fromData(data)
    }
    resize()
    const onResize = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(resize, 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      if (timeout) clearTimeout(timeout)
      pad.off()
    }
  }, [signatureCanvasRef, signaturePadRef])

  return (
    <div className="space-y-8">

      {/* A – Datos del jugador */}
      <div className="space-y-4">
        <SectionTitle>Datos del jugador/a</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="nombreJugador" className="text-sm">Nombre *</Label>
            <Input id="nombreJugador" value={formData.nombreJugador}
              onChange={(e) => onChange('nombreJugador', e.target.value)}
              className={ic('nombreJugador')} placeholder="Nombre" />
            <FieldError message={err('nombreJugador')} />
          </div>
          <div>
            <Label htmlFor="apellidos" className="text-sm">Apellidos *</Label>
            <Input id="apellidos" value={formData.apellidos}
              onChange={(e) => onChange('apellidos', e.target.value)}
              className={ic('apellidos')} placeholder="Apellidos" />
            <FieldError message={err('apellidos')} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="fechaNacimiento" className="text-sm">Fecha de nacimiento *</Label>
            <Input id="fechaNacimiento" type="date" value={formData.fechaNacimiento}
              onChange={(e) => onChange('fechaNacimiento', e.target.value)}
              className={ic('fechaNacimiento')} />
            <FieldError message={err('fechaNacimiento')} />
          </div>
          <div>
            <Label htmlFor="sexo" className="text-sm">Sexo *</Label>
            <Select value={formData.sexo || undefined} onValueChange={(v) => onChange('sexo', v)}>
              <SelectTrigger id="sexo" className={ic('sexo')}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {SEXOS_ANUAL.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={err('sexo')} />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input id="email" type="email" value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={ic('email')} placeholder="correo@ejemplo.com" />
            <FieldError message={err('email')} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Label htmlFor="direccion" className="text-sm">Dirección *</Label>
            <Input id="direccion" value={formData.direccion}
              onChange={(e) => onChange('direccion', e.target.value)}
              className={ic('direccion')} placeholder="Calle, número, piso..." />
            <FieldError message={err('direccion')} />
          </div>
          <div>
            <Label htmlFor="codigoPostal" className="text-sm">Código postal *</Label>
            <Input id="codigoPostal" value={formData.codigoPostal}
              onChange={(e) => onChange('codigoPostal', e.target.value)}
              className={ic('codigoPostal')} placeholder="12345" />
            <FieldError message={err('codigoPostal')} />
          </div>
        </div>
        <div>
          <Label htmlFor="localidad" className="text-sm">Localidad *</Label>
          <Input id="localidad" value={formData.localidad}
            onChange={(e) => onChange('localidad', e.target.value)}
            className={ic('localidad')} placeholder="Localidad" />
          <FieldError message={err('localidad')} />
        </div>
      </div>

      {/* B – Fotos DNI */}
      <div className="space-y-4">
        <SectionTitle>Documento de identidad (DNI / NIE)</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadZone
            id="dniFrontal"
            label="DNI frontal"
            file={dniFrontal}
            onFile={onDniFrontal}
          />
          <FileUploadZone
            id="dniReverso"
            label="DNI reverso"
            file={dniReverso}
            onFile={onDniReverso}
          />
        </div>
      </div>

      {/* C – Datos del tutor */}
      <div className="space-y-4">
        <SectionTitle>Tutor/a responsable</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="nombreTutor" className="text-sm">Nombre completo *</Label>
            <Input id="nombreTutor" value={formData.nombreTutor}
              onChange={(e) => onChange('nombreTutor', e.target.value)}
              className={ic('nombreTutor')} placeholder="Nombre y apellidos" />
            <FieldError message={err('nombreTutor')} />
          </div>
          <div>
            <Label htmlFor="dni" className="text-sm">DNI/NIE del tutor/a *</Label>
            <Input id="dni" value={formData.dni}
              onChange={(e) => onChange('dni', e.target.value)}
              className={ic('dni')} placeholder="12345678A" />
            <FieldError message={err('dni')} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="relacionTutor" className="text-sm">Relación con el jugador/a</Label>
            <Select value={formData.relacionTutor || undefined} onValueChange={(v) => onChange('relacionTutor', v)}>
              <SelectTrigger id="relacionTutor" className="text-sm sm:text-base">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {RELACIONES_TUTOR.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="telefono1" className="text-sm">Teléfono principal *</Label>
            <Input id="telefono1" type="tel" value={formData.telefono1}
              onChange={(e) => onChange('telefono1', e.target.value)}
              className={ic('telefono1')} placeholder="6XX XXX XXX" />
            <FieldError message={err('telefono1')} />
          </div>
          <div>
            <Label htmlFor="telefono2" className="text-sm">Teléfono secundario</Label>
            <Input id="telefono2" type="tel" value={formData.telefono2}
              onChange={(e) => onChange('telefono2', e.target.value)}
              className={ic('telefono2')} placeholder="6XX XXX XXX" />
            <FieldError message={err('telefono2')} />
          </div>
        </div>
      </div>

      {/* D – Equipación */}
      <div className="space-y-4">
        <SectionTitle>Equipación de temporada</SectionTitle>
        <p className="text-sm text-gray-600">
          Indica las tallas para la equipación incluida en la inscripción anual.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <TallaSelect
            id="tallaCamiseta"
            label="Talla camiseta"
            value={formData.tallaCamiseta}
            options={INSCRIPCION_ANUAL_TALLAS.camiseta}
            onChange={(v) => onChange('tallaCamiseta', v)}
            error={err('tallaCamiseta')}
          />
          <TallaSelect
            id="tallaPantalon"
            label="Talla pantalón"
            value={formData.tallaPantalon}
            options={INSCRIPCION_ANUAL_TALLAS.pantalon}
            onChange={(v) => onChange('tallaPantalon', v)}
            error={err('tallaPantalon')}
          />
          <TallaSelect
            id="tallaCalcetines"
            label="Talla calzas"
            value={formData.tallaCalcetines}
            options={INSCRIPCION_ANUAL_TALLAS.calzas}
            onChange={(v) => onChange('tallaCalcetines', v)}
            error={err('tallaCalcetines')}
          />
        </div>
      </div>

      {/* E – Datos médicos */}
      <div className="space-y-4">
        <SectionTitle>Información médica</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="enfermedad" className="text-sm">Enfermedades o condiciones</Label>
            <Input id="enfermedad" value={formData.enfermedad}
              onChange={(e) => onChange('enfermedad', e.target.value)}
              placeholder="Ninguna si no procede" className="text-sm sm:text-base" />
          </div>
          <div>
            <Label htmlFor="medicacion" className="text-sm">Medicación habitual</Label>
            <Input id="medicacion" value={formData.medicacion}
              onChange={(e) => onChange('medicacion', e.target.value)}
              placeholder="Ninguna si no procede" className="text-sm sm:text-base" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="alergico" className="text-sm">Alergias / intolerancias</Label>
            <Input id="alergico" value={formData.alergico}
              onChange={(e) => onChange('alergico', e.target.value)}
              placeholder="Ninguna si no procede" className="text-sm sm:text-base" />
          </div>
          <div>
            <Label htmlFor="numeroSeguridadSocial" className="text-sm">Nº SIP (tarjeta sanitaria)</Label>
            <Input id="numeroSeguridadSocial" value={formData.numeroSeguridadSocial}
              onChange={(e) => onChange('numeroSeguridadSocial', e.target.value)}
              placeholder="Nº SIP" className="text-sm sm:text-base" />
          </div>
        </div>
      </div>

      {/* F – Pago */}
      <div className="space-y-4">
        <SectionTitle>Modalidad de pago</SectionTitle>
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-700">
            Para formalizar la inscripción es obligatorio adjuntar el justificante del primer pago (cuota 1).
          </p>
        </div>
        {categoriaSeleccionada === 'chupetines' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
            <p className="font-semibold underline">Modalidades de pago (Chupetines):</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Pago único: 250€</strong> antes del 30 de septiembre de 2026.
              </li>
              <li>
                <strong>Pago fraccionado:</strong>
                <ul className="list-none mt-1 space-y-1 pl-1">
                  <li>- 1er pago 150€ antes del 30 junio 2026 (imprescindible para reservar plaza).</li>
                  <li>- 2º pago 100€ antes del 30 de septiembre 2026.</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
        {categoriaSeleccionada === 'querubines' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
            <p className="font-semibold underline">Modalidades de pago (Querubines):</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Pago único: 300€</strong> antes del 30 de septiembre de 2026.
              </li>
              <li>
                <strong>Pago fraccionado:</strong>
                <ul className="list-none mt-1 space-y-1 pl-1">
                  <li>- 1er pago 200€ antes del 30 junio 2026 (imprescindible para reservar plaza).</li>
                  <li>- 2º pago 100€ antes del 30 de septiembre 2026.</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
        {categoriaSeleccionada === 'futbol-8' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
            <p>
              <strong>Cuota anual: 400€.</strong> (Camiseta, pantalón y calzas de competición)
            </p>
            <p className="font-semibold underline">Modalidades de pago:</p>
            <ul className="list-none space-y-2 pl-1">
              <li>- <strong>Pago único de 400€</strong> antes del 5 de agosto 2026.</li>
              <li>- <strong>Pago fraccionado:</strong></li>
              <li className="pl-3">- 1er pago 250€ antes del 30 junio 2026 (imprescindible para reservar plaza).</li>
              <li className="pl-3">- 2º pago 150€ antes del 30 de septiembre 2026 (imprescindible para tramitar ficha y reserva de equipación “camiseta, pantalón y calzas de competición”).</li>
              <li>- <strong>Descuento por hermanos en el club:</strong></li>
              <li className="pl-3">• Cuota 2 hermanos: 375€ por jugador.</li>
              <li className="pl-3">• Cuota 3 hermanos: 350€ por jugador.</li>
            </ul>
          </div>
        )}
        {categoriaSeleccionada === 'futbol-11' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-3">
            <p>
              <strong>Cuota anual: 450€.</strong> (Camiseta, pantalón y calzas de competición)
            </p>
            <p className="font-semibold underline">Modalidades de pago:</p>
            <ul className="list-none space-y-2 pl-1">
              <li>- <strong>Pago único de 450€</strong> antes del 5 de agosto 2026.</li>
              <li>- <strong>Pago fraccionado:</strong></li>
              <li className="pl-3">- 1er pago 300€ antes del 30 junio 2026 (imprescindible para reservar plaza).</li>
              <li className="pl-3">- 2º pago 150€ antes del 30 de septiembre 2026 (imprescindible para tramitar ficha y reserva de equipación “camiseta, pantalón y calzas de competición”).</li>
              <li>- <strong>Descuento por hermanos en el club:</strong></li>
              <li className="pl-3">• Cuota 2 hermanos: 425€ por jugador.</li>
              <li className="pl-3">• Cuota 3 hermanos: 400€ por jugador.</li>
            </ul>
          </div>
        )}
        <div>
          <Label htmlFor="modalidadPago" className="text-sm">Modalidad *</Label>
          <Select value={formData.modalidadPago || undefined} onValueChange={(v) => onChange('modalidadPago', v)}>
            <SelectTrigger id="modalidadPago" className={ic('modalidadPago')}>
              <SelectValue placeholder="Seleccionar modalidad" />
            </SelectTrigger>
            <SelectContent>
              {MODALIDADES_PAGO_ANUAL.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label} — {m.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={err('modalidadPago')} />
        </div>

        <div>
          <Label htmlFor="descuentoHermanos" className="text-sm">Descuento por hermanos</Label>
          <Select
            value={formData.descuentoHermanos || 'no'}
            onValueChange={(v) => onChange('descuentoHermanos', v)}
          >
            <SelectTrigger id="descuentoHermanos" className="text-sm sm:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">Sin descuento</SelectItem>
              <SelectItem value="2-hermanos">2 hermanos</SelectItem>
              <SelectItem value="3-hermanos">3 hermanos</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Si no aplica, deja seleccionada la opción “Sin descuento”.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 border-2 border-blue-300 p-4">
          <p className="font-semibold text-blue-900 text-sm mb-2">Cuentas bancarias para el pago:</p>
          <div className="space-y-2">
            <div className="bg-white rounded-md p-3 border border-blue-200">
              <p className="font-semibold text-blue-800 text-xs mb-1">Caja Rural Onda</p>
              <p className="text-xs text-blue-900 font-mono">ES78 3134 - 3499 - 9620 - 1552 - 5021</p>
            </div>
            <div className="bg-white rounded-md p-3 border border-blue-200">
              <p className="font-semibold text-blue-800 text-xs mb-1">IBERCAJA</p>
              <p className="text-xs text-blue-900 font-mono">ES63 2085 - 9564 - 8603 - 3026 - 2351</p>
            </div>
          </div>
        </div>

        <FileUploadZone
          id="justificante"
          label="Justificante de pago (cuota 1)"
          file={justificante}
          onFile={onJustificante}
          required
        />
        <FieldError message={err('justificante')} />
      </div>

      {/* G – Firma */}
      <div className="space-y-3" id="firmaTutor">
        <SectionTitle>Firma del tutor/a</SectionTitle>
        <p className="text-sm font-semibold text-red-600">Firma aquí *</p>
        <div className={cn(
          'rounded-xl border bg-white p-3 shadow-sm',
          err('firmaTutor') ? 'border-red-500' : 'border-red-200'
        )}>
          <canvas
            ref={signatureCanvasRef}
            className="w-full h-32 sm:h-36 touch-none border border-gray-200 rounded"
            style={{ touchAction: 'none' }}
          />
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Dibuja tu firma con el dedo o el ratón</span>
            <Button type="button" variant="outline" size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
              onClick={() => signaturePadRef.current?.clear()}>
              Limpiar
            </Button>
          </div>
        </div>
        <FieldError message={err('firmaTutor')} />
      </div>

      {/* Comentarios */}
      <div>
        <Label htmlFor="comentarios" className="text-sm">Comentarios adicionales</Label>
        <Textarea id="comentarios" value={formData.comentarios}
          onChange={(e) => onChange('comentarios', e.target.value)}
          placeholder="Cualquier información adicional relevante..."
          className="text-sm sm:text-base min-h-[80px]" rows={3} />
      </div>

      {/* Autorizaciones */}
      <div className="space-y-3 border-t pt-5">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" id="derechosImagen"
              checked={formData.derechosImagen}
              onChange={(e) => onChange('derechosImagen', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded flex-shrink-0" />
            <label htmlFor="derechosImagen" className="cursor-pointer">
              <span className="font-semibold text-sm text-gray-900 block">Autorización derechos de imagen *</span>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Autorizo al CD Onda a utilizar imágenes y vídeos del jugador/a en los que pueda aparecer, con fines deportivos, informativos y de promoción del club, sin contraprestación económica.
              </p>
            </label>
          </div>
          <FieldError message={err('derechosImagen')} />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" id="lopd"
              checked={formData.lopd}
              onChange={(e) => onChange('lopd', e.target.checked)}
              className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded flex-shrink-0" />
            <label htmlFor="lopd" className="cursor-pointer">
              <span className="font-semibold text-sm text-gray-900 block">Política de privacidad (LOPD-GDD) *</span>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                He leído y acepto el tratamiento de los datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPD-GDD). Los datos se usarán exclusivamente para gestionar la inscripción al CD Onda y no se cederán a terceros.
              </p>
            </label>
          </div>
          <FieldError message={err('lopd')} />
        </div>
      </div>

    </div>
  )
}
