-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL,
    "tipoInscripcion" TEXT NOT NULL DEFAULT 'campus-navidad',
    "nombreJugador" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "dni" TEXT NOT NULL,
    "nombreTutor" TEXT NOT NULL,
    "telefono1" TEXT NOT NULL,
    "telefono2" TEXT,
    "email" TEXT NOT NULL,
    "tieneHermanos" BOOLEAN NOT NULL DEFAULT false,
    "alergias" TEXT,
    "enfermedad" TEXT,
    "medicacion" TEXT,
    "alergico" TEXT,
    "intolerante" TEXT,
    "numeroSeguridadSocial" TEXT,
    "observaciones" TEXT,
    "pagada" BOOLEAN NOT NULL DEFAULT false,
    "justificantePago" TEXT,
    "nombreArchivoJustificante" TEXT,
    "derechosImagen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plantillas_pdf" (
    "id" TEXT NOT NULL,
    "tipoInscripcion" TEXT NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plantillas_pdf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "plantillas_pdf_tipoInscripcion_key" ON "plantillas_pdf"("tipoInscripcion");
