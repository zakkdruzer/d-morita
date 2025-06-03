const API_BASE = import.meta.env.PROD
  ? "https://d-morita-production.up.railway.app/api"
  : "http://localhost:3000/api";

// Mascotas

// Obtener todas las mascotas
export const getPets = async () => {
  const response = await fetch(`${API_BASE}/pets`);
  return response.json();
};

// Obtener una mascota por ID
export const getPetById = async (id) => {
  const response = await fetch(`${API_BASE}/pets/${id}`);
  return response.json();
};

// Crear mascota
export const createPet = async (petData) => {
  const response = await fetch(`${API_BASE}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData)
  });
  return response.json();
};

// Editar mascota
export const updatePet = async (id, petData) => {
  const response = await fetch(`${API_BASE}/pets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(petData)
  });
  return response.json();
};

// Eliminar mascota
export const deletePet = async (id) => {
  const response = await fetch(`${API_BASE}/pets/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Consultas

// Agregar consulta a una mascota
export const addConsultation = async (petId, consultationData) => {
  const response = await fetch(`${API_BASE}/pets/${petId}/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(consultationData)
  });
  return response.json();
};

// Editar consulta de una mascota
export const updateConsultation = async (petId, consultationId, consultationData) => {
  const response = await fetch(`${API_BASE}/pets/${petId}/consultations/${consultationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(consultationData)
  });
  return response.json();
};

// Eliminar consulta de una mascota
export const deleteConsultation = async (petId, consultationId) => {
  const response = await fetch(`${API_BASE}/pets/${petId}/consultations/${consultationId}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Buscar mascotas por nombre
export const searchPetsByName = async (name) => {
  const response = await fetch(`${API_BASE}/pets?name=${encodeURIComponent(name)}`);
  return response.json();
};