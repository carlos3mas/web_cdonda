import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { DashboardStats, Inscripcion } from '@/types'

/** Campos mínimos para la tabla del panel admin (sin blobs ni textos largos). */
export const ADMIN_LIST_SELECT = {
  id: true,
  tipoInscripcion: true,
  nombreJugador: true,
  apellidos: true,
  fechaNacimiento: true,
  dni: true,
  dniJugador: true,
  nombreTutor: true,
  telefono1: true,
  telefono2: true,
  email: true,
  sexo: true,
  pagada: true,
  cuota1Pagada: true,
  cuota2Pagada: true,
  cuota3Pagada: true,
  modalidadPago: true,
  nombreArchivoJustificante: true,
  createdAt: true,
} satisfies Prisma.InscripcionSelect

/** Detalle para el diálogo: sin justificantes, firma ni fotos DNI. */
export const ADMIN_DETAIL_SELECT = {
  id: true,
  tipoInscripcion: true,
  nombreJugador: true,
  apellidos: true,
  fechaNacimiento: true,
  dni: true,
  dniJugador: true,
  direccion: true,
  localidad: true,
  codigoPostal: true,
  semanasCampus: true,
  diasSueltos: true,
  tallaCamiseta: true,
  tallaPantalon: true,
  tallaCalcetines: true,
  nombreTutor: true,
  telefono1: true,
  telefono2: true,
  enfermedad: true,
  medicacion: true,
  alergico: true,
  numeroSeguridadSocial: true,
  pagada: true,
  cuota1Pagada: true,
  cuota2Pagada: true,
  cuota3Pagada: true,
  nombreArchivoJustificante: true,
  nombreArchivoJustificanteCuota2: true,
  nombreArchivoJustificanteCuota3: true,
  justificantePagoMimeType: true,
  firmaMimeType: true,
  nombreArchivoFirma: true,
  derechosImagen: true,
  nombreArchivoDerechosImagen: true,
  comentarios: true,
  email: true,
  sexo: true,
  categoria: true,
  modalidadPago: true,
  descuentoHermanos: true,
  dniFrontalMimeType: true,
  dniReversoMimeType: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InscripcionSelect

type StatsRow = {
  totalInscripciones: bigint | number
  inscripcionesPagadas: bigint | number
  inscripcionesPendientes: bigint | number
}

export type AdminListResult = {
  inscripciones: Inscripcion[]
  stats: DashboardStats
  pagination: {
    offset: number
    limit: number
    total: number
    hasMore: boolean
  }
}

function toStats(row: StatsRow | undefined): DashboardStats {
  return {
    totalInscripciones: Number(row?.totalInscripciones ?? 0),
    inscripcionesPagadas: Number(row?.inscripcionesPagadas ?? 0),
    inscripcionesPendientes: Number(row?.inscripcionesPendientes ?? 0),
  }
}

export async function getInscripcionStats(tipo?: string | null): Promise<DashboardStats> {
  if (tipo && tipo !== 'todos') {
    const [row] = await prisma.$queryRaw<StatsRow[]>`
      SELECT
        COUNT(*) AS totalInscripciones,
        SUM(CASE WHEN pagada = 1 THEN 1 ELSE 0 END) AS inscripcionesPagadas,
        SUM(CASE WHEN pagada = 0 THEN 1 ELSE 0 END) AS inscripcionesPendientes
      FROM inscripciones
      WHERE tipoInscripcion = ${tipo}
    `
    return toStats(row)
  }

  const [row] = await prisma.$queryRaw<StatsRow[]>`
    SELECT
      COUNT(*) AS totalInscripciones,
      SUM(CASE WHEN pagada = 1 THEN 1 ELSE 0 END) AS inscripcionesPagadas,
      SUM(CASE WHEN pagada = 0 THEN 1 ELSE 0 END) AS inscripcionesPendientes
    FROM inscripciones
  `
  return toStats(row)
}

function mapListRow(row: Prisma.InscripcionGetPayload<{ select: typeof ADMIN_LIST_SELECT }>): Inscripcion {
  return {
    ...row,
    tieneDniFrontal: false,
    tieneDniReverso: false,
    updatedAt: row.createdAt,
  } as Inscripcion
}

export async function getInscripcionesForAdminList(
  tipo?: string | null,
  limit = 50,
  offset = 0
): Promise<Inscripcion[]> {
  const where =
    tipo && tipo !== 'todos' ? { tipoInscripcion: tipo } : {}

  const rows = await prisma.inscripcion.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    select: ADMIN_LIST_SELECT,
  })

  return rows.map(mapListRow)
}

export async function getAdminTabData(
  tipo?: string | null,
  limit = 50,
  offset = 0
): Promise<AdminListResult> {
  const [stats, inscripciones] = await Promise.all([
    getInscripcionStats(tipo),
    getInscripcionesForAdminList(tipo, limit, offset),
  ])

  const total = stats.totalInscripciones

  return {
    stats,
    inscripciones,
    pagination: {
      offset,
      limit,
      total,
      hasMore: offset + inscripciones.length < total,
    },
  }
}

export async function getInscripcionDetail(id: string): Promise<Inscripcion | null> {
  const row = await prisma.inscripcion.findUnique({
    where: { id },
    select: ADMIN_DETAIL_SELECT,
  })

  if (!row) return null

  const [flags] = await prisma.$queryRaw<
    { tieneDniFrontal: number; tieneDniReverso: number }[]
  >`
    SELECT
      (dniFrontalEncriptado IS NOT NULL) AS tieneDniFrontal,
      (dniReversoEncriptado IS NOT NULL) AS tieneDniReverso
    FROM inscripciones
    WHERE id = ${id}
  `

  return {
    ...row,
    tieneDniFrontal: Boolean(flags?.tieneDniFrontal),
    tieneDniReverso: Boolean(flags?.tieneDniReverso),
  } as Inscripcion
}
