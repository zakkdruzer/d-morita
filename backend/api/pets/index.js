const mongoose = require('mongoose');
const Pet = require('../../models/Pet');
const { authMiddleware } = require('../../api/auth');

// Esta función nos permite usar el middleware auth en este handler.
// Como este archivo no está hecho como express.Router clásico,
// lo envolvemos en una promesa para poder hacer await.
const runAuth = (req, res) =>
  new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

module.exports = async (req, res) => {
  // Conexión a MongoDB.
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a la base de datos:', mongoose.connection.name);
  console.log('req.url:', req.url, 'req.method:', req.method);

  // Estas operaciones modifican datos, por lo tanto exigen token.
  const requiresAuth = ['POST', 'PUT', 'DELETE'].includes(req.method);

  if (requiresAuth) {
    try {
      // Si el token es válido, authMiddleware deja req.user disponible.
      await runAuth(req, res);
    } catch (error) {
      // authMiddleware ya respondió 401 si falló.
      return;
    }
  }

  // Endpoint simple de prueba.
  // Útil para verificar que la ruta existe.
  if (req.url === '/test') {
    return res.status(200).json({ ok: true });
  }

  // =========================================================
  // /api/pets/:id/consultations/:consultationId
  // Editar o eliminar una consulta específica
  // =========================================================
  const editConsultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations\/([a-f\d]{24})$/i);
  if (editConsultMatch) {
    const petId = editConsultMatch[1];
    const consultationId = editConsultMatch[2];

    // Editar una consulta existente
    if (req.method === 'PUT') {
      try {
        const pet = await Pet.findById(petId);
        if (!pet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        // Buscamos la consulta dentro del arreglo embebido.
        const consultation = pet.consultations.id(consultationId);
        if (!consultation) {
          return res.status(404).json({ message: 'Consulta no encontrada' });
        }

        // Actualizamos los datos de la consulta.
        // También dejamos registro de quién la modificó.
        Object.assign(consultation, req.body, {
          updatedBy: req.user.id,
        });

        // Como cambió algo dentro de la mascota, también actualizamos su updatedBy.
        pet.updatedBy = req.user.id;

        await pet.save();
        return res.status(200).json(consultation);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    // Eliminar una consulta específica
    if (req.method === 'DELETE') {
      try {
        const pet = await Pet.findById(petId);
        if (!pet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        // Eliminamos la consulta del arreglo.
        pet.consultations = pet.consultations.filter(
          (c) => c._id.toString() !== consultationId
        );

        // Registramos quién modificó por última vez la mascota.
        pet.updatedBy = req.user.id;

        await pet.save();
        return res.status(200).json({ message: 'Consulta eliminada' });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.status(405).end();
  }

  // =========================================================
  // /api/pets/:id/consultations
  // Obtener consultas o agregar una nueva consulta
  // =========================================================
  const consultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations$/i);
  if (consultMatch) {
    const id = consultMatch[1];

    // Obtener todas las consultas de una mascota
    if (req.method === 'GET') {
      try {
        const pet = await Pet.findById(id);
        if (!pet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        return res.status(200).json(pet.consultations || []);
      } catch (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }
    }

    // Agregar una nueva consulta a la mascota
    if (req.method === 'POST') {
      try {
        const pet = await Pet.findById(id);
        if (!pet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        pet.consultations = pet.consultations || [];

        // Guardamos la consulta nueva junto con quién la creó y la editó por última vez.
        pet.consultations.push({
          ...req.body,
          createdBy: req.user.id,
          updatedBy: req.user.id,
        });

        // También dejamos constancia de quién modificó la mascota.
        pet.updatedBy = req.user.id;

        await pet.save();
        return res.status(201).json(pet.consultations);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.status(405).end();
  }

  // =========================================================
  // /api/pets/:id
  // Obtener, editar o eliminar una mascota
  // =========================================================
  const idMatch = req.url.match(/^\/([a-f\d]{24})$/i);
  if (idMatch) {
    const id = idMatch[1];

    // Obtener una mascota por id
    if (req.method === 'GET') {
      try {
        const pet = await Pet.findById(id);
        if (!pet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        return res.status(200).json(pet);
      } catch (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }
    }

    // Editar una mascota
    if (req.method === 'PUT') {
      try {
        const pet = await Pet.findByIdAndUpdate(
          id,
          {
            ...req.body,
            // Registramos quién hizo la edición.
            updatedBy: req.user.id,
          },
          { new: true, runValidators: true }
        );

        if (!pet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        return res.status(200).json(pet);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    // Eliminar una mascota
    if (req.method === 'DELETE') {
      try {
        const deletedPet = await Pet.findByIdAndDelete(id);
        if (!deletedPet) {
          return res.status(404).json({ message: 'Mascota no encontrada' });
        }

        return res.status(200).json({ message: 'Mascota eliminada' });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.status(405).end();
  }

  // =========================================================
  // /api/pets
  // Listar mascotas o crear una nueva
  // =========================================================
  if (req.url === '' || req.url === '/' || req.url.startsWith('/?')) {
    // Listar mascotas o buscar por nombre
    if (req.method === 'GET') {
      const { name } = req.query;
      let pets;

      if (name) {
        // Búsqueda exacta por nombre, ignorando mayúsculas/minúsculas.
        pets = await Pet.find({
          name: { $regex: `^${name}$`, $options: 'i' },
        });
      } else {
        // Si no hay filtro, devolvemos todas.
        pets = await Pet.find();
      }

      return res.status(200).json(pets);
    }

    // Crear una mascota nueva
    if (req.method === 'POST') {
      try {
        const newPet = new Pet({
          ...req.body,

          // Usuario que creó la mascota.
          createdBy: req.user.id,

          // Al crearla, el último editor también es el creador.
          updatedBy: req.user.id,
        });

        await newPet.save();
        return res.status(201).json(newPet);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    return res.status(405).end();
  }

  // Si ninguna ruta coincide, respondemos 404.
  return res.status(404).end();
};