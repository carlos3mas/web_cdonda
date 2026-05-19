'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InscripcionFormData } from '@/types'
import { cn } from '@/lib/utils'
import {
  CAMPUS_VERANO_EDADES,
  CAMPUS_VERANO_EQUIPACION,
  CAMPUS_VERANO_MESES,
  CAMPUS_VERANO_PRECIOS,
  CAMPUS_VERANO_SEMANAS,
  CAMPUS_VERANO_TALLAS,
  calcularPrecioCampus,
  requiereDobleEquipacion,
} from '@/lib/campusVeranoConfig'

interface CampusVeranoFormFieldsProps {
  formData: Omit<InscripcionFormData, 'justificantePago'>
  semanasSeleccionadas: string[]
  onChange: (field: string, value: string | boolean) => void
  onToggleSemana: (semanaId: string) => void
  fieldErrors?: Record<string, string>
  t: (key: string) => string
}

function FieldHint({ message }: { message?: string }) {
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
        {label} *
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
      <FieldHint message={error} />
    </div>
  )
}

export function CampusVeranoFormFields({
  formData,
  semanasSeleccionadas,
  onChange,
  onToggleSemana,
  fieldErrors = {},
  t,
}: CampusVeranoFormFieldsProps) {
  const dobleEquipacion = requiereDobleEquipacion(semanasSeleccionadas.length)
  const precioEstimado = calcularPrecioCampus(semanasSeleccionadas.length)
  const err = (name: string) => fieldErrors[name]
  const ic = (name: string) =>
    cn('text-sm sm:text-base', err(name) && 'border-red-500 focus-visible:ring-red-500')

  return (
    <>
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        <p className="font-semibold">{CAMPUS_VERANO_EDADES}</p>
        <p className="mt-1 text-red-700">{t('form.documentosRequeridosLista')}</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.datosJugador')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="nombreJugador" className="text-sm">{t('form.nombre')} *</Label>
            <Input
              id="nombreJugador"
              required
              value={formData.nombreJugador}
              onChange={(e) => onChange('nombreJugador', e.target.value)}
              placeholder={t('form.nombrePlaceholder')}
              className={ic('nombreJugador')}
            />
            <FieldHint message={err('nombreJugador')} />
          </div>
          <div>
            <Label htmlFor="apellidos" className="text-sm">{t('form.apellidos')} *</Label>
            <Input
              id="apellidos"
              required
              value={formData.apellidos}
              onChange={(e) => onChange('apellidos', e.target.value)}
              placeholder={t('form.apellidosPlaceholder')}
              className={ic('apellidos')}
            />
            <FieldHint message={err('apellidos')} />
          </div>
        </div>

        <div>
          <Label htmlFor="fechaNacimiento" className="text-sm">{t('form.fechaNacimiento')} *</Label>
          <Input
            id="fechaNacimiento"
            type="date"
            required
            value={formData.fechaNacimiento}
            onChange={(e) => onChange('fechaNacimiento', e.target.value)}
            className={ic('fechaNacimiento')}
          />
          <FieldHint message={err('fechaNacimiento')} />
        </div>

        <div>
          <Label htmlFor="direccion" className="text-sm">{t('form.direccion')} *</Label>
          <Input
            id="direccion"
            required
            value={formData.direccion || ''}
            onChange={(e) => onChange('direccion', e.target.value)}
            placeholder={t('form.direccionPlaceholder')}
            className={ic('direccion')}
          />
          <FieldHint message={err('direccion')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="localidad" className="text-sm">{t('form.localidad')} *</Label>
            <Input
              id="localidad"
              required
              value={formData.localidad || ''}
              onChange={(e) => onChange('localidad', e.target.value)}
              placeholder={t('form.localidadPlaceholder')}
              className={ic('localidad')}
            />
            <FieldHint message={err('localidad')} />
          </div>
          <div>
            <Label htmlFor="codigoPostal" className="text-sm">{t('form.codigoPostal')} *</Label>
            <Input
              id="codigoPostal"
              required
              value={formData.codigoPostal || ''}
              onChange={(e) => onChange('codigoPostal', e.target.value)}
              placeholder={t('form.codigoPostalPlaceholder')}
              className={ic('codigoPostal')}
            />
            <FieldHint message={err('codigoPostal')} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="telefono1" className="text-sm">{t('form.telefonoContacto1')} *</Label>
            <Input
              id="telefono1"
              type="tel"
              required
              value={formData.telefono1}
              onChange={(e) => onChange('telefono1', e.target.value)}
              placeholder={t('form.telefonoPlaceholder')}
              className={ic('telefono1')}
            />
            <FieldHint message={err('telefono1')} />
          </div>
          <div>
            <Label htmlFor="telefono2" className="text-sm">{t('form.telefonoContacto2')}</Label>
            <Input
              id="telefono2"
              type="tel"
              value={formData.telefono2}
              onChange={(e) => onChange('telefono2', e.target.value)}
              placeholder={t('form.telefonoPlaceholder')}
              className={ic('telefono2')}
            />
            <FieldHint message={err('telefono2')} />
          </div>
        </div>

        <div>
          <Label htmlFor="enfermedad" className="text-sm">{t('form.enfermedad')}</Label>
          <Input
            id="enfermedad"
            value={formData.enfermedad}
            onChange={(e) => onChange('enfermedad', e.target.value)}
            placeholder={t('form.enfermedadPlaceholder')}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="alergico" className="text-sm">{t('form.alergiaIntolerancia')}</Label>
          <Input
            id="alergico"
            value={formData.alergico}
            onChange={(e) => onChange('alergico', e.target.value)}
            placeholder={t('form.alergicoPlaceholder')}
            className="text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4" id="semanasCampus">
        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.semanasCampus')}</h3>
        <p className="text-sm text-gray-600">{t('form.semanasCampusDesc')}</p>
        <FieldHint message={err('semanasCampus')} />
        <div className="space-y-4">
          {CAMPUS_VERANO_MESES.map(({ key, titulo }) => {
            const semanasDelMes = CAMPUS_VERANO_SEMANAS.filter((s) => s.mes === key)
            if (semanasDelMes.length === 0) return null
            return (
              <div key={key} className="space-y-2">
                <p className="text-sm font-semibold text-gray-800">{titulo}</p>
                <div className="space-y-2">
                  {semanasDelMes.map((semana) => (
                    <label
                      key={semana.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 cursor-pointer hover:border-red-300"
                    >
                      <input
                        type="checkbox"
                        checked={semanasSeleccionadas.includes(semana.id)}
                        onChange={() => onToggleSemana(semana.id)}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium">{semana.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
          {semanasSeleccionadas.length > 0 && precioEstimado != null && (
            <p className="text-sm font-medium text-red-600">
              {t('form.precioEstimado')
                .replace('{count}', String(semanasSeleccionadas.length))
                .replace('{precio}', String(precioEstimado))}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="diasSueltos" className="text-sm">{t('form.diasSueltos')}</Label>
          <Textarea
            id="diasSueltos"
            value={formData.diasSueltos}
            onChange={(e) => onChange('diasSueltos', e.target.value)}
            placeholder={t('form.diasSueltosPlaceholder')}
            className={cn('text-sm sm:text-base min-h-[80px]', err('diasSueltos') && 'border-red-500')}
            rows={3}
          />
          <FieldHint message={err('diasSueltos')} />
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <p className="font-semibold text-red-600 mb-2">{t('form.cuotaCampus')}</p>
          <ul className="space-y-1 text-sm text-gray-700">
            {CAMPUS_VERANO_PRECIOS.map((item) => (
              <li key={item.semanas} className="flex justify-between gap-4">
                <span>{item.label}</span>
                <span className="font-semibold">{item.precio}€</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.equipacionGratuita')}</h3>
        <p className="text-sm text-gray-700">{CAMPUS_VERANO_EQUIPACION.unaSemana}</p>
        <p className="text-sm text-gray-700">{CAMPUS_VERANO_EQUIPACION.dosSemanasOMas}</p>
        {dobleEquipacion && (
          <p className="text-sm font-medium text-red-600">{t('form.equipacionDobleAviso')}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <TallaSelect
            id="tallaCamiseta"
            label={t('form.tallaCamiseta')}
            value={formData.tallaCamiseta || ''}
            options={CAMPUS_VERANO_TALLAS.camiseta}
            onChange={(v) => onChange('tallaCamiseta', v)}
            error={err('tallaCamiseta')}
          />
          <TallaSelect
            id="tallaPantalon"
            label={t('form.tallaPantalon')}
            value={formData.tallaPantalon || ''}
            options={CAMPUS_VERANO_TALLAS.pantalon}
            onChange={(v) => onChange('tallaPantalon', v)}
            error={err('tallaPantalon')}
          />
          <TallaSelect
            id="tallaCalcetines"
            label={t('form.tallaCalcetines')}
            value={formData.tallaCalcetines || ''}
            options={CAMPUS_VERANO_TALLAS.calcetines}
            onChange={(v) => onChange('tallaCalcetines', v)}
            error={err('tallaCalcetines')}
          />
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold border-b pb-2">{t('form.autorizacionTutor')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="nombreTutor" className="text-sm">{t('form.nombreTutor')} *</Label>
            <Input
              id="nombreTutor"
              required
              value={formData.nombreTutor}
              onChange={(e) => onChange('nombreTutor', e.target.value)}
              placeholder={t('form.nombreTutorPlaceholder')}
              className={ic('nombreTutor')}
            />
            <FieldHint message={err('nombreTutor')} />
          </div>
          <div>
            <Label htmlFor="dni" className="text-sm">{t('form.dniTutor')} *</Label>
            <Input
              id="dni"
              required
              value={formData.dni}
              onChange={(e) => onChange('dni', e.target.value)}
              placeholder={t('form.dniPlaceholder')}
              className={ic('dni')}
            />
            <FieldHint message={err('dni')} />
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed rounded-lg bg-gray-50 border border-gray-200 p-4">
          {t('form.autorizacionTutorTexto')}
        </p>
      </div>

      <div>
        <Label htmlFor="numeroSeguridadSocial" className="text-sm">{t('form.sipJugador')} *</Label>
        <Input
          id="numeroSeguridadSocial"
          required
          value={formData.numeroSeguridadSocial}
          onChange={(e) => onChange('numeroSeguridadSocial', e.target.value)}
          placeholder={t('form.sipPlaceholder')}
          className={ic('numeroSeguridadSocial')}
        />
        <FieldHint message={err('numeroSeguridadSocial')} />
      </div>
    </>
  )
}
