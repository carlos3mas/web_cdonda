ALTER TABLE "inscripciones" ADD COLUMN "cuota1Pagada" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripciones" ADD COLUMN "cuota2Pagada" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripciones" ADD COLUMN "cuota3Pagada" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripciones" ADD COLUMN "justificantePagoCuota2" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "justificantePagoCuota2MimeType" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "nombreArchivoJustificanteCuota2" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "justificantePagoCuota3" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "justificantePagoCuota3MimeType" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "nombreArchivoJustificanteCuota3" TEXT;
