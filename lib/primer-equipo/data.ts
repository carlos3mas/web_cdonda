import type { DatosCompeticion } from './types'

/**
 * Datos de competición del primer equipo.
 * Actualiza partidos, clasificación y estadísticas con la información real de la temporada.
 *
 * Ejemplo de partido:
 * { id: '1', jornada: 1, fecha: 'SEPT 14', hora: '11:00', local: true,
 *   rival: 'Rival FC', golesLocal: 2, golesVisitante: 1, estadio: 'Estadio Enrique Saura', finalizado: true }
 */
export const datosCompeticion: DatosCompeticion = {
  temporada: '2025/26',
  liga: 'Liga Comunitat FFCV',
  partidos: [],
  clasificacion: [
    {
      id: 'cd-onda',
      posicion: 0,
      nombre: 'Club Deportivo Onda',
      logo: '/images/logos/escudo-cd-onda.webp',
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      pts: 0,
      esNuestroClub: true,
    },
  ],
  estadisticas: {
    jugados: 0,
    ganados: 0,
    empates: 0,
    perdidos: 0,
    golesFavor: 0,
    golesContra: 0,
  },
}
