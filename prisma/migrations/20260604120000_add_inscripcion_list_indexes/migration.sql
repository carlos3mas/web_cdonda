-- Índices para acelerar listado y estadísticas del panel admin
CREATE INDEX "inscripciones_tipoInscripcion_createdAt_idx" ON "inscripciones"("tipoInscripcion", "createdAt" DESC);
CREATE INDEX "inscripciones_tipoInscripcion_pagada_idx" ON "inscripciones"("tipoInscripcion", "pagada");
