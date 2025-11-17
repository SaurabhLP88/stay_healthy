const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  speciality: String,
  experience: String,
  ratings: Number,
  image: String
});

module.exports = mongoose.model("Doctor", doctorSchema);