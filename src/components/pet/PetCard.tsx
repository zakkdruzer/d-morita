import React, { useState } from 'react';
import { Pet } from '../../types';
import { usePets } from '../../context/PetContext';
import { Trash2, Info, X } from 'lucide-react';
import Button from '../ui/Button';

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { deletePet } = usePets();
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deletePet(pet.id);
      setIsDeleting(false);
    }, 500);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getGenderDisplay = (gender: string | undefined) => {
    switch (gender) {
      case 'macho':
        return 'Macho';
      case 'hembra':
        return 'Hembra';
      case 'esterilizado':
        return 'Esterilizado/a';
      default:
        return 'No especificado';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
            <p className="text-sm text-gray-500">ID: {pet.id}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={toggleDetails}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Ver detalles"
            >
              <Info size={18} className="text-indigo-600" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Eliminar mascota"
              disabled={isDeleting}
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-600 mr-1">Especie:</span>
            <span>{pet.species}</span>
          </div>
          {pet.breed && (
            <div className="flex items-center text-sm">
              <span className="font-medium text-gray-600 mr-1">Raza:</span>
              <span>{pet.breed}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <span className="font-medium text-gray-600 mr-1">Dueño:</span>
            <span>{pet.ownerName}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Detalles de la Mascota</h3>
              <button onClick={toggleDetails} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{pet.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{pet.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Especie</p>
                  <p className="font-medium">{pet.species}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Raza</p>
                  <p className="font-medium">{pet.breed || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Edad</p>
                  <p className="font-medium">{pet.age !== undefined ? `${pet.age} años` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Género</p>
                  <p className="font-medium">{getGenderDisplay(pet.gender)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{pet.color || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número de Chip</p>
                  <p className="font-medium">{pet.chipNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Registro</p>
                  <p className="font-medium">{pet.registrationDate}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Información del Dueño</p>
                <p className="font-medium">{pet.ownerName}</p>
                <p className="text-sm">{pet.ownerContact}</p>
              </div>
              
              {pet.medicalHistory && (
                <div>
                  <p className="text-sm text-gray-500">Historial Médico</p>
                  <p className="text-sm">{pet.medicalHistory}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={toggleDetails}>
                  Cerrar
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  Eliminar Mascota
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetCard;