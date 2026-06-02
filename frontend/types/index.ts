export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Consultation {
  _id?: string;
  fecha?: string;
  anamnesis?: string;
  examenFisico?: string;
  preDiagnostico?: string;
  observaciones?: string;
  tratamientos?: string;
  recomendacion?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | { _id?: string; username?: string; email?: string };
  updatedBy?: string | { _id?: string; username?: string; email?: string };
}

export interface Pet {
  _id?: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  color?: string;
  gender?: 'macho' | 'hembra' | 'esterilizado' | 'castrado';
  chipNumber?: string;
  ownerName: string;
  ownerContact: string;
  rut?: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  registrationDate?: string;
  consultations?: Consultation[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | { _id?: string; username?: string; email?: string };
  updatedBy?: string | { _id?: string; username?: string; email?: string };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}