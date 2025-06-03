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

  // Puedes agregar PUT y DELETE aquí si lo necesitas
};