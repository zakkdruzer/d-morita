require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Este script crea un usuario admin inicial.
// Se ejecuta una sola vez desde consola.
async function seedAdmin() {
  try {
    console.log('MONGODB_URI cargada?', !!process.env.MONGODB_URI);
    console.log('URI preview:', process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@'));
    // Conectamos a MongoDB.
    await mongoose.connect(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });

    // Revisamos si ya existe un admin con username "admin".
    const existingUser = await User.findOne({ username: 'admin' });

    if (existingUser) {
      console.log('El usuario admin ya existe');
      process.exit(0);
    }

    // Creamos el usuario inicial.
    // La contraseña será hasheada automáticamente por UserSchema.pre('save').
    const admin = new User({
      username: 'admin',
      email: 'admin@vetapp.com',
      password: 'Admin1234',
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Usuario admin creado correctamente');
    process.exit(0);
  } catch (error) {
    console.error('Error creando admin:', error);
    process.exit(1);
  }
}

seedAdmin();