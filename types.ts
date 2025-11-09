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
  enfermedad?: string | null;
  medicacion?: string | null;
  alergico?: string | null;
  numeroSeguridadSocial?: string | null;
  pagada: boolean;
  justificantePago?: string | null;
  nombreArchivoJustificante?: string | null;
  firma?: string | null;
  nombreArchivoFirma?: string | null;
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
  enfermedad?: string;
  medicacion?: string;
  alergico?: string;
  numeroSeguridadSocial?: string;
  justificantePago?: File;
  firmaTutor?: File;
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

