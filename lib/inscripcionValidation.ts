import { z } from 'zod'

export const INSCRIPCION_FIELD_LABELS: Record<string, string> = {
  nombreJugador: 'Nombre del jugador',
  apellidos: 'Apellidos',
  fechaNacimiento: 'Fecha de nacimiento',
  dni: 'DNI del tutor',
  direccion: 'Dirección',
  localidad: 'Localidad',
  codigoPostal: 'Código postal',
  semanasCampus: 'Semanas del campus',
  diasSueltos: 'Días sueltos',
  nombreTutor: 'Nombre del tutor',
  telefono1: 'Teléfono de contacto',
  telefono2: 'Teléfono 2',
  numeroSeguridadSocial: 'Número SIP',
  tallaCamiseta: 'Talla camiseta',
  tallaPantalon: 'Talla pantalón',
  tallaCalcetines: 'Talla calcetines',
  enfermedad: 'Enfermedad',
  medicacion: 'Medicación',
  alergico: 'Alergias / intolerancias',
  comentarios: 'Comentarios',
  tipoInscripcion: 'Tipo de inscripción',
}

export type InscripcionValidationPayload = {
  tipoInscripcion?: string
  nombreJugador: string
  apellidos: string
  fechaNacimiento: string
  dni: string
  direccion?: string
  localidad?: string
  codigoPostal?: string
  semanasCampus?: string
  diasSueltos?: string
  nombreTutor: string
  telefono1: string
  telefono2?: string
  enfermedad?: string
  medicacion?: string
  alergico?: string
  numeroSeguridadSocial?: string
  tallaCamiseta?: string
  tallaPantalon?: string
  tallaCalcetines?: string
  derechosImagen?: string
  comentarios?: string
}

export type ValidationIssue = { path: (string | number)[]; message: string }

const emptyToUndefined = (val: unknown) =>
  typeof val === 'string' && val.trim() === '' ? undefined : val

export function getInscripcionSchema(isCampusVerano: boolean) {
  return z
    .object({
      tipoInscripcion: z
        .enum(['campus-navidad', 'campus-pascua', 'campus-verano', 'anual'])
        .optional(),
      nombreJugador: z.string().min(2, 'Introduce al menos 2 caracteres'),
      apellidos: z.string().min(2, 'Introduce al menos 2 caracteres'),
      fechaNacimiento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecciona una fecha de nacimiento válida'),
      dni: z
        .string()
        .min(8, 'El DNI/NIE debe tener al menos 8 caracteres')
        .max(20, 'El DNI/NIE es demasiado largo'),
      direccion: isCampusVerano
        ? z.string().min(3, 'Indica la dirección completa')
        : z.string().optional(),
      localidad: isCampusVerano
        ? z.string().min(2, 'Indica la localidad')
        : z.string().optional(),
      codigoPostal: isCampusVerano
        ? z
            .string()
            .min(4, 'El código postal debe tener al menos 4 caracteres')
            .max(10, 'Código postal demasiado largo')
        : z.string().optional(),
      semanasCampus: z.string().optional(),
      diasSueltos: z.string().optional(),
      nombreTutor: z.string().min(2, 'Introduce el nombre del tutor'),
      telefono1: z
        .string()
        .min(9, 'El teléfono debe tener al menos 9 dígitos')
        .max(20, 'Teléfono demasiado largo'),
      telefono2: z.preprocess(
        emptyToUndefined,
        z
          .string()
          .min(9, 'El teléfono 2 debe tener al menos 9 dígitos')
          .max(20, 'Teléfono demasiado largo')
          .optional()
      ),
      enfermedad: z.string().optional(),
      medicacion: z.string().optional(),
      alergico: z.string().optional(),
      numeroSeguridadSocial: isCampusVerano
        ? z.string().min(5, 'El número SIP es obligatorio (mínimo 5 caracteres)')
        : z.string().optional(),
      tallaCamiseta: isCampusVerano
        ? z.string().min(1, 'Selecciona la talla de camiseta')
        : z.string().optional(),
      tallaPantalon: isCampusVerano
        ? z.string().min(1, 'Selecciona la talla de pantalón')
        : z.string().optional(),
      tallaCalcetines: isCampusVerano
        ? z.string().min(1, 'Selecciona la talla de calcetines')
        : z.string().optional(),
      derechosImagen: z.string().optional(),
      comentarios: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!isCampusVerano) return

      const tieneSemanas =
        !!data.semanasCampus && data.semanasCampus.trim().length >= 2
      const tieneDiasSueltos =
        !!data.diasSueltos && data.diasSueltos.trim().length > 0

      if (!tieneSemanas && !tieneDiasSueltos) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Selecciona al menos una semana o indica los días sueltos en el campo correspondiente',
          path: ['semanasCampus'],
        })
      }
    })
}

export function issuesToFieldErrors(
  issues: ValidationIssue[]
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of issues) {
    const key = String(issue.path[0] ?? '')
    if (key && !errors[key]) {
      errors[key] = issue.message
    }
  }
  return errors
}

export function formatValidationIssues(issues: ValidationIssue[]): string {
  if (issues.length === 0) return 'Datos inválidos'
  return issues
    .map((issue) => {
      const field = String(issue.path[0] ?? '')
      const label = INSCRIPCION_FIELD_LABELS[field] ?? (field || 'Formulario')
      return `• ${label}: ${issue.message}`
    })
    .join('\n')
}

