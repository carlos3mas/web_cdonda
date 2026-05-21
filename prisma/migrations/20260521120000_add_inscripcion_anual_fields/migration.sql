-- Campos para inscripción anual (categoría, pago, DNI cifrado, etc.)
ALTER TABLE "inscripciones" ADD COLUMN "email" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "sexo" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "categoria" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "modalidadPago" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "dniFrontalEncriptado" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "dniFrontalMimeType" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "dniReversoEncriptado" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN "dniReversoMimeType" TEXT;
