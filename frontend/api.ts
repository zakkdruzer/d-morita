// Define una interfaz para Pet (ajusta los campos según tu modelo real)
export interface Pet {
  _id?: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  color?: string;
  gender?: string;
  chipNumber?: string;
  ownerName: string;
  ownerContact: string;
  rut?: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  registrationDate?: string;
  consultations?: any[];
}

// API base
const API_BASE = "https://d-morita-production.up.railway.app/api";

// Obtener todas las mascotas
export const getPets = async (): Promise<Pet[]> => {
  const response = await fetch(`${API_BASE}/pets`);
  return response.json();
};

// Buscar mascotas por nombre
export const searchPetsByName = async (name: string): Promise<Pet[]> => {
  const response = await fetch(`${API_BASE}/pets?name=${encodeURIComponent(name)}`);
  return response.json();
};

// Obtener mascota por ID
export const getPetById = async (id: string): Promise<Pet | null> => {
  const response = await fetch(`${API_BASE}/pets/${id}`);
  if (response.status === 404) return null;
  return response.json();
};

// Crear mascota
export const createPet = async (petData: Pet): Promise<Pet> => {
  const response = await fetch(`${API_BASE}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData)
  });
  return response.json();
};

// Actualizar mascota
export const updatePet = async (id: string, petData: Partial<Pet>): Promise<Pet> => {
  const response = await fetch(`${API_BASE}/pets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData)
  });
  return response.json();
};

// Eliminar mascota
export const deletePet = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE}/pets/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};