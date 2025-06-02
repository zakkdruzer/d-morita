import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import Button from '../ui/Button';

const ConsultationHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pets, deleteConsultation } = usePets();
  const pet = pets.find((p) => p.id === id);
  const navigate = useNavigate();

  if (!pet) return <div>Mascota no encontrada</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Historial de Consultas de {pet.name}</h2>
      {pet.consultations && pet.consultations.length > 0 ? (
        <ul className="space-y-4">
          {pet.consultations.map((c) => (
            <li key={c.id} className="border rounded p-4 bg-gray-50">
              <div><b>Fecha:</b> {c.fecha || '-'}</div>
              <div><b>Anamnesis:</b> {c.anamnesis || '-'}</div>
              <div><b>Examen Físico:</b> {c.examenFisico || '-'}</div>
              <div><b>Pre-diagnóstico:</b> {c.preDiagnostico || '-'}</div>
              <div><b>Observaciones:</b> {c.observaciones || '-'}</div>
              <div><b>Tratamientos:</b> {c.tratamientos || '-'}</div>
              <div><b>Recomendación:</b> {c.recomendacion || '-'}</div>
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => navigate(`/mascota/${pet.id}/editar-consulta/${c.id}`)}
                >
                  Modificar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => deleteConsultation(pet.id, c.id)}
                >
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500">No hay consultas registradas.</div>
      )}
      <div className="mt-6">
        <Button onClick={() => navigate(`/mascota/${pet.id}`)}>Volver a la mascota</Button>
      </div>
    </div>
  );
};

export default ConsultationHistory;