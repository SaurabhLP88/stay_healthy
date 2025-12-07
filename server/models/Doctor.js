const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  speciality: { type: String, required: true },
  experience: { type: Number, default: 0 },

  rating: { type: Number, default: 0 },
  image: { type: String, default: "doctor1.png" },

  role: { type: String, default: "Doctor" },
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model("Doctor", doctorSchema);