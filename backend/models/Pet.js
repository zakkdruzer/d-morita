const mongoose = require('mongoose');

// Schema de cada consulta médica dentro de una mascota.
// Cada consulta queda embebida dentro del documento Pet.
const ConsultationSchema = new mongoose.Schema(
  {
    // Fecha clínica o fecha escrita por el veterinario.
    fecha: String,

    // Campos del contenido de la consulta.
    anamnesis: String,
    examenFisico: String,
    preDiagnostico: String,
    observaciones: String,
    tratamientos: String,
    recomendacion: String,

    // Usuario que creó esta consulta.
    // Guardamos el ObjectId del usuario autenticado.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Último usuario que modificó esta consulta.
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Mantiene un _id propio por cada consulta.
    _id: true,

    // Mongoose agrega automáticamente:
    // - createdAt
    // - updatedAt
    timestamps: true,
  }
);

// Schema principal de la mascota.
const PetSchema = new mongoose.Schema(
  {
    // Datos básicos de la mascota.
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: String,
    age: Number,
    color: String,
    gender: String,
    chipNumber: String,

    // Datos del tutor / dueño.
    ownerName: { type: String, required: true },
    ownerContact: { type: String, required: true },
    rut: String,
    email: String,
    address: String,

    // Historial clínico general.
    medicalHistory: String,

    // Si quieres mantener una fecha manual visible para negocio.
    // Ojo: esto es distinto de createdAt.
    registrationDate: String,

    // Arreglo de consultas médicas embebidas.
    consultations: [ConsultationSchema],

    // Usuario que creó esta mascota.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Último usuario que modificó esta mascota.
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Mongoose agrega automáticamente:
    // - createdAt
    // - updatedAt
    timestamps: true,
  }
);

// Exportamos el modelo para usarlo en las rutas.
module.exports = mongoose.model('Pet', PetSchema);