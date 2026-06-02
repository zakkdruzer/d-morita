const mongoose = require('mongoose');
const Pet = require('../../models/Pet');
const { authMiddleware } = require('../../api/auth');

// Helper para poder usar authMiddleware con await.
const runAuth = (req, res) =>
  new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

module.exports = async (req, res) => {
  try {
    // Conexión a MongoDB.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a la base de datos:', mongoose.connection.name);
    console.log('req.url:', req.url, 'req.method:', req.method);

    // Todas las rutas que modifican datos requieren token.
    const requiresAuth = ['POST', 'PUT', 'DELETE'].includes(req.method);

    if (requiresAuth) {
      try {
        await runAuth(req, res);
      } catch (error) {
        // authMiddleware ya responde si el token falla.
        return;
      }
    }

    // =========================================================
    // Ruta de prueba
    // =========================================================
    if (req.url === '/test') {
      return res.status(200).json({ ok: true });
    }

    // =========================================================
    // Ruta: /api/pets/:id/consultations/:consultationId
    // Editar o eliminar una consulta específica
    // =========================================================
    const editConsultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations\/([a-f\d]{24})$/i);

    if (editConsultMatch) {
      const petId = editConsultMatch[1];
      const consultationId = editConsultMatch[2];

      // ---------------------------------------------------------
      // PUT: editar consulta
      // ---------------------------------------------------------
      if (req.method === 'PUT') {
        try {
          const pet = await Pet.findById(petId);

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          const consultation = pet.consultations.id(consultationId);

          if (!consultation) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
          }

          // Actualizamos campos editables.
          consultation.fecha = req.body.fecha;
          consultation.anamnesis = req.body.anamnesis;
          consultation.examenFisico = req.body.examenFisico;
          consultation.preDiagnostico = req.body.preDiagnostico;
          consultation.observaciones = req.body.observaciones;
          consultation.tratamientos = req.body.tratamientos;
          consultation.recomendacion = req.body.recomendacion;

          // Guardamos quién hizo la modificación.
          consultation.updatedBy = req.user.id;

          // También registramos la modificación sobre la mascota.
          pet.updatedBy = req.user.id;

          await pet.save();

          return res.status(200).json(consultation);
        } catch (error) {
          console.error('Error al editar consulta:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      // ---------------------------------------------------------
      // DELETE: eliminar consulta
      // ---------------------------------------------------------
      if (req.method === 'DELETE') {
        try {
          const pet = await Pet.findById(petId);

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          const consultation = pet.consultations.id(consultationId);

          if (!consultation) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
          }

          consultation.deleteOne();
          pet.updatedBy = req.user.id;

          await pet.save();

          return res.status(200).json({ message: 'Consulta eliminada' });
        } catch (error) {
          console.error('Error al eliminar consulta:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(405).end();
    }

    // =========================================================
    // Ruta: /api/pets/:id/consultations
    // Listar o crear consultas de una mascota
    // =========================================================
    const consultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations$/i);

    if (consultMatch) {
      const id = consultMatch[1];

      // ---------------------------------------------------------
      // GET: obtener consultas de una mascota
      // ---------------------------------------------------------
      if (req.method === 'GET') {
        try {
          // IMPORTANTE:
          // populate() convierte createdBy y updatedBy
          // desde ObjectId a un objeto de usuario real.
          const pet = await Pet.findById(id)
            .populate('consultations.createdBy', 'username email')
            .populate('consultations.updatedBy', 'username email');

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          return res.status(200).json(pet.consultations || []);
        } catch (error) {
          console.error('Error al obtener consultas:', error);
          return res.status(400).json({ error: 'ID inválido' });
        }
      }

      // ---------------------------------------------------------
      // POST: crear nueva consulta
      // ---------------------------------------------------------
      if (req.method === 'POST') {
        try {
          const pet = await Pet.findById(id);

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          // Creamos la consulta con auditoría.
          pet.consultations.push({
            fecha: req.body.fecha,
            anamnesis: req.body.anamnesis,
            examenFisico: req.body.examenFisico,
            preDiagnostico: req.body.preDiagnostico,
            observaciones: req.body.observaciones,
            tratamientos: req.body.tratamientos,
            recomendacion: req.body.recomendacion,
            createdBy: req.user.id,
            updatedBy: req.user.id,
          });

          pet.updatedBy = req.user.id;

          await pet.save();

          // Volvemos a buscar la mascota con populate
          // para devolver la consulta recién creada con username/email.
          const populatedPet = await Pet.findById(id)
            .populate('consultations.createdBy', 'username email')
            .populate('consultations.updatedBy', 'username email');

          const newConsultation =
            populatedPet.consultations[populatedPet.consultations.length - 1];

          return res.status(201).json(newConsultation);
        } catch (error) {
          console.error('Error al crear consulta:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(405).end();
    }

    // =========================================================
    // Ruta: /api/pets/:id
    // Obtener, editar o eliminar mascota
    // =========================================================
    const idMatch = req.url.match(/^\/([a-f\d]{24})$/i);

    if (idMatch) {
      const id = idMatch[1];

      // ---------------------------------------------------------
      // GET: obtener mascota por id
      // ---------------------------------------------------------
      if (req.method === 'GET') {
        try {
          const pet = await Pet.findById(id)
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email')
            .populate('consultations.createdBy', 'username email')
            .populate('consultations.updatedBy', 'username email');

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          return res.status(200).json(pet);
        } catch (error) {
          console.error('Error al obtener mascota:', error);
          return res.status(400).json({ error: 'ID inválido' });
        }
      }

      // ---------------------------------------------------------
      // PUT: editar mascota
      // ---------------------------------------------------------
      if (req.method === 'PUT') {
        try {
          const pet = await Pet.findByIdAndUpdate(
            id,
            {
              ...req.body,
              updatedBy: req.user.id,
            },
            {
              new: true,
              runValidators: true,
            }
          )
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email');

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          return res.status(200).json(pet);
        } catch (error) {
          console.error('Error al editar mascota:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      // ---------------------------------------------------------
      // DELETE: eliminar mascota
      // ---------------------------------------------------------
      if (req.method === 'DELETE') {
        try {
          const deletedPet = await Pet.findByIdAndDelete(id);

          if (!deletedPet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          return res.status(200).json({ message: 'Mascota eliminada' });
        } catch (error) {
          console.error('Error al eliminar mascota:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(405).end();
    }

    // =========================================================
    // Ruta: /api/pets y /api/pets?name=...
    // Listar o crear mascotas
    // =========================================================
    if (req.url === '' || req.url === '/' || req.url.startsWith('/?')) {
      // ---------------------------------------------------------
      // GET: listar mascotas
      // ---------------------------------------------------------
      if (req.method === 'GET') {
        try {
          const { name } = req.query;
          let pets;

          if (name) {
            pets = await Pet.find({
              name: { $regex: `^${name}$`, $options: 'i' },
            })
              .populate('createdBy', 'username email')
              .populate('updatedBy', 'username email');
          } else {
            pets = await Pet.find()
              .populate('createdBy', 'username email')
              .populate('updatedBy', 'username email');
          }

          return res.status(200).json(pets);
        } catch (error) {
          console.error('Error al listar mascotas:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      // ---------------------------------------------------------
      // POST: crear mascota
      // ---------------------------------------------------------
      if (req.method === 'POST') {
        try {
          const newPet = new Pet({
            ...req.body,
            createdBy: req.user.id,
            updatedBy: req.user.id,
          });

          await newPet.save();

          const populatedPet = await Pet.findById(newPet._id)
            .populate('createdBy', 'username email')
            .populate('updatedBy', 'username email');

          return res.status(201).json(populatedPet);
        } catch (error) {
          console.error('Error al crear mascota:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(405).end();
    }

    // Si ninguna ruta coincide.
    return res.status(404).json({ error: 'Ruta no encontrada' });
  } catch (error) {
    console.error('Error general en /api/pets:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};