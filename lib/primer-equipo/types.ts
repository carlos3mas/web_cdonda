export type PartidoPrimerEquipo = {
  id: string
  jornada: number | string
  fecha: string
  hora?: string
  local: boolean
  rival: string
  rivalLogo?: string
  golesLocal?: number | null
  golesVisitante?: number | null
  estadio: string
  finalizado?: boolean
}

export type FilaClasificacion = {
  id: string
  posicion: number
  nombre: string
  logo?: string
  pj: number
  pg: number
  pe: number
  pp: number
  gf: number
  gc: number
  pts: number
  zona?: 'ascenso' | 'promocion' | null
  esNuestroClub?: boolean
}

export type EstadisticasTemporada = {
  jugados: number
  ganados: number
  empates: number
  perdidos: number
  golesFavor: number
  golesContra: number
}

export type DatosCompeticion = {
  temporada: string
  liga: string
  partidos: PartidoPrimerEquipo[]
  clasificacion: FilaClasificacion[]
  estadisticas: EstadisticasTemporada
}
