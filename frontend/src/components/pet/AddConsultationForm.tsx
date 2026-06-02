import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { API_BASE } from '../../apiBase';

// Este componente permite crear una nueva consulta
// para una mascota específica.
const AddConsultationForm: React.FC = () => {
  // Obtenemos el id de la mascota desde la URL.
  const { id } = useParams<{ id: string }>();

  // Hook para navegar a otra pantalla después de guardar o cancelar.
  const navigate = useNavigate();

  // Estado local del formulario.
  // Aquí se guardan temporalmente los campos de la consulta.
  const [formData, setFormData] = useState({
    fecha: '',
    anamnesis: '',
    examenFisico: '',
    preDiagnostico: '',
    observaciones: '',
    tratamientos: '',
    recomendacion: '',
  });

  // Estado para mostrar un mensaje de éxito breve.
  const [isSuccess, setIsSuccess] = useState(false);

  // Esta función actualiza el estado del formulario
  // cuando el usuario escribe en un input o textarea.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Esta función se ejecuta cuando el usuario envía el formulario.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      // Recuperamos el token JWT guardado al iniciar sesión.
      const token = localStorage.getItem('token');

      console.log('Token al crear consulta:', token);

      // Enviamos la nueva consulta al backend.
      const res = await fetch(`${API_BASE}/api/pets/${id}/consultations`, {
        method: 'POST',
        headers: {
          // Indicamos que enviamos JSON.
          'Content-Type': 'application/json',

          // Enviamos el token para pasar la autenticación del backend.
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta POST consulta:', res.status);

      if (res.ok) {
        // Si se guardó correctamente, mostramos mensaje de éxito.
        setIsSuccess(true);

        // Esperamos un momento y luego redirigimos al historial.
        setTimeout(() => {
          setIsSuccess(false);
          navigate(`/mascota/${id}/historial-consultas`);
        }, 1500);
      } else {
        // Si backend respondió error, intentamos leer el detalle.
        const errorData = await res.json().catch(() => null);
        console.error('Error backend al crear consulta:', errorData);
        alert('No se pudo guardar la consulta.');
      }
    } catch (error) {
      // Error de red o fallo inesperado.
      console.error('Error al guardar consulta:', error);
      alert('Error al guardar la consulta.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Ingresar Consulta</h2>

      <form onSubmit={handleSubmit}>
        {/* Campo fecha */}
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

        {/* Campo anamnesis */}
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

        {/* Campo examen físico */}
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

        {/* Campo pre-diagnóstico */}
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

        {/* Campo observaciones */}
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

        {/* Campo tratamientos */}
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

        {/* Campo recomendación */}
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

        {/* Botones de acción */}
        <div className="flex gap-4 mt-8 justify-end">
          {/* Cancela y vuelve al detalle de la mascota */}
          <Button type="button" variant="secondary" onClick={() => navigate(`/mascota/${id}`)}>
            Cancelar
          </Button>

          {/* Envía el formulario */}
          <Button type="submit" variant="primary">
            Guardar
          </Button>
        </div>

        {/* Mensaje de éxito */}
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