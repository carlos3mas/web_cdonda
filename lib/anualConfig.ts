export const TIPOS_INSCRIPCION_ANUAL = [
  {
    id: 'chupetines',
    label: 'Chupetines',
    descripcion: 'Nacidos en 2022',
    precio: null, // pendiente confirmar
    color: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'querubines',
    label: 'Querubines',
    descripcion: 'Nacidos en 2021',
    precio: null, // pendiente confirmar
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'futbol-8',
    label: 'Fútbol 8',
    descripcion:
      'Categorías prebenjamín, benjamín, alevín de primer año y alevín femenino',
    precio: null, // pendiente confirmar
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'futbol-11',
    label: 'Fútbol 11',
    descripcion: 'Alevín de segundo año, infantil, cadete y juvenil',
    precio: null, // pendiente confirmar
    color: 'from-red-600 to-red-800',
  },
] as const

export type TipoAnualId = (typeof TIPOS_INSCRIPCION_ANUAL)[number]['id']

export function getTipoAnual(id: string) {
  return TIPOS_INSCRIPCION_ANUAL.find((t) => t.id === id) ?? null
}

export const MODALIDADES_PAGO_ANUAL = [
  { id: 'unico', label: 'Pago único', descripcion: 'Un solo pago de toda la cuota' },
  { id: 'fraccionado', label: 'Pago fraccionado', descripcion: 'Pago en 2 cuotas (reserva + resto)' },
] as const

export type ModalidadPagoId = (typeof MODALIDADES_PAGO_ANUAL)[number]['id']

export const SEXOS_ANUAL = [
  { id: 'M', label: 'Masculino' },
  { id: 'F', label: 'Femenino' },
] as const

export const RELACIONES_TUTOR = [
  { id: 'padre', label: 'Padre' },
  { id: 'madre', label: 'Madre' },
  { id: 'tutor-legal', label: 'Tutor/a legal' },
] as const

export const DNI_MIME_TIPOS_VALIDOS = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
export const DNI_TAMANO_MAX_MB = 10

/** Tallas obligatorias inscripción anual (temporada) */
export const INSCRIPCION_ANUAL_TALLAS = {
  camiseta: ['4', '6', '8', '10', '12', '14', 'S', 'M', 'L', 'XL', '2XL'] as const,
  pantalon: ['0/2', '4/6', '8/10', '12', '14', 'S', 'M', 'L', 'XL', '2XL'] as const,
  calzas: ['31-34 (S)', '35-39 (M)', '40-44+ (L)'] as const,
}
