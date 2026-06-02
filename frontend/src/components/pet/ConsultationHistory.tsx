import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { API_BASE } from '../../apiBase'; // Ajusta la ruta si es necesario

interface Consultation {
  _id?: string;
  fecha?: string;
  anamnesis?: string;
  examenFisico?: string;
  preDiagnostico?: string;
  observaciones?: string;
  tratamientos?: string;
  recomendacion?: string;

  // Compatibilidad con nombres antiguos si aún existen en algunos datos
  date?: string;
  reason?: string;
  notes?: string;

  // Campos de auditoría
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

const ConsultationHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [petName, setPetName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Formatea una fecha ISO a algo más legible para Chile
  const formatDateTime = (value?: string) => {
    if (!value) return 'No disponible';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'No disponible';

    return date.toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);

      const fetchConsultations = fetch(`${API_BASE}/api/pets/${id}/consultations`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Consultations data:', data);
          setConsultations(Array.isArray(data) ? data : []);
        })
        .catch(() => setConsultations([]));

      const fetchPet = fetch(`${API_BASE}/api/pets/${id}`)
        .then((res) => res.json())
        .then((data) => setPetName(data.name || ''))
        .catch(() => setPetName(''));

      Promise.all([fetchConsultations, fetchPet]).finally(() => setLoading(false));
    }
  }, [id]);

  const deleteConsultation = async (consultationId?: string) => {
    if (!id || !consultationId) return;
    if (!window.confirm('¿Seguro que deseas eliminar esta consulta?')) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/api/pets/${id}/consultations/${consultationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

              {/* Bloque de auditoría */}
              <div className="mt-4 pt-3 border-t text-sm text-gray-600 space-y-1">
                <div>
                  <b>Registrada el:</b> {formatDateTime(c.createdAt)}
                </div>
                <div>
                  <b>Última modificación:</b> {formatDateTime(c.updatedAt)}
                </div>
                <div>
                  <b>Creada por:</b> {c.createdBy || 'No disponible'}
                </div>
                <div>
                  <b>Modificada por:</b> {c.updatedBy || 'No disponible'}
                </div>
              </div>

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
        <Button onClick={() => navigate(`/mascota/${id}`)}>
          Volver a la mascota
        </Button>
      </div>
    </div>
  );
};

export default ConsultationHistory;