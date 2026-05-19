export const CAMPUS_VERANO_EDADES = 'Nacidos entre 2012 y 2021, ambos inclusive'

export type CampusVeranoSemana = {
  /** Identificador interno (se guarda en BD) */
  id: string
  /** Texto visible en web (como en la hoja de inscripción) */
  label: string
  /** Nombre del checkbox en campus-verano.pdf (Preparar formulario) */
  pdfFieldName: string
  mes: 'junio' | 'julio'
}

/** Semanas del campus de verano 2026 — alineado con el PDF (campos S1–S5) */
export const CAMPUS_VERANO_SEMANAS: CampusVeranoSemana[] = [
  {
    id: 's1',
    label: 'SEMANA (22 - 26 junio 2026)',
    pdfFieldName: 'S1',
    mes: 'junio',
  },
  {
    id: 's2',
    label: 'SEMANA (29 junio - 3 julio 2026)',
    pdfFieldName: 'S2',
    mes: 'junio',
  },
  {
    id: 's3',
    label: 'SEMANA (6 - 10 julio 2026)',
    pdfFieldName: 'S3',
    mes: 'julio',
  },
  {
    id: 's4',
    label: 'SEMANA (13 - 17 julio 2026)',
    pdfFieldName: 'S4',
    mes: 'julio',
  },
  {
    id: 's5',
    label: 'SEMANA (20 - 24 julio 2026)',
    pdfFieldName: 'S5',
    mes: 'julio',
  },
]

export const CAMPUS_VERANO_PRECIOS = [
  { semanas: 1, label: '1 semana', precio: 50 },
  { semanas: 2, label: '2 semanas', precio: 80 },
  { semanas: 3, label: '3 semanas', precio: 120 },
  { semanas: 4, label: '4 semanas', precio: 160 },
] as const

export const CAMPUS_VERANO_EQUIPACION = {
  unaSemana:
    'Por 1 semana: una camiseta, un pantalón y un par de calcetines.',
  dosSemanasOMas:
    'Por 2 semanas o más: dos camisetas, dos pantalones y dos pares de calcetines.',
} as const

export const CAMPUS_VERANO_TALLAS = {
  camiseta: ['4', '8', '12', '16', 'S', 'M', 'L'] as const,
  pantalon: ['4/6', '8/10', '12', '14', 'S', 'M', 'L'] as const,
  calcetines: ['31/34', '35/38', '39/42', '43/46'] as const,
}

export function requiereDobleEquipacion(semanasSeleccionadas: number): boolean {
  return semanasSeleccionadas >= 2
}

export function getSemanaById(id: string): CampusVeranoSemana | undefined {
  return CAMPUS_VERANO_SEMANAS.find((s) => s.id === id)
}

/** Etiquetas legibles a partir del JSON guardado en BD */
export function formatSemanasCampus(stored: string | null | undefined): string {
  if (!stored) return ''
  try {
    const ids = JSON.parse(stored) as string[]
    return ids
      .map((id) => getSemanaById(id)?.label ?? id)
      .filter(Boolean)
      .join(', ')
  } catch {
    return stored
  }
}

export function calcularPrecioCampus(numSemanas: number): number | null {
  if (numSemanas <= 0) return null
  const tier = CAMPUS_VERANO_PRECIOS.find((p) => p.semanas === numSemanas)
  if (tier) return tier.precio
  const max = CAMPUS_VERANO_PRECIOS[CAMPUS_VERANO_PRECIOS.length - 1]
  if (numSemanas >= max.semanas) return max.precio
  return null
}

export const CAMPUS_VERANO_MESES: { key: CampusVeranoSemana['mes']; titulo: string }[] = [
  { key: 'junio', titulo: 'Junio 2026' },
  { key: 'julio', titulo: 'Julio 2026' },
]
