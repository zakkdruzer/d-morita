const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// Crear nueva mascota
router.post('/', async (req, res) => {
  try {
    const newPet = new Pet(req.body);
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Errores de validación de Mongoose
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ errors });
    } else if (error.code === 11000) {
      // Error de duplicado (índice único)
      return res.status(400).json({ error: 'Valor duplicado: ' + Object.keys(error.keyPattern)[0] });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todas las mascotas
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mascotas' });
  }
});

// Agregar consulta a una mascota
router.post('/:id/consultations', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    pet.consultations.push(req.body); // req.body debe tener los datos de la consulta
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar consulta' });
  }
});

module.exports = router;