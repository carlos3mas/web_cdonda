/** Extrae un archivo de FormData (File o Blob) en Route Handlers de Next.js. */
export function getFormDataUploadFile(
  raw: FormDataEntryValue | null,
  fallbackName = 'justificante'
): File | null {
  if (raw === null || typeof raw === 'string') return null
  if (!(raw instanceof Blob) || raw.size <= 0) return null
  if (raw instanceof File) return raw
  const blob = raw as Blob
  const type = blob.type || 'application/octet-stream'
  return new File([blob], fallbackName, { type })
}
