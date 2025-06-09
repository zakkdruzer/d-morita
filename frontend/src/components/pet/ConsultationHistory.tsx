import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface Consultation {
  _id?: string;
  fecha?: string;
  anamnesis?: string;
  examenFisico?: string;
  preDiagnostico?: string;
  observaciones?: string;
  tratamientos?: string;
  recomendacion?: string;
  date?: string;
  reason?: string;
  notes?: string;
  // agrega aquí más campos si los usas
}

const ConsultationHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [petName, setPetName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      console.log('ConsultationHistory fetching for id:', id);
      setLoading(true);
      // Obtener las consultas
      fetch(`/api/pets/${id}/consultations`)
        .then(res => res.json())
        .then(data => setConsultations(data))
        .catch(() => setConsultations([]));

      // Obtener el nombre de la mascota
      fetch(`/api/pets/${id}`)
        .then(res => res.json())
        .then(data => setPetName(data.name || ''))
        .catch(() => setPetName(''));
      setLoading(false);
    }
  }, [id]);

  const deleteConsultation = async (consultationId?: string) => {
    if (!id || !consultationId) return;
    if (!window.confirm('¿Seguro que deseas eliminar esta consulta?')) return;
    try {
      const res = await fetch(`/api/pets/${id}/consultations/${consultationId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setConsultations((prev) => prev.filter((c) => c._id !== consultationId));
      } else {
        alert('No se pudo eliminar la consulta.');
      }
    } catch {
      alert('Error al eliminar la consulta.');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">
        Historial de Consultas de {petName}
      </h2>
      {consultations && consultations.length > 0 ? (
        <ul className="space-y-4">
          {consultations.map((c) => (
            <li key={c._id} className="border rounded p-4 bg-gray-50">
              <div><b>Fecha:</b> {c.fecha || c.date || '-'}</div>
              <div><b>Anamnesis:</b> {c.anamnesis || c.reason || '-'}</div>
              <div><b>Examen Físico:</b> {c.examenFisico || '-'}</div>
              <div><b>Pre-diagnóstico:</b> {c.preDiagnostico || '-'}</div>
              <div><b>Observaciones:</b> {c.observaciones || c.notes || '-'}</div>
              <div><b>Tratamientos:</b> {c.tratamientos || '-'}</div>
              <div><b>Recomendación:</b> {c.recomendacion || '-'}</div>
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => navigate(`/mascota/${id}/editar-consulta/${c._id}`)}
                >
                  Modificar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => deleteConsultation(c._id)}
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
        <Button onClick={() => navigate(`/mascota/${id}`)}>Volver a la mascota</Button>
      </div>
    </div>
  );
};

export default ConsultationHistory;