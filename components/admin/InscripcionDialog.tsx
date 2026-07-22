'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Inscripcion } from '@/types'
import { formatDate } from '@/lib/utils'
import { formatSemanasCampus } from '@/lib/campusVeranoConfig'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  HeartPulse,
  CreditCard,
  MapPin,
  Phone,
  Shirt,
  User,
  UserRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface InscripcionDialogProps {
  inscripcion: Inscripcion | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
}

function TipoBadge({ tipo }: { tipo: string }) {
  const label =
    tipo === 'campus-navidad'
      ? 'Campus de Navidad'
      : tipo === 'campus-pascua'
        ? 'Campus de Pascua'
        : tipo === 'campus-verano'
          ? 'Campus de Verano'
          : tipo === 'anual'
            ? 'Inscripción Anual'
            : tipo

  const icon =
    tipo === 'anual' ? (
      <GraduationCap className="h-3.5 w-3.5" />
    ) : (
      <ClipboardList className="h-3.5 w-3.5" />
    )

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
      {icon}
      {label}
    </span>
  )
}

function StatusBadge({ pagada }: { pagada: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide',
        pagada ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          pagada ? 'bg-emerald-600' : 'bg-amber-600'
        )}
        aria-hidden
      />
      {pagada ? 'Pagada' : 'Pendiente'}
    </span>
  )
}

