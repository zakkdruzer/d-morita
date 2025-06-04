require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const petsRouter = require('./api/pets');
const Pet = require('./models/Pet'); // Asegúrate de tener este import

mongoose.connect(process.env.MONGODB_URI, {
  retryWrites: true,
  w: 'majority'
})
.then(async () => {
  console.log('Conectado a MongoDB');
  // Crear índices para optimización
  await Pet.collection.createIndex({ name: 1 }); // Índice para búsqueda por nombre
  await Pet.collection.createIndex({ ownerName: 1 }); // Índice para búsqueda por dueño
  await Pet.collection.createIndex({ chipNumber: 1 }, { unique: true, sparse: true });
  await Pet.collection.createIndex({ rut: 1 }, { unique: true, sparse: true });
})
.catch(err => console.error('Error de conexión:', err));

mongoose.connection.once('open', () => {
  console.log('✅ Conectado a MongoDB Atlas');
  
  // Prueba de conexión: contar documentos
  Pet.countDocuments({})
    .then(count => console.log(`📊 Total mascotas: ${count}`))
    .catch(err => console.error('Error contando mascotas:', err));
});

const app = express();
app.use(cors());
app.use(express.json());

// Rutas para mascotas
app.use('/api/pets', petsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});