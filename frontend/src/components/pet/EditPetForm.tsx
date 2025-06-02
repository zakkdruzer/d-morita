import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePets } from '../../context/PetContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const EditPetForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { pets, updatePet } = usePets();
  const navigate = useNavigate();

  const pet = pets.find((p) => p.id === id);

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

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age ? String(pet.age) : '',
        color: pet.color || '',
        gender: pet.gender || '',
        chipNumber: pet.chipNumber || '',
        ownerName: pet.ownerName || '',
        ownerContact: pet.ownerContact || '',
        rut: pet.rut || '',
        email: pet.email || '',
        address: pet.address || '',
        medicalHistory: pet.medicalHistory || '',
      });
    }
  }, [pet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pet) {
      updatePet({ ...pet, ...formData, age: Number(formData.age) });
      navigate(`/mascota/${pet.id}`);
    }
  };

  if (!pet) {
    return <div className="p-8 text-center">Mascota no encontrada.</div>;
  }

  // Opciones de select (puedes reutilizar las de AddPetForm)
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
    { value: 'castrado', label: 'Castrado' },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-6">Editar Mascota</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Input label="Nombre de la Mascota" name="name" value={formData.name} onChange={handleChange} required />
          <Select label="Especie" options={speciesOptions} value={formData.species} onChange={handleSelectChange('species')} required />
          <Input label="Raza" name="breed" value={formData.breed} onChange={handleChange} />
          <Input label="Edad (Años)" name="age" type="number" min="0" value={formData.age} onChange={handleChange} />
          <Input label="Color" name="color" value={formData.color} onChange={handleChange} />
          <Select label="Género" options={genderOptions} value={formData.gender} onChange={handleSelectChange('gender')} />
          <Input label="Número de Chip" name="chipNumber" value={formData.chipNumber} onChange={handleChange} />
          <Input label="Nombre del Dueño" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
          <Input label="Número de Contacto" name="ownerContact" value={formData.ownerContact} onChange={handleChange} required />
          <Input label="RUT" name="rut" value={formData.rut} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          <Input label="Dirección" name="address" value={formData.address} onChange={handleChange} />
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1">Historial Médico</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8 justify-end">
          <Button type="button" variant="secondary" onClick={() => navigate(`/mascota/${pet.id}`)}>
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

export default EditPetForm;