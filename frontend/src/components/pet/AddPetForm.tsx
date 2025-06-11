import React, { useState } from 'react';
import { usePets } from '../../context/PetContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { PlusCircle, Check } from 'lucide-react';
import { API_BASE } from '../../apiBase';

const AddPetForm: React.FC = () => {
  const { addPet } = usePets();
  const [formData, setFormData] = useState({
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre de la mascota es requerido';
    if (!formData.species.trim()) newErrors.species = 'La especie es requerida';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'El nombre del dueño es requerido';
    if (!formData.ownerContact.trim()) newErrors.ownerContact = 'El contacto del dueño es requerido';
    
    if (formData.age && isNaN(Number(formData.age))) {
      newErrors.age = 'La edad debe ser un número';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const age = formData.age ? parseInt(formData.age, 10) : undefined;

    try {
      const res = await fetch(`${API_BASE}/api/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age,
          gender: formData.gender || undefined,
          registrationDate: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert('Error al registrar mascota: ' + (error.error || res.statusText));
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
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
          medicalHistory: '',
          rut: '',
          email: '',
          address: '',
        });
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      alert('Error de red al registrar mascota');
      setIsSubmitting(false);
    }
  };

  const speciesOptions = [
    { value: '', label: 'Seleccionar especie' },
    { value: 'Dog', label: 'Perro' },
    { value: 'Cat', label: 'Gato' },
    { value: 'Bird', label: 'Ave' },
    { value: 'Rabbit', label: 'Conejo' },
    { value: 'Hamster', label: 'Hámster' },
    { value: 'Other', label: 'Otro' },
  ];

  const genderOptions = [
    { value: '', label: 'Seleccionar género' },
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' },
    { value: 'esterilizado', label: 'Esterilizada' },
    { value: 'castrado', label: 'Castrado' }, // Nueva opción agregada
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-6">Agregar Nueva Mascota</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="col-span-2 mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Información de la Mascota</h3>
            <div className="w-full h-px bg-gray-200"></div>
          </div>
          
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
            options={speciesOptions}
            value={formData.species}
            onChange={handleSelectChange('species')}
            error={errors.species}
            required
          />
          
          <Input
            label="Raza"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="Opcional"
          />
          
          <Input
            label="Edad (Años)"
            name="age"
            type="number"
            min="0"
            value={formData.age}
            onChange={handleChange}
            error={errors.age}
            placeholder="Opcional"
          />
          
          <Input
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Opcional"
          />
          
          <Select
            label="Género"
            options={genderOptions}
            value={formData.gender}
            onChange={handleSelectChange('gender')}
            error={errors.gender}
          />

          <Input
            label="Número de Chip"
            name="chipNumber"
            value={formData.chipNumber}
            onChange={handleChange}
            placeholder="Opcional"
          />
          
          <div className="col-span-2 mt-4 mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Información del Dueño</h3>
            <div className="w-full h-px bg-gray-200"></div>
          </div>
          
          <Input
            label="Nombre del Dueño"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            error={errors.ownerName}
            required
          />
          
          <Input
            label="Número de Contacto"
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
            placeholder="Opcional"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Opcional"
          />

          <Input
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Opcional"
          />
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historial Médico
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={3}
              placeholder="Opcional: Agregar historial médico relevante"
            />
          </div>
          
          <div className="col-span-2 mt-6 flex flex-col items-center">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <PlusCircle size={18} className="mr-2" />
              Registrar Mascota
            </Button>
            {isSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center transition-opacity duration-500">
                <Check size={20} className="mr-2" />
                <span>¡La mascota ha sido registrada exitosamente!</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPetForm;