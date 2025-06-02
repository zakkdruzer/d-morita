require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const petsRouter = require('./routes/pets');
const Pet = require('./models/Pet'); // <-- Asegúrate de importar el modelo

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const app = express();
app.use(cors());
app.use(express.json());

// Rutas para mascotas
app.use('/api/pets', petsRouter);

// Prueba de validación
const testPet = new Pet({
  name: "Test",
  // species: omitido intencionalmente (debería fallar)
  ownerContact: "123" // inválido si tienes validación extra
});

testPet.save()
  .then(() => console.log("Debería fallar!"))
  .catch(err => console.log("Error esperado:", err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});