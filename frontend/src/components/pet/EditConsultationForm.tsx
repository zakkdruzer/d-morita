import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { API_BASE } from '../../apiBase';

// Este componente permite editar una consulta existente de una mascota.
// La ruta espera dos parámetros:
// - id: id de la mascota
// - consultationId: id de la consulta
const EditConsultationForm: React.FC = () => {
  // Obtenemos los parámetros desde la URL.
  const { id, consultationId } = useParams<{ id: string; consultationId: string }>();

  // Hook para redireccionar al usuario después de guardar o cancelar.
  const navigate = useNavigate();

  // Estado local del formulario.
  // Aquí cargamos y editamos los datos de la consulta.
  const [formData, setFormData] = useState({
    fecha: '',
    anamnesis: '',
    examenFisico: '',
    preDiagnostico: '',
    observaciones: '',
    tratamientos: '',
    recomendacion: '',
  });

  // loading sirve para mostrar "Cargando..." mientras buscamos la consulta.
  const [loading, setLoading] = useState(true);

  // notFound sirve para mostrar un mensaje si la consulta no existe.
  const [notFound, setNotFound] = useState(false);

  // Cuando se monta el componente, buscamos todas las consultas de la mascota
  // y dentro de ellas localizamos la consulta que coincide con consultationId.
  useEffect(() => {
    if (id && consultationId) {
      fetch(`${API_BASE}/api/pets/${id}/consultations`)
        .then((res) => res.json())
        .then((consultations) => {
          console.log('consultationId param:', consultationId);
          console.log('consultations:', consultations.map((c: any) => c._id));

          // Buscamos la consulta específica que queremos editar.
          const consulta = consultations.find((c: any) => c._id === consultationId);

          if (consulta) {
            // Si existe, llenamos el formulario con sus datos actuales.
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
            // Si no encontramos la consulta, marcamos notFound.
            setNotFound(true);
          }
        })
        .catch(() => {
          // Si falla la petición, asumimos que no se pudo encontrar.
          setNotFound(true);
        })
        .finally(() => {
          // Al final dejamos de mostrar el estado de carga.
          setLoading(false);
        });
    }
  }, [id, consultationId]);

  // Esta función actualiza el estado del formulario a medida que el usuario escribe.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Esta función se ejecuta al enviar el formulario.
  // Hace el PUT al backend para guardar los cambios de la consulta.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (id && consultationId) {
      try {
        // Recuperamos el token JWT guardado durante el login.
        const token = localStorage.getItem('token');

        // Enviamos los datos actualizados al backend.
        const res = await fetch(`${API_BASE}/api/pets/${id}/consultations/${consultationId}`, {
          method: 'PUT',
          headers: {
            // Indicamos que estamos enviando JSON.
            'Content-Type': 'application/json',

            // Enviamos el token para pasar el authMiddleware del backend.
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        console.log('Respuesta PUT consulta:', res.status);

        if (res.ok) {
          // Si todo salió bien, volvemos al historial de consultas.
          navigate(`/mascota/${id}/historial-consultas`);
        } else {
          // Si backend respondió error, lo intentamos leer para depuración.
          const errorData = await res.json().catch(() => null);
          console.error('Error backend al guardar consulta:', errorData);
          alert('No se pudo guardar la consulta.');
        }
      } catch (error) {
        // Error de red o fallo inesperado.
        console.error('Error al guardar consulta:', error);
        alert('Error al guardar la consulta.');
      }
    }
  };

  // Mientras carga la consulta, mostramos un mensaje simple.
  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  // Si no encontramos la consulta, mostramos mensaje de error.
  if (notFound) {
    return <div className="p-8 text-center">Consulta no encontrada.</div>;
  }

  // Formulario visual para editar la consulta.
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">Editar Consulta</h2>

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
          {/* Cancela y vuelve al historial */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/mascota/${id}/historial-consultas`)}
          >
            Cancelar
          </Button>

          {/* Envía el formulario */}
          <Button type="submit" variant="primary">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditConsultationForm;