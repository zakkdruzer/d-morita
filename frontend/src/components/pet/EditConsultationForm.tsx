import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import Button from '../ui/Button';
import { API_BASE } from '../apiBase'; // Ajusta la ruta según corresponda

const EditConsultationForm: React.FC = () => {
  const { id, consultationId } = useParams<{ id: string; consultationId: string }>();
  const { pets, updateConsultation } = usePets();
  const navigate = useNavigate();

  const pet = pets.find((p) => p.id === id);
  const consultation = pet?.consultations?.find((c) => c.id === consultationId);

  const [formData, setFormData] = useState({
    fecha: '',
    anamnesis: '',
    examenFisico: '',
    preDiagnostico: '',
    observaciones: '',
    tratamientos: '',
    recomendacion: '',
  });

  useEffect(() => {
    if (consultation) {
      setFormData({
        fecha: consultation.fecha || '',
        anamnesis: consultation.anamnesis || '',
        examenFisico: consultation.examenFisico || '',
        preDiagnostico: consultation.preDiagnostico || '',
        observaciones: consultation.observaciones || '',
        tratamientos: consultation.tratamientos || '',
        recomendacion: consultation.recomendacion || '',
      });
    }
  }, [consultation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pet && consultation) {
      updateConsultation(pet.id, consultation.id, formData);
      navigate(`/mascota/${pet.id}/historial-consultas`);
    }
  };

  if (!pet || !consultation) {
    return <div className="p-8 text-center">Consulta no encontrada.</div>;
  }

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
          <Button type="button" variant="secondary" onClick={() => navigate(`/mascota/${pet.id}/historial-consultas`)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar Cambios
          </Button>
        </div>
      </form>
      {/* Aquí puedes agregar otros componentes o lógica adicional si lo necesitas */}
    </div>
  );
};

export default EditConsultationForm;