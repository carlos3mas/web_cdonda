// Types globales para la aplicación Campus CD Onda

export interface Inscripcion {
  id: string;
  tipoInscripcion: string;
  nombreJugador: string;
  apellidos: string;
  fechaNacimiento: Date;
  dni: string;
  dniJugador?: string | null;
  direccion?: string | null;
  localidad?: string | null;
  codigoPostal?: string | null;
  semanasCampus?: string | null;
  diasSueltos?: string | null;
  tallaCamiseta?: string | null;
  tallaPantalon?: string | null;
  tallaCalcetines?: string | null;
  nombreTutor: string;
  telefono1: string;
  telefono2?: string | null;
  enfermedad?: string | null;
  medicacion?: string | null;
  alergico?: string | null;
  numeroSeguridadSocial?: string | null;
  pagada: boolean;
  cuota1Pagada?: boolean | null;
  cuota2Pagada?: boolean | null;
  cuota3Pagada?: boolean | null;
  justificantePago?: string | null;
  nombreArchivoJustificante?: string | null;
  nombreArchivoJustificanteCuota2?: string | null;
  nombreArchivoJustificanteCuota3?: string | null;
  firma?: string | null;
  firmaMimeType?: string | null;
  nombreArchivoFirma?: string | null;
  derechosImagen: boolean;
  padresSeparados?: boolean;
  nombreArchivoDerechosImagen?: string | null;
  comentarios?: string | null;
  // Campos exclusivos inscripción anual
  email?: string | null;
  sexo?: string | null;
  categoria?: string | null;
  modalidadPago?: string | null;
  descuentoHermanos?: string | null;
  nombreArchivoFotoFicha?: string | null;
  // Los campos cifrados del DNI nunca se exponen al cliente
  tieneDniFrontal?: boolean;
  tieneDniReverso?: boolean;
  tieneFotoFicha?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InscripcionFormData {
  tipoInscripcion: string;
  nombreJugador: string;
  apellidos: string;
  fechaNacimiento: string;
  dni: string;
  direccion?: string;
  localidad?: string;
  codigoPostal?: string;
  semanasCampus?: string[];
  diasSueltos?: string;
  tallaCamiseta?: string;
  tallaPantalon?: string;
  tallaCalcetines?: string;
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
  comentarios?: string;
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

