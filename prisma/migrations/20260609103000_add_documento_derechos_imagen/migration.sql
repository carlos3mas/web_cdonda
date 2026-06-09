-- Documento de cláusula de derechos de imagen aceptada (inscripción anual)
ALTER TABLE "inscripciones" ADD COLUMN "documentoDerechosImagen" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "documentoDerechosImagenMimeType" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "nombreArchivoDerechosImagen" TEXT;
