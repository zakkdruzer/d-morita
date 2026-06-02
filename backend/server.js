require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const petsRouter = require('./api/pets');
const { router: authRouter } = require('./api/auth');
const Pet = require('./models/Pet');

const app = express();

// Validación básica de variables críticas
if (!process.env.MONGODB_URI) {
  console.error('❌ Falta la variable de entorno MONGODB_URI');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ Falta la variable de entorno JWT_SECRET');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API de El Diván de Morita funcionando',
    db: mongoose.connection.name || 'sin conexión todavía',
  });
});

// Ruta simple de healthcheck
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    mongoState: mongoose.connection.readyState,
  });
});

// Rutas principales
app.use('/api/auth', authRouter);
app.use('/api/pets', petsRouter);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;

// Conexión a MongoDB + arranque del servidor
mongoose
  .connect(process.env.MONGODB_URI, {
    retryWrites: true,
    w: 'majority',
  })
  .then(async () => {
    console.log('✅ Conectado a MongoDB Atlas');
    console.log('📂 Base de datos actual:', mongoose.connection.name);

    try {
      await Pet.collection.createIndex({ name: 1 });
      await Pet.collection.createIndex({ ownerName: 1 });
      await Pet.collection.createIndex({ chipNumber: 1 }, { unique: true, sparse: true });
      await Pet.collection.createIndex({ rut: 1 }, { unique: true, sparse: true });

      const count = await Pet.countDocuments({});
      console.log(`📊 Total mascotas: ${count}`);
    } catch (error) {
      console.error('⚠️ Error creando índices o contando mascotas:', error);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1);
  });