// ======================================================
// api.ts
// Este archivo centraliza todas las llamadas al backend.
// Así, si algún día cambias la URL del servidor,
// solo tendrás que modificarla aquí.
// ======================================================

// URL base de tu backend desplegado en Render.
// Ojo: aquí NO agregamos "/api" para evitar duplicarlo después.
const API_BASE = "https://d-morita.onrender.com";

// ------------------------------------------------------
// Interfaz Pet
// Define la forma de los datos de una mascota.
// TypeScript usa esta interfaz para ayudarte con autocompletado
// y para avisarte si falta algún campo importante.
// ------------------------------------------------------
export interface Pet {
  _id?: string; // ID que genera MongoDB automáticamente
  name: string; // Nombre de la mascota
  species: string; // Especie: perro, gato, etc.
  breed?: string; // Raza
  age?: number; // Edad
  color?: string; // Color
  gender?: string; // Género o estado
  chipNumber?: string; // Número de chip
  ownerName: string; // Nombre del dueño
  ownerContact: string; // Teléfono o contacto del dueño
  rut?: string; // RUT del dueño
  email?: string; // Correo
  address?: string; // Dirección
  medicalHistory?: string; // Historial médico
  registrationDate?: string; // Fecha de registro
  consultations?: any[]; // Consultas médicas asociadas
}

// ------------------------------------------------------
// getPets()
// Obtiene todas las mascotas desde el backend.
// Hace una petición GET a /api/pets
// ------------------------------------------------------
export const getPets = async (): Promise<Pet[]> => {
  const response = await fetch(`${API_BASE}/api/pets`);

  // Si el servidor responde con error, lanzamos una excepción
  // para poder detectarla en el frontend.
  if (!response.ok) {
    throw new Error("No se pudieron obtener las mascotas");
  }

  return response.json();
};

// ------------------------------------------------------
// searchPetsByName(name)
// Busca mascotas por nombre.
// Usa el parámetro ?name= para filtrar desde el backend.
// encodeURIComponent evita errores con espacios o tildes.
// ------------------------------------------------------
export const searchPetsByName = async (name: string): Promise<Pet[]> => {
  const response = await fetch(
    `${API_BASE}/api/pets?name=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error("No se pudo realizar la búsqueda");
  }

  return response.json();
};

// ------------------------------------------------------
// getPetById(id)
// Busca una mascota específica por su ID.
// Si no existe, devuelve null.
// ------------------------------------------------------
export const getPetById = async (id: string): Promise<Pet | null> => {
  const response = await fetch(`${API_BASE}/api/pets/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("No se pudo obtener la mascota");
  }

  return response.json();
};

// ------------------------------------------------------
// createPet(petData)
// Crea una nueva mascota en la base de datos.
// Hace una petición POST enviando JSON.
// ------------------------------------------------------
export const createPet = async (petData: Pet): Promise<Pet> => {
  const response = await fetch(`${API_BASE}/api/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "No se pudo crear la mascota");
  }

  return response.json();
};

// ------------------------------------------------------
// updatePet(id, petData)
// Actualiza una mascota existente.
// Usa PUT y solo envía los campos a modificar.
// Partial<Pet> significa que no necesitas mandar todos los campos.
// ------------------------------------------------------
export const updatePet = async (
  id: string,
  petData: Partial<Pet>
): Promise<Pet> => {
  const response = await fetch(`${API_BASE}/api/pets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(petData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "No se pudo actualizar la mascota");
  }

  return response.json();
};

// ------------------------------------------------------
// deletePet(id)
// Elimina una mascota por su ID.
// Usa DELETE.
// ------------------------------------------------------
export const deletePet = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE}/api/pets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || "No se pudo eliminar la mascota");
  }

  return response.json();
};