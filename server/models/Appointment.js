const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  doctorName: String,
  doctorSpeciality: String,
  patientName: String,
  phoneNumber: String,
  appointmentDate: String,
  appointmentTime: String,
  bookingType: {
    type: String,
    enum: ["instant", "scheduled"],
    default: "scheduled",
  },
  status: {
    type: String,
    enum: ["booked", "completed", "cancelled", "expired", "pending"],
    default: "booked"
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
