import { readFile } from 'fs/promises'
import { join } from 'path'
import { PDFDocument } from 'pdf-lib'

const file = process.argv[2] || 'clausula-derechos-imagen-menores.pdf'

async function main() {
  const path = join(process.cwd(), 'public', 'templates', file)
  const bytes = await readFile(path)
  const doc = await PDFDocument.load(bytes)
  const form = doc.getForm()
  for (const f of form.getFields()) {
    console.log(`${f.constructor.name}: ${f.getName()}`)
  }
}

main().catch(console.error)
