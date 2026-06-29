import { readFile } from 'fs/promises'
import { join } from 'path'
import { PDFDocument } from 'pdf-lib'

const templates = [
  'inscripcion-f11.pdf',
  'inscripcion-f8.pdf',
  'inscripcion-chupetines.pdf',
  'inscripcion-querubines.pdf',
  'campus-verano.pdf',
  'campus-pascua.pdf',
]

async function main() {
  for (const file of templates) {
    const path = join(process.cwd(), 'public', 'templates', file)
    const bytes = await readFile(path)
    const doc = await PDFDocument.load(bytes)
    const form = doc.getForm()
    const names = form.getFields().map((f) => f.getName())
    const hasMarca = names.includes('MARCAR SI PROCEDE')
    console.log(`${file}: MARCAR SI PROCEDE=${hasMarca}`)
    if (hasMarca) {
      const field = form.getTextField('MARCAR SI PROCEDE')
      console.log(`  default text: ${JSON.stringify(field.getText())}`)
    }
  }
}

main().catch(console.error)
