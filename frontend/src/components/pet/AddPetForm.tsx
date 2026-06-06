import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { PlusCircle, Check } from 'lucide-react';
import { API_BASE } from '../../apiBase';

// =====================================================
// Estructura local del formulario.
// Todos los campos se manejan como string en la UI.
// Antes de enviar, algunos se transforman o limpian.
// =====================================================
interface FormData {
  name: string;
  species: string;
  breed: string;
  age: string;
  color: string;
  gender: string;
  chipNumber: string;
  ownerName: string;
  ownerContact: string;
  rut: string;
  email: string;
  address: string;
  medicalHistory: string;
}

const AddPetForm: React.FC = () => {
  // =====================================================
  // Contexto de autenticación.
  // =====================================================
  const { getToken, logout } = useAuth();

  // =====================================================
  // Estado del formulario.
  // =====================================================
  const [formData, setFormData] = useState<FormData>({
    name: '',
    species: '',
    breed: '',
    age: '',
    color: '',
    gender: '',
    chipNumber: '',
    ownerName: '',
    ownerContact: '',
    rut: '',
    email: '',
    address: '',
    medicalHistory: '',
  });

  // Errores por campo.
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado visual al enviar.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado visual de éxito.
  const [isSuccess, setIsSuccess] = useState(false);

  // =====================================================
  // Maneja cambios de inputs y textarea.
  // =====================================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // =====================================================
  // Maneja cambios de los select.
  // =====================================================
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // =====================================================
  // Valida el formulario antes de enviar.
  // Se alinea con el validador real de MongoDB.
  // =====================================================
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la mascota es requerido';
    }

    if (!formData.species.trim()) {
      newErrors.species = 'La especie es requerida';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'El nombre del dueño es requerido';
    }

    if (!formData.ownerContact.trim()) {
      newErrors.ownerContact = 'El contacto del dueño es requerido';
    }

    if (formData.age) {
      if (isNaN(Number(formData.age))) {
        newErrors.age = 'La edad debe ser un número';
      } else if (Number(formData.age) < 0) {
        newErrors.age = 'La edad no puede ser negativa';
      } else if (Number(formData.age) > 50) {
        newErrors.age = 'La edad no puede ser mayor a 50';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // Limpia el formulario luego de registrar.
  // =====================================================
  const resetForm = () => {
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      color: '',
      gender: '',
      chipNumber: '',
      ownerName: '',
      ownerContact: '',
      rut: '',
      email: '',
      address: '',
      medicalHistory: '',
    });
  };

  // =====================================================
  // Construye el payload final.
  // Convierte strings vacíos a undefined en opcionales.
  // =====================================================
  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      species: formData.species.trim(),
      ownerName: formData.ownerName.trim(),
      ownerContact: formData.ownerContact.trim(),

      breed: formData.breed.trim() || undefined,
      age: formData.age ? parseInt(formData.age, 10) : undefined,
      color: formData.color.trim() || undefined,
      gender: formData.gender || undefined,
      chipNumber: formData.chipNumber.trim() || undefined,
      rut: formData.rut.trim() || undefined,
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      medicalHistory: formData.medicalHistory.trim() || undefined,

      registrationDate: new Date().toISOString(),
    };
  };

  // =====================================================
  // Envía el formulario al backend.
  // =====================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const token = getToken();

    if (!token) {
      alert('Tu sesión expiró o no es válida. Debes iniciar sesión nuevamente.');
      setIsSubmitting(false);
      logout();
      return;
    }

    const payload = buildPayload();

    try {
      const res = await fetch(`${API_BASE}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          alert('Tu sesión expiró. Debes iniciar sesión nuevamente.');
          logout();
          setIsSubmitting(false);
          return;
        }

        alert('Error al registrar mascota: ' + (data.error || res.statusText));
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      resetForm();

      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      alert('Error de red al registrar mascota');
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // Opciones de especie.
  // IMPORTANTE:
  // Los values deben coincidir exactamente con el enum
  // definido en el validador de MongoDB.
  // =====================================================
  const speciesOptions = [
    { value: '', label: 'Seleccionar especie' },
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
    { value: 'ave', label: 'Ave' },
    { value: 'roedor', label: 'Roedor' },
    { value: 'reptil', label: 'Reptil' },
    { value: 'otro', label: 'Otro' },
  ];

  // =====================================================
  // Opciones del selector de género.
  // =====================================================
  const genderOptions = [
    { value: '', label: 'Seleccionar género' },
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' },
    { value: 'esterilizado', label: 'Esterilizada' },
    { value: 'castrado', label: 'Castrado' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <PlusCircle className="h-7 w-7 text-teal-600" />
        <h2 className="text-2xl font-bold text-teal-700">Agregar Nueva Mascota</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información de la mascota */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información de la Mascota
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Mascota"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Select
              label="Especie"
              name="species"
              value={formData.species}
              onChange={handleSelectChange('species')}
              options={speciesOptions}
              error={errors.species}
              required
            />

            <Input
              label="Raza"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            />

            <Input
              label="Edad"
              name="age"
              type="number"
              min="0"
              max="50"
              value={formData.age}
              onChange={handleChange}
              error={errors.age}
            />

            <Input
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />

            <Select
              label="Género"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange('gender')}
              options={genderOptions}
            />

            <Input
              label="Número de Chip"
              name="chipNumber"
              value={formData.chipNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Información del dueño */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información del Dueño
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre del Dueño"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              error={errors.ownerName}
              required
            />

            <Input
              label="Contacto"
              name="ownerContact"
              value={formData.ownerContact}
              onChange={handleChange}
              error={errors.ownerContact}
              required
            />

            <Input
              label="RUT"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <Input
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Historial médico */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Historial Médico
          </h3>

          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows={5}
            placeholder="Describe antecedentes, vacunas, tratamientos previos, alergias, etc."
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Botón de envío */}
        <div>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Mascota'}
          </Button>
        </div>

        {/* Mensaje de éxito */}
        {isSuccess && (
          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <Check className="h-5 w-5" />
            <span>¡La mascota ha sido registrada exitosamente!</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddPetForm;