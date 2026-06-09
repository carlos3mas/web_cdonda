import { CLAUSULA_DERECHOS_IMAGEN } from './anualDocuments.constants'
import {
  generateClausulaDerechosImagenPdf,
  type ClausulaDerechosImagenInput,
} from './pdfGenerator'

export { CLAUSULA_DERECHOS_IMAGEN } from './anualDocuments.constants'

export async function generateClausulaDerechosImagenDocument(
  input: ClausulaDerechosImagenInput
) {
  const pdfBytes = await generateClausulaDerechosImagenPdf(input)

  return {
    base64: Buffer.from(pdfBytes).toString('base64'),
    mimeType: CLAUSULA_DERECHOS_IMAGEN.mimeType,
    fileName: CLAUSULA_DERECHOS_IMAGEN.fileName,
  }
}
