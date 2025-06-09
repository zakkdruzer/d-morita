import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { API_BASE } from '../../apiBase';

const AddConsultationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/api/pets/${id}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigate(`/mascota/${id}/historial-consultas`);
        }, 1500);
      } else {
        alert('No se pudo guardar la consulta.');
      }
    } catch {
      alert('Error al guardar la consulta.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Ingresar Consulta</h2>
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
          <Button type="button" variant="secondary" onClick={() => navigate(`/mascota/${id}`)}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar
          </Button>
        </div>
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center transition-opacity duration-500">
            <span>¡La consulta fue ingresada correctamente!</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddConsultationForm;