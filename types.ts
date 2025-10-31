// Types globales para la aplicación Campus CD Onda

export interface Inscripcion {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface InscripcionFormData {
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

