const mongoose = require('mongoose');
const Pet = require('../../models/Pet');

module.exports = async (req, res) => {
  // Solo responde si la ruta es exactamente /api/pets (sin id)
  if (req.url !== '/' && req.url !== '') {
    // IMPORTANTE: responde explícitamente para evitar que la petición quede colgada
    return res.status(404).end();
  }

  await mongoose.connect(process.env.MONGODB_URI);

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
};