function Field({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value?: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      {icon ? (
        <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold text-slate-900 break-words">
          {value ?? <span className="text-slate-400 font-medium">—</span>}
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2.5">
        <span className="h-9 w-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
          {icon}
        </span>
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-800">
          {title}
        </h3>
      </div>
      <div className="p-4 sm:p-5 space-y-4">{children}</div>
    </section>
  )
}

export function InscripcionDialog({ inscripcion, open, onOpenChange, isLoading }: InscripcionDialogProps) {
  if (!inscripcion) return null

  const isAnual = inscripcion.tipoInscripcion === 'anual'
  const modalidadPagoAnual =
    inscripcion.modalidadPago === 'anual' ? 'unico' : (inscripcion.modalidadPago || 'fraccionado')
  const nombreCompletoJugador = `${inscripcion.nombreJugador} ${inscripcion.apellidos}`.trim()
  const direccionFull = [inscripcion.direccion, inscripcion.localidad, inscripcion.codigoPostal]
    .filter(Boolean)
    .join(' · ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        {isLoading && (
          <p className="px-5 py-2 text-xs text-slate-500 bg-slate-50 border-b border-slate-100">
            Cargando detalle completo…
          </p>
        )}
        <DialogHeader>
          <div className="px-5 sm:px-6 pt-6 pb-5 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                  {nombreCompletoJugador || 'Inscripción'}
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm text-slate-600">
                  ID <span className="font-mono text-[12px]">{inscripcion.id}</span>
                </DialogDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <StatusBadge pagada={inscripcion.pagada} />
                <TipoBadge tipo={inscripcion.tipoInscripcion} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Field
                  icon={<Calendar className="h-4 w-4" />}
                  label="Inscripción"
                  value={formatDate(inscripcion.createdAt)}
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Field
                  icon={<Calendar className="h-4 w-4" />}
                  label="Actualización"
                  value={formatDate(inscripcion.updatedAt)}
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <Field
                  icon={<User className="h-4 w-4" />}
                  label="Nacimiento"
                  value={formatDate(inscripcion.fechaNacimiento)}
                />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-5 sm:px-6 py-6 space-y-4 bg-slate-50/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Jugador" icon={<UserRound className="h-4 w-4" />}>
              {isAnual ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-[108px] h-[144px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center">
                    {inscripcion.tieneFotoFicha ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/inscripciones/${inscripcion.id}/foto-ficha`}
                        alt={`Foto de ficha de ${inscripcion.nombreJugador}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center px-2 text-slate-400">
                        <UserRound className="h-8 w-8 mx-auto mb-1" />
                        <p className="text-[10px] leading-tight">Sin foto</p>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field icon={<User className="h-4 w-4" />} label="Nombre" value={inscripcion.nombreJugador} />
                      <Field icon={<User className="h-4 w-4" />} label="Apellidos" value={inscripcion.apellidos} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field icon={<Calendar className="h-4 w-4" />} label="Fecha de nacimiento" value={formatDate(inscripcion.fechaNacimiento)} />
                      <Field
                        icon={<CreditCard className="h-4 w-4" />}
                        label="DNI"
                        value={inscripcion.dniJugador || '—'}
                      />
                    </div>
                    {inscripcion.tieneFotoFicha ? (
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/api/inscripciones/${inscripcion.id}/foto-ficha`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver foto
                          </Button>
                        </a>
                        <a
                          href={`/api/inscripciones/${inscripcion.id}/foto-ficha`}
                          download={inscripcion.nombreArchivoFotoFicha || 'foto-ficha.jpg'}
                        >
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field icon={<User className="h-4 w-4" />} label="Nombre" value={inscripcion.nombreJugador} />
                    <Field icon={<User className="h-4 w-4" />} label="Apellidos" value={inscripcion.apellidos} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field icon={<Calendar className="h-4 w-4" />} label="Fecha de nacimiento" value={formatDate(inscripcion.fechaNacimiento)} />
                    <Field
                      icon={<CreditCard className="h-4 w-4" />}
                      label="DNI"
                      value={inscripcion.dni || '—'}
                    />
                  </div>
                </>
              )}
            </SectionCard>

            <SectionCard title="Tutor/a" icon={<User className="h-4 w-4" />}>
              <Field icon={<User className="h-4 w-4" />} label="Nombre" value={inscripcion.nombreTutor} />
              {isAnual ? (
                <Field icon={<CreditCard className="h-4 w-4" />} label="DNI tutor" value={inscripcion.dni || '—'} />
              ) : null}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={<Phone className="h-4 w-4" />} label="Teléfono 1" value={inscripcion.telefono1} />
                <Field icon={<Phone className="h-4 w-4" />} label="Teléfono 2" value={inscripcion.telefono2 || '—'} />
              </div>
              {inscripcion.email ? (
                <Field icon={<GraduationCap className="h-4 w-4" />} label="Email" value={inscripcion.email} />
              ) : null}
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SectionCard title="Inscripción" icon={<ClipboardList className="h-4 w-4" />}>
              {direccionFull ? (
                <Field icon={<MapPin className="h-4 w-4" />} label="Dirección" value={direccionFull} />
              ) : (
                <Field icon={<MapPin className="h-4 w-4" />} label="Dirección" value="—" />
              )}

              {inscripcion.semanasCampus ? (
                <Field
                  icon={<Calendar className="h-4 w-4" />}
                  label="Semanas"
                  value={formatSemanasCampus(inscripcion.semanasCampus)}
                />
              ) : null}

              {inscripcion.diasSueltos ? (
                <Field
                  icon={<Calendar className="h-4 w-4" />}
                  label="Días sueltos"
                  value={inscripcion.diasSueltos}
                />
              ) : null}

              {(inscripcion.tallaCamiseta || inscripcion.tallaPantalon || inscripcion.tallaCalcetines) ? (
                <Field
                  icon={<Shirt className="h-4 w-4" />}
                  label="Tallas"
                  value={
                    <span className="text-slate-700">
                      Camiseta <span className="font-black">{inscripcion.tallaCamiseta || '—'}</span>
                      {' · '}
                      Pantalón <span className="font-black">{inscripcion.tallaPantalon || '—'}</span>
                      {' · '}
                      {inscripcion.tipoInscripcion === 'anual' ? 'Calzas' : 'Calcetines'}{' '}
                      <span className="font-black">{inscripcion.tallaCalcetines || '—'}</span>
                    </span>
                  }
                />
              ) : null}

              {inscripcion.descuentoHermanos ? (
                <Field
                  icon={<ClipboardList className="h-4 w-4" />}
                  label="Descuento hermanos"
                  value={
                    inscripcion.descuentoHermanos === '2-hermanos'
                      ? '2 hermanos'
                      : inscripcion.descuentoHermanos === '3-hermanos'
                        ? '3 hermanos'
                        : 'Sin descuento'
                  }
                />
              ) : null}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                  Derechos de imagen
                </span>
                <Badge variant={inscripcion.derechosImagen ? 'default' : 'secondary'}>
                  {inscripcion.derechosImagen ? 'Autorizados' : 'No autorizados'}
                </Badge>
              </div>

              {inscripcion.comentarios ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                    Comentarios
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-800 whitespace-pre-wrap">
                    {inscripcion.comentarios}
                  </p>
                </div>
              ) : null}
            </SectionCard>

            <SectionCard title="Salud" icon={<HeartPulse className="h-4 w-4" />}>
              <Field label="SIP" value={inscripcion.numeroSeguridadSocial || '—'} icon={<CreditCard className="h-4 w-4" />} />
              <Field label="Enfermedad" value={inscripcion.enfermedad || '—'} icon={<HeartPulse className="h-4 w-4" />} />
              <Field label="Medicación" value={inscripcion.medicacion || '—'} icon={<HeartPulse className="h-4 w-4" />} />
              <Field label="Alergias / intolerancias" value={inscripcion.alergico || '—'} icon={<HeartPulse className="h-4 w-4" />} />
            </SectionCard>
          </div>

          <SectionCard title="Documentos" icon={<FileText className="h-4 w-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isAnual && inscripcion.nombreArchivoDerechosImagen ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                    Cláusula derechos de imagen
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 truncate">
                    {inscripcion.nombreArchivoDerechosImagen}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/api/inscripciones/${inscripcion.id}/clausula-derechos-imagen`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </a>
                    <a
                      href={`/api/inscripciones/${inscripcion.id}/clausula-derechos-imagen`}
                      download={inscripcion.nombreArchivoDerechosImagen}
                    >
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                  Justificante
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 truncate">
                  {inscripcion.nombreArchivoJustificante || '—'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`/api/justificantes/${inscripcion.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(!inscripcion.nombreArchivoJustificante && 'pointer-events-none opacity-50')}
                  >
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </a>
                  <a
                    href={`/api/justificantes/${inscripcion.id}`}
                    download={inscripcion.nombreArchivoJustificante || 'justificante.pdf'}
                    className={cn(!inscripcion.nombreArchivoJustificante && 'pointer-events-none opacity-50')}
                  >
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                  PDF de inscripción
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Generado desde plantilla (si existe) o por defecto.
                </p>
                <div className="mt-3">
                  <a href={`/api/inscripciones/${inscripcion.id}/pdf`} download={`inscripcion-${inscripcion.id}.pdf`}>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {isAnual ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                  Cuotas anuales
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={inscripcion.cuota1Pagada ? 'default' : 'secondary'}>
                    {modalidadPagoAnual === 'unico' ? 'Pago único' : 'Cuota 1'}
                  </Badge>
                  {modalidadPagoAnual !== 'unico' ? (
                    <Badge variant={inscripcion.cuota2Pagada ? 'default' : 'secondary'}>Cuota 2</Badge>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/api/justificantes/${inscripcion.id}?cuota=1`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">Justif. C1</Button>
                  </a>
                  {modalidadPagoAnual !== 'unico' ? (
                    <a
                      href={`/api/justificantes/${inscripcion.id}?cuota=2`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(!inscripcion.nombreArchivoJustificanteCuota2 && 'pointer-events-none opacity-40')}
                    >
                      <Button size="sm" variant="outline">Justif. C2</Button>
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {isAnual && (inscripcion.tieneDniFrontal || inscripcion.tieneDniReverso) ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                  DNI (fotos cifradas)
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Solo accesible para personal autorizado.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`/api/inscripciones/${inscripcion.id}/dni?lado=frontal`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(!inscripcion.tieneDniFrontal && 'pointer-events-none opacity-40')}
                  >
                    <Button size="sm" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Ver frontal
                    </Button>
                  </a>
                  <a
                    href={`/api/inscripciones/${inscripcion.id}/dni?lado=reverso`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(!inscripcion.tieneDniReverso && 'pointer-events-none opacity-40')}
                  >
                    <Button size="sm" variant="outline">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Ver reverso
                    </Button>
                  </a>
                </div>
              </div>
            ) : null}
          </SectionCard>
        </div>
      </DialogContent>
    </Dialog>
  )
}

