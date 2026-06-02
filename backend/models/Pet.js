const mongoose = require('mongoose');

// =========================================================
// Schema de cada consulta médica
// =========================================================
// Cada consulta se guarda dentro del arreglo "consultations"
// del documento principal de la mascota.
const ConsultationSchema = new mongoose.Schema(
  {
    // Fecha clínica que ingresa el usuario en el formulario.
    // Esta fecha es distinta de createdAt.
    fecha: String,

    // Contenido clínico de la consulta.
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

    // Usuario que realizó la última modificación.
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Mantiene un _id individual para cada consulta.
    _id: true,

    // Mongoose agrega automáticamente:
    // - createdAt
    // - updatedAt
    // cada vez que se crea o actualiza la consulta.
    timestamps: true,
  }
);

// =========================================================
// Schema principal de la mascota
// =========================================================
const PetSchema = new mongoose.Schema(
  {
    // Datos básicos de la mascota.
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    color: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    chipNumber: {
      type: String,
      trim: true,
    },

    // Datos del tutor o dueño.
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerContact: {
      type: String,
      required: true,
      trim: true,
    },
    rut: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // Historial médico general de la mascota.
    medicalHistory: {
      type: String,
      trim: true,
    },

    // Fecha manual de registro visible para negocio o administración.
    // No reemplaza a createdAt.
    registrationDate: {
      type: String,
      trim: true,
    },

    // Arreglo de consultas médicas embebidas.
    consultations: [ConsultationSchema],

    // Usuario que creó la mascota.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Usuario que hizo la última modificación de la mascota.
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    // Mongoose agrega automáticamente:
    // - createdAt
    // - updatedAt
    // al documento principal de la mascota.
    timestamps: true,
  }
);

// =========================================================
// Índices opcionales
// =========================================================
// Estos ayudan a búsquedas comunes y pueden alinearse
// con los índices que creas en server.js.
PetSchema.index({ name: 1 });
PetSchema.index({ ownerName: 1 });
PetSchema.index({ chipNumber: 1 }, { unique: true, sparse: true });
PetSchema.index({ rut: 1 }, { unique: true, sparse: true });

// Exportamos el modelo "Pet" para usarlo en rutas y controladores.
module.exports = mongoose.model('Pet', PetSchema);