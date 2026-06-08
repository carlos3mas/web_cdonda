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
  dniFrontalEncriptado: true,
  dniReversoEncriptado: true,
} satisfies Prisma.InscripcionSelect

type StatsRow = {
  totalInscripciones: bigint | number
  inscripcionesPagadas: bigint | number
  inscripcionesPendientes: bigint | number
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

export async function getInscripcionesForAdminList(
  tipo?: string | null,
  limit = 50
): Promise<Inscripcion[]> {
  const where =
    tipo && tipo !== 'todos' ? { tipoInscripcion: tipo } : {}

  const rows = await prisma.inscripcion.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: ADMIN_LIST_SELECT,
  })

  return rows.map((row) => ({
    ...row,
    tieneDniFrontal: false,
    tieneDniReverso: false,
    updatedAt: row.createdAt,
  })) as Inscripcion[]
}

type DetailRow = Prisma.InscripcionGetPayload<{ select: typeof ADMIN_DETAIL_SELECT }>

export function mapInscripcionDetail(row: DetailRow): Inscripcion {
  const { dniFrontalEncriptado, dniReversoEncriptado, ...rest } = row
  return {
    ...rest,
    tieneDniFrontal: Boolean(dniFrontalEncriptado),
    tieneDniReverso: Boolean(dniReversoEncriptado),
  } as Inscripcion
}
