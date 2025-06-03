import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPetById, Pet } from '@api';

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPetById(id)
        .then((data) => setPet(data))
        .catch(() => setPet(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!pet) return <div>Mascota no encontrada</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{pet.name}</h2>
      <p><strong>Especie:</strong> {pet.species}</p>
      <p><strong>Raza:</strong> {pet.breed}</p>
      <p><strong>Edad:</strong> {pet.age}</p>
      <p><strong>Color:</strong> {pet.color}</p>
      <p><strong>Género:</strong> {pet.gender}</p>
      <p><strong>Dueño:</strong> {pet.ownerName}</p>
      <p><strong>Contacto:</strong> {pet.ownerContact}</p>
      {/* Agrega más campos según tu modelo */}
    </div>
  );
};

export default PetDetail;