export function buildInscripcionValidationPayload(
  formData: {
    tipoInscripcion?: string
    nombreJugador: string
    apellidos: string
    fechaNacimiento: string
    dni: string
    direccion?: string
    localidad?: string
    codigoPostal?: string
    diasSueltos?: string
    nombreTutor: string
    telefono1: string
    telefono2?: string
    enfermedad?: string
    medicacion?: string
    alergico?: string
    numeroSeguridadSocial?: string
    tallaCamiseta?: string
    tallaPantalon?: string
    tallaCalcetines?: string
    derechosImagen?: boolean
    comentarios?: string
  },
  semanasSeleccionadas: string[]
): InscripcionValidationPayload {
  return {
    tipoInscripcion: formData.tipoInscripcion,
    nombreJugador: formData.nombreJugador.trim(),
    apellidos: formData.apellidos.trim(),
    fechaNacimiento: formData.fechaNacimiento.trim(),
    dni: formData.dni.trim(),
    direccion: formData.direccion?.trim() || undefined,
    localidad: formData.localidad?.trim() || undefined,
    codigoPostal: formData.codigoPostal?.trim() || undefined,
    semanasCampus:
      semanasSeleccionadas.length > 0
        ? JSON.stringify(semanasSeleccionadas)
        : undefined,
    diasSueltos: formData.diasSueltos?.trim() || undefined,
    nombreTutor: formData.nombreTutor.trim(),
    telefono1: formData.telefono1.trim(),
    telefono2: formData.telefono2?.trim() || undefined,
    enfermedad: formData.enfermedad?.trim() || undefined,
    medicacion: formData.medicacion?.trim() || undefined,
    alergico: formData.alergico?.trim() || undefined,
    numeroSeguridadSocial: formData.numeroSeguridadSocial?.trim() || undefined,
    tallaCamiseta: formData.tallaCamiseta?.trim() || undefined,
    tallaPantalon: formData.tallaPantalon?.trim() || undefined,
    tallaCalcetines: formData.tallaCalcetines?.trim() || undefined,
    derechosImagen: String(formData.derechosImagen ?? false),
    comentarios: formData.comentarios?.trim() || undefined,
  }
}

// ─── Schema para inscripción anual ───────────────────────────────────────────

export type InscripcionAnualPayload = {
  nombreJugador: string
  apellidos: string
  fechaNacimiento: string
  sexo: string
  email: string
  direccion: string
  localidad: string
  codigoPostal: string
  categoria: string
  nombreTutor: string
  dni: string
  relacionTutor?: string
  telefono1: string
  telefono2?: string
  enfermedad?: string
  medicacion?: string
  alergico?: string
  numeroSeguridadSocial?: string
  tallaCamiseta: string
  tallaPantalon: string
  tallaCalcetines: string
  modalidadPago: string
  descuentoHermanos?: string
  padresSeparados?: string | boolean
  derechosImagen?: string | boolean
  comentarios?: string
}

export function getInscripcionAnualSchema() {
  return z.object({
    nombreJugador: z.string().min(2, 'Introduce al menos 2 caracteres'),
    apellidos: z.string().min(2, 'Introduce al menos 2 caracteres'),
    dniJugador: z
      .string()
      .min(8, 'El DNI/NIE del jugador/a debe tener al menos 8 caracteres')
      .max(20, 'El DNI/NIE del jugador/a es demasiado largo'),
    fechaNacimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecciona una fecha de nacimiento válida'),
    sexo: z.enum(['M', 'F'], { errorMap: () => ({ message: 'Selecciona el sexo' }) }),
    email: z.string().email('Introduce un email válido'),
    direccion: z.string().min(3, 'Indica la dirección completa'),
    localidad: z.string().min(2, 'Indica la localidad'),
    codigoPostal: z
      .string()
      .min(4, 'El código postal debe tener al menos 4 caracteres')
      .max(10, 'Código postal demasiado largo'),
    categoria: z.enum(
      ['chupetines', 'querubines', 'futbol-8', 'futbol-11'],
      { errorMap: () => ({ message: 'Selecciona una categoría válida' }) }
    ),
    nombreTutor: z.string().min(2, 'Introduce el nombre del tutor/a'),
    dni: z
      .string()
      .min(8, 'El DNI/NIE del tutor debe tener al menos 8 caracteres')
      .max(20, 'El DNI/NIE del tutor es demasiado largo'),
    relacionTutor: z.string().optional(),
    telefono1: z
      .string()
      .min(9, 'El teléfono debe tener al menos 9 dígitos')
      .max(20, 'Teléfono demasiado largo'),
    telefono2: z.preprocess(
      emptyToUndefined,
      z.string().min(9, 'El teléfono 2 debe tener al menos 9 dígitos').max(20).optional()
    ),
    enfermedad: z.string().optional(),
    medicacion: z.string().optional(),
    alergico: z.string().optional(),
    numeroSeguridadSocial: z.string().optional(),
    tallaCamiseta: z.string().min(1, 'Selecciona la talla de camiseta'),
    tallaPantalon: z.string().min(1, 'Selecciona la talla de pantalón'),
    tallaCalcetines: z.string().min(1, 'Selecciona la talla de calzas'),
    modalidadPago: z.enum(
      ['unico', 'fraccionado'],
      { errorMap: () => ({ message: 'Selecciona una modalidad de pago' }) }
    ),
    descuentoHermanos: z.enum(['no', '2-hermanos', '3-hermanos']).optional(),
    padresSeparados: z.preprocess(
      (value) => {
        if (value === true || value === 'true') return true
        if (value === false || value === 'false' || value === undefined || value === '') return false
        return value
      },
      z.boolean()
    ),
    derechosImagen: z.preprocess(
      (value) => {
        if (value === true || value === 'true') return true
        if (value === false || value === 'false') return false
        return value
      },
      z.boolean().refine((v) => v, 'Debes aceptar la autorización de derechos de imagen')
    ),
    comentarios: z.string().optional(),
  })
}

export function scrollToField(fieldId: string) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(fieldId)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  if (el instanceof HTMLElement) {
    el.focus({ preventScroll: true })
  }
}
