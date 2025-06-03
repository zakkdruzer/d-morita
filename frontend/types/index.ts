export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Consultation {
  id: string;
  fecha?: string;
  anamnesis?: string;
  examenFisico?: string;
  preDiagnostico?: string;
  observaciones?: string;
  tratamientos?: string;
  recomendacion?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  color?: string;
  gender?: 'macho' | 'hembra' | 'esterilizado' | undefined;
  chipNumber?: string;
  ownerName: string;
  ownerContact: string;
  rut?: string;      // Nuevo campo
  email?: string;    // Nuevo campo
  address?: string; 
  medicalHistory?: string;
  registrationDate: string;
  consultations?: Consultation[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}