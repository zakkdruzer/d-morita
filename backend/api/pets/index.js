const mongoose = require('mongoose');
const Pet = require('../../models/Pet');
const { authMiddleware } = require('../../api/auth');

// Esta función envuelve authMiddleware en una Promise
// para poder usarlo con await dentro del handler.
const runAuth = (req, res) =>
  new Promise((resolve, reject) => {
    authMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

module.exports = async (req, res) => {
  try {
    // Nos conectamos a MongoDB.
    // Idealmente esto debería hacerse una sola vez en server.js,
    // pero aquí lo dejamos compatible con tu estructura actual.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a la base de datos:', mongoose.connection.name);
    console.log('req.url:', req.url, 'req.method:', req.method);

    // Todas las rutas que modifican datos requieren autenticación.
    const requiresAuth = ['POST', 'PUT', 'DELETE'].includes(req.method);

    if (requiresAuth) {
      try {
        // Si el token es válido, authMiddleware dejará req.user disponible.
        await runAuth(req, res);
      } catch (error) {
        // Si authMiddleware ya respondió con error, cortamos aquí.
        return;
      }
    }

    // =========================================================
    // Ruta de prueba: /api/pets/test
    // =========================================================
    if (req.url === '/test') {
      return res.status(200).json({ ok: true });
    }

    // =========================================================
    // Ruta: /api/pets/:id/consultations/:consultationId
    // Permite editar o eliminar una consulta específica
    // =========================================================
    const editConsultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations\/([a-f\d]{24})$/i);

    if (editConsultMatch) {
      const petId = editConsultMatch[1];
      const consultationId = editConsultMatch[2];

      // ---------------------------------------------------------
      // PUT: editar una consulta existente
      // ---------------------------------------------------------
      if (req.method === 'PUT') {
        try {
          const pet = await Pet.findById(petId);

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          // Usamos el helper de subdocumentos de Mongoose.
          const consultation = pet.consultations.id(consultationId);

          if (!consultation) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
          }

          // Actualizamos solo los campos editables de la consulta.
          consultation.fecha = req.body.fecha;
          consultation.anamnesis = req.body.anamnesis;
          consultation.examenFisico = req.body.examenFisico;
          consultation.preDiagnostico = req.body.preDiagnostico;
          consultation.observaciones = req.body.observaciones;
          consultation.tratamientos = req.body.tratamientos;
          consultation.recomendacion = req.body.recomendacion;

          // Guardamos quién hizo la última modificación.
          consultation.updatedBy = req.user.id;

          // Como la mascota fue modificada indirectamente, actualizamos también su updatedBy.
          pet.updatedBy = req.user.id;

          // Guardamos todo el documento.
          // Si ConsultationSchema tiene timestamps: true,
          // Mongoose actualizará updatedAt automáticamente.
          await pet.save();

          return res.status(200).json(consultation);
        } catch (error) {
          console.error('Error al editar consulta:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      // ---------------------------------------------------------
      // DELETE: eliminar una consulta existente
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

          // Eliminamos la consulta del arreglo embebido.
          consultation.deleteOne();

          // Guardamos quién realizó la modificación.
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
    // Permite listar o crear consultas de una mascota
    // =========================================================
    const consultMatch = req.url.match(/^\/([a-f\d]{24})\/consultations$/i);

    if (consultMatch) {
      const id = consultMatch[1];

      // ---------------------------------------------------------
      // GET: obtener todas las consultas de una mascota
      // ---------------------------------------------------------
      if (req.method === 'GET') {
        try {
          const pet = await Pet.findById(id);

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
      // POST: crear una nueva consulta para una mascota
      // ---------------------------------------------------------
      if (req.method === 'POST') {
        try {
          const pet = await Pet.findById(id);

          if (!pet) {
            return res.status(404).json({ message: 'Mascota no encontrada' });
          }

          // Agregamos una nueva consulta embebida.
          // Importante:
          // - createdBy y updatedBy se asignan manualmente.
          // - createdAt y updatedAt los agrega Mongoose automáticamente
          //   si ConsultationSchema tiene timestamps: true.
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

          // También marcamos qué usuario modificó la mascota.
          pet.updatedBy = req.user.id;

          await pet.save();

          // Devolvemos la última consulta recién creada.
          const newConsultation = pet.consultations[pet.consultations.length - 1];

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
    // Permite obtener, editar o eliminar una mascota
    // =========================================================
    const idMatch = req.url.match(/^\/([a-f\d]{24})$/i);

    if (idMatch) {
      const id = idMatch[1];

      // ---------------------------------------------------------
      // GET: obtener una mascota por id
      // ---------------------------------------------------------
      if (req.method === 'GET') {
        try {
          const pet = await Pet.findById(id);

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
      // PUT: editar una mascota
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
          );

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
      // DELETE: eliminar una mascota
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
    // Permite listar mascotas o crear una nueva
    // =========================================================
    if (req.url === '' || req.url === '/' || req.url.startsWith('/?')) {
      // ---------------------------------------------------------
      // GET: listar mascotas o buscar por nombre
      // ---------------------------------------------------------
      if (req.method === 'GET') {
        try {
          const { name } = req.query;
          let pets;

          if (name) {
            // Búsqueda exacta, ignorando mayúsculas/minúsculas.
            pets = await Pet.find({
              name: { $regex: `^${name}$`, $options: 'i' },
            });
          } else {
            pets = await Pet.find();
          }

          return res.status(200).json(pets);
        } catch (error) {
          console.error('Error al listar mascotas:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      // ---------------------------------------------------------
      // POST: crear una mascota nueva
      // ---------------------------------------------------------
      if (req.method === 'POST') {
        try {
          const newPet = new Pet({
            ...req.body,

            // Guardamos quién creó la mascota.
            createdBy: req.user.id,

            // Al crearla, el último editor también es el creador.
            updatedBy: req.user.id,
          });

          await newPet.save();

          return res.status(201).json(newPet);
        } catch (error) {
          console.error('Error al crear mascota:', error);
          return res.status(400).json({ error: error.message });
        }
      }

      return res.status(405).end();
    }

    // Si ninguna ruta coincide, respondemos 404.
    return res.status(404).json({ error: 'Ruta no encontrada' });
  } catch (error) {
    console.error('Error general en /api/pets:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};