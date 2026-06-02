import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pet } from '../../types';

// =========================================================
// Tipo del contexto
// =========================================================
// Aquí definimos todo lo que otros componentes pueden usar
// cuando llaman al hook usePets().
export interface PetContextType {
  pets: Pet[];

  // Busca mascotas por texto y por campo.
  searchPets: (query: string, field: string) => Pet[];

  // Agrega una nueva mascota al estado local.
  addPet: (pet: Omit<Pet, '_id' | 'registrationDate'>) => void;

  // Reemplaza una mascota existente por su versión actualizada.
  updatePet: (pet: Pet) => void;

  // Elimina una mascota completa por id.
  deletePet: (petId: string) => void;

  // Elimina una consulta específica dentro de una mascota.
  deleteConsultation: (petId: string, consultationId: string) => void;
}

// =========================================================
// Contexto React
// =========================================================
const PetContext = createContext<PetContextType | undefined>(undefined);

// =========================================================
// Datos iniciales de ejemplo
// =========================================================
// Esto sirve como mock local mientras no cargues todo desde backend.
const initialPets: Pet[] = [
  {
    _id: 'P001',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    color: 'Golden',
    gender: 'macho',
    chipNumber: '123456789',
    ownerName: 'John Smith',
    ownerContact: '555-123-4567',
    rut: '12.345.678-9',
    email: 'john.smith@email.com',
    address: 'Av. Principal 123, Ciudad',
    medicalHistory: 'Vacunas anuales al día',
    registrationDate: '2023-01-15',
    consultations: [
      {
        _id: 'C001',
        fecha: '2024-06-01',
        anamnesis: 'Pérdida de apetito',
        examenFisico: 'Temperatura normal',
        preDiagnostico: 'Gastroenteritis leve',
        observaciones: 'Se observa decaimiento',
        tratamientos: 'Dieta blanda',
        recomendacion: 'Control en 7 días',
      },
      {
        _id: 'C002',
        fecha: '2024-06-10',
        anamnesis: 'Cojea pata trasera',
        examenFisico: 'Inflamación leve',
        preDiagnostico: 'Esguince',
        observaciones: '',
        tratamientos: 'Reposo y antiinflamatorio',
        recomendacion: 'Revisar en 10 días',
      },
    ],
  },
  {
    _id: 'P002',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: 2,
    color: 'Cream',
    gender: 'esterilizado',
    chipNumber: '987654321',
    ownerName: 'Emily Johnson',
    ownerContact: '555-987-6543',
    rut: '23.456.789-0',
    email: 'emily.johnson@email.com',
    address: 'Calle Secundaria 456, Ciudad',
    medicalHistory: 'Esterilizada, microchip',
    registrationDate: '2023-03-22',
    consultations: [
      {
        _id: 'C003',
        fecha: '2024-05-15',
        anamnesis: 'Estornudos frecuentes',
        examenFisico: 'Mucosa nasal húmeda',
        preDiagnostico: 'Rinitis',
        observaciones: 'Sin fiebre',
        tratamientos: 'Antihistamínicos',
        recomendacion: 'Evitar polvo',
      },
    ],
  },
  {
    _id: 'P003',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Labrador',
    age: 5,
    color: 'Chocolate',
    gender: 'macho',
    chipNumber: '456789123',
    ownerName: 'Michael Brown',
    ownerContact: '555-456-7890',
    rut: '34.567.890-1',
    email: 'michael.brown@email.com',
    address: 'Pasaje Norte 789, Ciudad',
    medicalHistory: 'Displasia de cadera, en tratamiento',
    registrationDate: '2022-11-05',
    consultations: [
      {
        _id: 'C004',
        fecha: '2024-04-20',
        anamnesis: 'Dificultad para caminar',
        examenFisico: 'Dolor en cadera',
        preDiagnostico: 'Displasia de cadera',
        observaciones: 'Se recomienda control mensual',
        tratamientos: 'Antiinflamatorios',
        recomendacion: 'Rehabilitación física',
      },
    ],
  },
];

// =========================================================
// Provider del contexto
// =========================================================
export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado global de mascotas disponible para toda la app.
  const [pets, setPets] = useState<Pet[]>(initialPets);

  // ---------------------------------------------------------
  // Agregar mascota
  // ---------------------------------------------------------
  // Crea una nueva mascota en el estado local.
  const addPet = (petData: Omit<Pet, '_id' | 'registrationDate'>) => {
    const newPet: Pet = {
      ...petData,
      _id: `P${String(pets.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      consultations: petData.consultations || [],
    };

    setPets((prev) => [...prev, newPet]);
  };

  // ---------------------------------------------------------
  // Actualizar mascota
  // ---------------------------------------------------------
  // Reemplaza una mascota existente por su nueva versión.
  const updatePet = (updatedPet: Pet) => {
    setPets((prevPets) =>
      prevPets.map((pet) => (pet._id === updatedPet._id ? updatedPet : pet))
    );
  };

  // ---------------------------------------------------------
  // Eliminar mascota
  // ---------------------------------------------------------
  // Esta función corrige el error:
  // "La propiedad 'deletePet' no existe en el tipo 'PetContextType'."
  const deletePet = (petId: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
  };

  // ---------------------------------------------------------
  // Eliminar consulta
  // ---------------------------------------------------------
  // Elimina una consulta específica dentro de una mascota.
  const deleteConsultation = (petId: string, consultationId: string) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet._id === petId
          ? {
              ...pet,
              consultations: (pet.consultations || []).filter(
                (cons) => cons._id !== consultationId
              ),
            }
          : pet
      )
    );
  };

  // ---------------------------------------------------------
  // Buscar mascotas
  // ---------------------------------------------------------
  // Permite buscar por nombre, id u otro campo simple.
  const searchPets = (query: string, field: string): Pet[] => {
    const lowerQuery = query.toLowerCase();

    return pets.filter((pet) => {
      if (field === 'both') {
        const name = pet.name?.toString().toLowerCase() || '';
        const id = pet._id?.toString().toLowerCase() || '';
        return name.includes(lowerQuery) || id.includes(lowerQuery);
      }

      const value = pet[field as keyof Pet];

      return value ? value.toString().toLowerCase().includes(lowerQuery) : false;
    });
  };

  // Exponemos el estado y las funciones al resto de la app.
  return (
    <PetContext.Provider
      value={{
        pets,
        searchPets,
        addPet,
        updatePet,
        deletePet,
        deleteConsultation,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

// =========================================================
// Hook personalizado
// =========================================================
// Facilita el uso del contexto en otros componentes.
export const usePets = (): PetContextType => {
  const context = useContext(PetContext);

  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }

  return context;
};