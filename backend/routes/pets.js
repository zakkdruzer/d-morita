const mongoose = require('mongoose');
const Pet = require('../models/Pet');

module.exports = async (req, res) => {
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
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({ errors });
      } else if (error.code === 11000) {
        return res.status(400).json({ error: 'Valor duplicado: ' + Object.keys(error.keyPattern)[0] });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Otros métodos (PUT, DELETE, etc.) pueden agregarse aquí
};