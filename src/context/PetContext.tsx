import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pet } from '../types';

// Mock pet data
const initialPets: Pet[] = [
  {
    id: 'P001',
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
        id: 'C001',
        fecha: '2024-06-01',
        anamnesis: 'Pérdida de apetito',
        examenFisico: 'Temperatura normal',
        preDiagnostico: 'Gastroenteritis leve',
        observaciones: 'Se observa decaimiento',
        tratamientos: 'Dieta blanda',
        recomendacion: 'Control en 7 días'
      },
      {
        id: 'C002',
        fecha: '2024-06-10',
        anamnesis: 'Cojea pata trasera',
        examenFisico: 'Inflamación leve',
        preDiagnostico: 'Esguince',
        observaciones: '',
        tratamientos: 'Reposo y antiinflamatorio',
        recomendacion: 'Revisar en 10 días'
      }
    ]
  },
  {
    id: 'P002',
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
        id: 'C003',
        fecha: '2024-05-15',
        anamnesis: 'Estornudos frecuentes',
        examenFisico: 'Mucosa nasal húmeda',
        preDiagnostico: 'Rinitis',
        observaciones: '',
        tratamientos: 'Antihistamínicos',
        recomendacion: 'Evitar polvo'
      }
    ]
  },
  {
    id: 'P003',
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
        id: 'C004',
        fecha: '2024-04-20',
        anamnesis: 'Dificultad para caminar',
        examenFisico: 'Dolor en cadera',
        preDiagnostico: 'Displasia de cadera',
        observaciones: 'Se recomienda control mensual',
        tratamientos: 'Antiinflamatorios',
        recomendacion: 'Rehabilitación física'
      }
    ]
  }
];

export interface PetContextType {
  pets: Pet[];
  searchPets: (query: string, field: string) => Pet[]; // o void si solo actualiza un estado
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deleteConsultation: (petId: string, consultationId: string) => void; // <-- Add this line
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>(initialPets);

  const addPet = (petData: Omit<Pet, 'id' | 'registrationDate'>) => {
    const newPet: Pet = {
      ...petData,
      id: `P${String(pets.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      consultations: [], // <-- Asegúrate de agregar esto también
    };
    
    setPets([...pets, newPet]);
  };

  const updatePet = (updatedPet: Pet) => {
    setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet));
  };

  const deleteConsultation = (petId: string, consultationId: string) => {
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === petId
          ? {
              ...pet,
              consultations: (pet.consultations || []).filter(cons => cons.id !== consultationId)
            }
          : pet
      )
    );
  };

  const searchPets = (query: string, field: string) => {
    const lowerQuery = query.toLowerCase();
    return pets.filter((pet) => {
      if (field === 'both') {
        const name = pet.name?.toString().toLowerCase() || '';
        const id = pet.id?.toString().toLowerCase() || '';
        return name.includes(lowerQuery) || id.includes(lowerQuery);
      } else {
        const value = pet[field as keyof typeof pet];
        return value && value.toString().toLowerCase().includes(lowerQuery);
      }
    });
  };

  return (
    <PetContext.Provider value={{
      pets,
      searchPets,
      addPet,
      updatePet,
      deleteConsultation,
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = (): PetContextType => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

// (Component usage example removed to avoid unused variable errors)