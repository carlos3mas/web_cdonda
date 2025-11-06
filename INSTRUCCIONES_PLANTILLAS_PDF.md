# Instrucciones para Crear Plantillas PDF

## 📋 Resumen

Este sistema permite usar plantillas PDF personalizadas para cada tipo de inscripción. Los PDFs se rellenan automáticamente con los datos del formulario.

## 🎯 Campos Requeridos

Las plantillas PDF deben tener **campos de formulario** con estos nombres exactos:

### Datos del Jugador
- `nombreJugador` - Nombre del jugador
- `apellidos` - Apellidos del jugador
- `fechaNacimiento` - Fecha de nacimiento
- `dni` - DNI/NIE del jugador

### Datos del Tutor
- `nombreTutor` - Nombre completo del tutor
- `telefono1` - Teléfono principal
- `telefono2` - Teléfono secundario (opcional)
- `email` - Correo electrónico

### Información Adicional
- `tieneHermanos` - ¿Tiene hermanos en el campus? (Sí/No)
- `alergias` - Alergias o enfermedades
- `observaciones` - Observaciones adicionales

### Metadatos
- `fechaInscripcion` - Fecha de la inscripción
- `idInscripcion` - ID único de la inscripción

---

## 🔧 Cómo Crear las Plantillas

### Opción 1: LibreOffice Writer (GRATIS)

1. **Diseña tu documento** en LibreOffice Writer con el diseño que desees
2. **Añade campos de formulario:**
   - Ve a `Ver` → `Barras de herramientas` → `Controles de formulario`
   - Habilita el "Modo de diseño"
   - Añade "Campos de texto" donde quieras que aparezcan los datos
   - Haz doble clic en cada campo y ponle el nombre correspondiente (ej: `nombreJugador`)
3. **Exporta como PDF:**
   - `Archivo` → `Exportar como` → `Exportar directamente como PDF`
   - ⚠️ **IMPORTANTE:** Marca la opción "Crear formulario PDF"

### Opción 2: Adobe Acrobat Pro (DE PAGO)

1. **Crea tu PDF** en cualquier programa (Word, Photoshop, etc.)
2. **Abre el PDF en Acrobat Pro**
3. **Añade campos de formulario:**
   - `Herramientas` → `Preparar formulario`
   - Añade campos de texto donde quieras
   - Renombra cada campo con los nombres exactos de la lista
4. **Guarda el PDF**

### Opción 3: PDFescape (ONLINE GRATIS)

1. Ve a [https://www.pdfescape.com](https://www.pdfescape.com)
2. Sube tu PDF diseñado
3. Usa la herramienta "Form Field" → "Text" para añadir campos
4. Renombra cada campo (botón derecho → Properties → Name)
5. Descarga el PDF

### Opción 4: Sejda PDF Editor (ONLINE)

1. Ve a [https://www.sejda.com/pdf-forms](https://www.sejda.com/pdf-forms)
2. Sube tu PDF
3. Añade campos de texto con la herramienta
4. Renombra con los nombres exactos
5. Descarga el PDF

---

## 📤 Cómo Subir las Plantillas

1. **Accede al panel de administración** del sitio web
2. Ve a la pestaña **"Plantillas PDF"**
3. **Selecciona el tipo de inscripción** (Campus Navidad, Campus Verano, etc.)
4. **Haz clic en "Subir"** y selecciona tu archivo PDF
5. ¡Listo! El sistema usará automáticamente esta plantilla

---

## ✅ Verificación

Para verificar que tu plantilla funciona:

1. Sube la plantilla
2. Crea una inscripción de prueba desde el formulario web
3. Descarga el PDF generado
4. Verifica que todos los campos se rellenaron correctamente

---

## ⚠️ Notas Importantes

- **Nombres exactos:** Los campos deben tener los nombres EXACTOS de la lista
- **Sensible a mayúsculas:** `nombreJugador` es diferente de `NombreJugador`
- **Un archivo por tipo:** Cada tipo de inscripción tiene su propia plantilla
- **Fallback automático:** Si no hay plantilla, se genera un PDF genérico
- **Campos opcionales:** Si un campo no existe en la plantilla, simplemente no se rellena

---

## 🎨 Consejos de Diseño

- Deja suficiente espacio para los campos de texto
- Usa una fuente legible (mínimo 10pt)
- Considera el ancho de los campos para nombres largos
- Los campos de "alergias" y "observaciones" pueden ser multilínea
- Incluye el logo del club y la información de contacto
- Añade espacios para firmas si es necesario

---

## 🆘 Solución de Problemas

**Los campos no se rellenan:**
- Verifica que los nombres sean exactos
- Asegúrate de que exportaste con "campos de formulario"
- Comprueba que el PDF no esté protegido

**El PDF se ve mal:**
- Ajusta el tamaño de los campos en tu plantilla
- Usa fuentes estándar (Arial, Helvetica, Times)

**Error al subir:**
- Asegúrate de que el archivo sea .pdf
- Máximo 10MB por archivo
- El nombre del archivo no importa

---

## 📞 Contacto

Si necesitas ayuda, contacta con el administrador del sistema.

