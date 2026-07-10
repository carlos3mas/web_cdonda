import { INSCRIPCION_ANUAL_TALLAS } from '@/lib/anualConfig'

export type TallaCountRow = {
  talla: string
  cantidad: number
}

export type TallasGrupoResumen = {
  filas: TallaCountRow[]
  total: number
}

export type TallasResumenAnual = {
  inscripciones: number
  camiseta: TallasGrupoResumen
  pantalon: TallasGrupoResumen
  calzas: TallasGrupoResumen
}

type TallaRow = {
  tallaCamiseta: string | null
  tallaPantalon: string | null
  tallaCalcetines: string | null
}

function tallyField(rows: TallaRow[], field: keyof TallaRow): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const value = row[field]
    if (!value) continue
    counts[value] = (counts[value] ?? 0) + 1
  }
  return counts
}

function buildGrupo(counts: Record<string, number>, orden: readonly string[]): TallasGrupoResumen {
  const filas: TallaCountRow[] = orden.map((talla) => ({
    talla,
    cantidad: counts[talla] ?? 0,
  }))

  const conocidas = new Set<string>(orden)
  for (const [talla, cantidad] of Object.entries(counts)) {
    if (!conocidas.has(talla)) {
      filas.push({ talla, cantidad })
    }
  }

  const total = filas.reduce((sum, row) => sum + row.cantidad, 0)
  return { filas, total }
}

export function buildTallasResumenAnual(rows: TallaRow[]): TallasResumenAnual {
  const camisetaCounts = tallyField(rows, 'tallaCamiseta')
  const pantalonCounts = tallyField(rows, 'tallaPantalon')
  const calzasCounts = tallyField(rows, 'tallaCalcetines')

  return {
    inscripciones: rows.length,
    camiseta: buildGrupo(camisetaCounts, INSCRIPCION_ANUAL_TALLAS.camiseta),
    pantalon: buildGrupo(pantalonCounts, INSCRIPCION_ANUAL_TALLAS.pantalon),
    calzas: buildGrupo(calzasCounts, INSCRIPCION_ANUAL_TALLAS.calzas),
  }
}
