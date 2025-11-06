// Types globales para la aplicación Campus CD Onda

export interface Inscripcion {
  id: string;
  tipoInscripcion: string;
  nombreJugador: string;
  apellidos: string;
  fechaNacimiento: Date;
  dni: string;
  nombreTutor: string;
  telefono1: string;
  telefono2?: string | null;
  email: string;
  tieneHermanos: boolean;
  alergias?: string | null;
  observaciones?: string | null;
  pagada: boolean;
  justificantePago?: string | null;
  nombreArchivoJustificante?: string | null;
  derechosImagen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InscripcionFormData {
  tipoInscripcion: string;
  nombreJugador: string;
  apellidos: string;
  fechaNacimiento: string;
  dni: string;
  nombreTutor: string;
  telefono1: string;
  telefono2?: string;
  email: string;
  tieneHermanos: string; // "si" | "no"
  alergias?: string;
  observaciones?: string;
  justificantePago?: File;
  derechosImagen: boolean;
}

export interface Admin {
  id: string;
  email: string;
  nombre: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalInscripciones: number;
  inscripcionesPagadas: number;
  inscripcionesPendientes: number;
}

export interface PDFData {
  inscripcion: Inscripcion;
  fechaEmision: Date;
}

export interface PlantillaPDF {
  id: string;
  tipoInscripcion: string;
  nombreArchivo: string;
  rutaArchivo: string;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

