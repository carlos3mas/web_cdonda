/** Primer equipo: desactivado en producción hasta activar el panel /club */
export function isPrimerEquipoEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_PRIMER_EQUIPO === 'true'
}
