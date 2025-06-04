const mongoose = require('mongoose');
const Pet = require('../../models/Pet');

module.exports = async (req, res) => {
  await mongoose.connect(process.env.MONGODB_URI);

  const { id } = req.query;

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
      const pet = await Pet.findByIdAndUpdate(id, req.body, { new: true });
      if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
      return res.status(200).json(pet);
    } catch (error) {
      return res.status(400).json({ error: 'ID inválido' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const pet = await Pet.findByIdAndDelete(id);
      if (!pet) return res.status(404).json({ message: 'Mascota no encontrada' });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: 'ID inválido' });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
};