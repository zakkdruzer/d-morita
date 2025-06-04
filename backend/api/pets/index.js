const mongoose = require('mongoose');
const Pet = require('../../models/Pet');

module.exports = async (req, res) => {
  await mongoose.connect(process.env.MONGODB_URI);

  // /api/pets/test
  if (req.url === '/test') {
    return res.status(200).json({ ok: true });
  }

  // /api/pets/:id/consultations/:consultationId
  const editConsultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations\/([a-f\d]{24})$/i);
  if (editConsultMatch) {
    const petId = editConsultMatch[1];
    const consultationId = editConsultMatch[2];

    if (req.method === 'PUT') {
      try {
        const pet = await Pet.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
        const idx = pet.consultations.findIndex(c => c._id.toString() === consultationId);
        if (idx === -1) return res.status(404).json({ message: 'Consulta no encontrada' });
        pet.consultations[idx] = { ...pet.consultations[idx]._doc, ...req.body };
        await pet.save();
        return res.status(200).json(pet.consultations[idx]);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    if (req.method === 'DELETE') {
      try {
        const pet = await Pet.findById(petId);
        if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
        pet.consultations = pet.consultations.filter(c => c._id.toString() !== consultationId);
        await pet.save();
        return res.status(200).json({ message: 'Consulta eliminada' });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(405).end();
  }

  // /api/pets/:id/consultations
  const consultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations$/i);
  if (consultMatch) {
    const id = consultMatch[1];
    if (req.method === 'GET') {
      try {
        const pet = await Pet.findById(id);
        if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
        return res.status(200).json(pet.consultations || []);
      } catch (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }
    }
    if (req.method === 'POST') {
      try {
        const pet = await Pet.findById(id);
        if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
        pet.consultations = pet.consultations || [];
        pet.consultations.push(req.body);
        await pet.save();
        return res.status(201).json(pet.consultations);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(405).end();
  }

  // /api/pets/:id (GET, PUT, DELETE)
  const idMatch = req.url.match(/^\/([a-f\d]{24})$/i);
  if (idMatch) {
    const id = idMatch[1];
    if (req.method === 'GET') {
      try {
        const pet = await Pet.findById(id);
        if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
        return res.status(200).json(pet);
      } catch (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }
    }
    if (req.method === 'PUT') {
      try {
        const updatedPet = await Pet.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPet) return res.status(404).json({ message: 'Mascota no encontrada' });
        return res.status(200).json(updatedPet);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    if (req.method === 'DELETE') {
      try {
        const deletedPet = await Pet.findByIdAndDelete(id);
        if (!deletedPet) return res.status(404).json({ message: 'Mascota no encontrada' });
        return res.status(200).json({ message: 'Mascota eliminada' });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(405).end();
  }

  // /api/pets y /api/pets?name=...
  if (req.url === '/' || req.url.startsWith('/?')) {
    if (req.method === 'GET') {
      const { name } = req.query;
      let pets;
      if (name) {
        pets = await Pet.find({ name: { $regex: `^${name}$`, $options: 'i' } });
      } else {
        pets = await Pet.find();
      }
      return res.status(200).json(pets);
    }
    if (req.method === 'POST') {
      try {
        const newPet = new Pet(req.body);
        await newPet.save();
        return res.status(201).json(newPet);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
    return res.status(405).end();
  }

  // Si ninguna ruta coincide
  return res.status(404).end();
};