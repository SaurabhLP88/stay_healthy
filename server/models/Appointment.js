const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorName: String,
  doctorSpeciality: String,
  patientName: String,
  phoneNumber: String,
  appointmentDate: String,
  appointmentTime: String,
  status: {
    type: String,
    enum: ["booked", "completed", "cancelled"],
    default: "booked"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
