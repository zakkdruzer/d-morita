const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  fecha: String,
  anamnesis: String,
  examenFisico: String,
  preDiagnostico: String,
  observaciones: String,
  tratamientos: String,
  recomendacion: String,
}, { _id: true });

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: String,
  age: Number,
  color: String,
  gender: String,
  chipNumber: String,
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  rut: String,
  email: String,
  address: String,
  medicalHistory: String,
  registrationDate: String,
  consultations: [ConsultationSchema]
});

module.exports = mongoose.model('Pet', PetSchema);