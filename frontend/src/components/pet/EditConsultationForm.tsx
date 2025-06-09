import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { API_BASE } from '../../apiBase';import { API_BASE } from '../../apiBase';

const EditConsultationForm: React.FC = () => {
  const { id, consultationId } = useParams<{ id: string; consultationId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fecha: '',
    anamnesis: '',
    examenFisico: '',
    preDiagnostico: '',
    observaciones: '',
    tratamientos: '',
    recomendacion: '',
  });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id && consultationId) {
      fetch(`${API_BASE}/api/pets/${id}/consultations`)
        .then((res) => res.json())
        .then((consultations) => {
          console.log('consultationId param:', consultationId);
          console.log('consultations:', consultations.map((c: any) => c._id));
          const consulta = consultations.find((c: any) => c._id === consultationId);
          if (consulta) {
            setFormData({
              fecha: consulta.fecha || '',
              anamnesis: consulta.anamnesis || '',
              examenFisico: consulta.examenFisico || '',
              preDiagnostico: consulta.preDiagnostico || '',
              observaciones: consulta.observaciones || '',
              tratamientos: consulta.tratamientos || '',
              recomendacion: consulta.recomendacion || '',
            });
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    }
  }, [id, consultationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && consultationId) {
      try {
        const res = await fetch(`${API_BASE}/api/pets/${id}/consultations/${consultationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          navigate(`/mascota/${id}/historial-consultas`);
        } else {
          alert('No se pudo guardar la consulta.');
        }
      } catch {
        alert('Error al guardar la consulta.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (notFound) return <div className="p-8 text-center">Consulta no encontrada.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Editar Consulta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Anamnesis</label>
          <textarea
            name="anamnesis"
            value={formData.anamnesis}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Examen Físico</label>
          <textarea
            name="examenFisico"
            value={formData.examenFisico}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Pre-diagnóstico</label>
          <textarea
            name="preDiagnostico"
            value={formData.preDiagnostico}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Tratamientos</label>
          <textarea
            name="tratamientos"
            value={formData.tratamientos}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Recomendación</label>
          <textarea
            name="recomendacion"
            value={formData.recomendacion}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={2}
          />
        </div>
        <div className="flex gap-4 mt-8 justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate(`/mascota/${id}/historial-consultas`)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditConsultationForm;