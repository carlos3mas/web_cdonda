export const TIPOS_INSCRIPCION_ANUAL = [
  {
    id: 'querubines-chupetin',
    label: 'Querubines / Chupetín',
    descripcion: 'Iniciación al fútbol para los más pequeños del club',
    edades: '3 - 6 años',
    precio: null, // pendiente confirmar
    color: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'futbol-8',
    label: 'Fútbol 8',
    descripcion: 'Categorías prebenjamín y benjamín',
    edades: '7 - 10 años',
    precio: null, // pendiente confirmar
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'futbol-11',
    label: 'Fútbol 11',
    descripcion: 'Categorías alevín, infantil, cadete, juvenil y sénior',
    edades: '11+ años',
    precio: null, // pendiente confirmar
    color: 'from-red-600 to-red-800',
  },
] as const

export type TipoAnualId = (typeof TIPOS_INSCRIPCION_ANUAL)[number]['id']

export function getTipoAnual(id: string) {
  return TIPOS_INSCRIPCION_ANUAL.find((t) => t.id === id) ?? null
}

export const MODALIDADES_PAGO_ANUAL = [
  { id: 'mensual', label: 'Mensual', descripcion: 'Pago mes a mes' },
  { id: 'trimestral', label: 'Trimestral', descripcion: 'Pago cada 3 meses' },
  { id: 'anual', label: 'Temporada completa', descripcion: 'Pago único por toda la temporada' },
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
