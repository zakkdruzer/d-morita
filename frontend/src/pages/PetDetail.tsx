import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { getPetById, Pet } from '@api';

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (pet && id) {
      console.log('URL id:', id, 'pet._id:', pet._id);
    }
  }, [pet, id]);

  if (loading) return <div>Cargando...</div>;
  if (!pet) return <div>Mascota no encontrada</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">{pet.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2"><b>Especie:</b> {pet.species}</div>
          <div className="mb-2"><b>Raza:</b> {pet.breed || '-'}</div>
          <div className="mb-2"><b>Edad:</b> {pet.age ?? '-'}</div>
          <div className="mb-2"><b>Color:</b> {pet.color || '-'}</div>
          <div className="mb-2"><b>Género:</b> {pet.gender || '-'}</div>
          <div className="mb-2"><b>Número de Chip:</b> {pet.chipNumber || '-'}</div>
        </div>
        <div>
          <div className="mb-2"><b>Nombre del Dueño:</b> {pet.ownerName}</div>
          <div className="mb-2"><b>Contacto:</b> {pet.ownerContact}</div>
          <div className="mb-2"><b>RUT:</b> {pet.rut || '-'}</div>
          <div className="mb-2"><b>Email:</b> {pet.email || '-'}</div>
          <div className="mb-2"><b>Dirección:</b> {pet.address || '-'}</div>
        </div>
      </div>
      <div className="mt-4">
        <b>Historial Médico:</b>
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-1 min-h-[40px]">
          {pet.medicalHistory || <span className="text-gray-400">Sin historial</span>}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(`/mascota/${pet._id}/consulta`)}
        >
          Ingresar Consulta
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            console.log('Navegando al historial de:', pet._id);
            navigate(`/mascota/${pet._id}/historial-consultas`);
          }}
        >
          Historial de Consultas
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/')}
        >
          Volver
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => navigate(`/editar-mascota/${pet._id}`)}
        >
          Modificar Información
        </Button>
      </div>
    </div>
  );
};

export default PetDetail;