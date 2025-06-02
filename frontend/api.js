const API_BASE = import.meta.env.PROD 
  ? "https://d-morita.vercel.app/api" 
  : "http://localhost:3000/api";

// Obtener mascotas
export const getPets = async () => {
  const response = await fetch(`${API_BASE}/pets`);
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