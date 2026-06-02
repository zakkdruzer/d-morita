require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// Rutas existentes de mascotas.
const petsRouter = require('./api/pets');

// Modelo Pet para crear índices y revisar conexión.
const Pet = require('./models/Pet');

// Nuevas rutas de autenticación.
const { router: authRouter } = require('./api/auth');

// Conectamos a MongoDB Atlas.
mongoose
  .connect(process.env.MONGODB_URI, {
    retryWrites: true,
    w: 'majority',
  })
  .then(async () => {
    console.log('Conectado a MongoDB');

    // Índices para mejorar búsquedas y evitar duplicados en algunos campos.
    await Pet.collection.createIndex({ name: 1 });
    await Pet.collection.createIndex({ ownerName: 1 });
    await Pet.collection.createIndex({ chipNumber: 1 }, { unique: true, sparse: true });
    await Pet.collection.createIndex({ rut: 1 }, { unique: true, sparse: true });
  })
  .catch((err) => console.error('Error de conexión:', err));

// Cuando Mongo se conecta, mostramos info de prueba.
mongoose.connection.once('open', () => {
  console.log('✅ Conectado a MongoDB Atlas');

  Pet.countDocuments({})
    .then((count) => console.log(`📊 Total mascotas: ${count}`))
    .catch((err) => console.error('Error contando mascotas:', err));
});

const app = express();

// Permitimos solicitudes desde el frontend.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Permite leer JSON enviado desde el frontend.
app.use(express.json());

// Registramos rutas:
// /api/auth/login
// /api/auth/me
app.use('/api/auth', authRouter);

// Registramos rutas existentes de mascotas.
app.use('/api/pets', petsRouter);

// Iniciamos servidor.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});