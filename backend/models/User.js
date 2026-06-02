const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema del usuario.
// Aquí definimos cómo se guarda un usuario en MongoDB.
const UserSchema = new mongoose.Schema(
  {
    // Nombre de usuario para iniciar sesión.
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Email del usuario.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Aquí NO guardamos la contraseña en texto plano.
    // Antes de guardar, la vamos a convertir en hash con bcrypt.
    password: {
      type: String,
      required: true,
    },

    // Rol del usuario, útil si después quieres permisos distintos.
    role: {
      type: String,
      default: 'admin',
    },
  },
  {
    // Agrega createdAt y updatedAt automáticamente.
    timestamps: true,
  }
);

// Middleware que corre ANTES de guardar el usuario.
// Sirve para hashear la contraseña con bcrypt.
UserSchema.pre('save', async function (next) {
  // Si la contraseña no fue modificada, no la volvemos a hashear.
  if (!this.isModified('password')) return next();

  try {
    // Convierte la contraseña en hash seguro.
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Método del modelo para comparar contraseña ingresada vs hash guardado.
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Exportamos el modelo para usarlo en las rutas.
module.exports = mongoose.model('User', UserSchema);