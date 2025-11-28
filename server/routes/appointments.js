const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

// Create appointment
/*router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const appointment = new Appointment({ ...req.body, userId });
    await appointment.save();
    res.status(201).json({ message: "Appointment saved", appointment });
  } catch (error) {
    console.error("Error saving appointment:", error);
    res.status(500).json({ error: "Server error" });
  }
});*/

router.post("/book", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verify failed:", err);
      return res.status(401).json({ error: "Invalid token" });
    }

    // support both shapes: { id } or { user: { id } }
    const userId = decoded.id || (decoded.user && decoded.user.id);
    if (!userId) {
      console.error("Decoded token has no user id:", decoded);
      return res.status(401).json({ error: "Invalid token payload" });
    }

    const appointment = await Appointment.create({ ...req.body, userId });

    /*await Notification.create({
      userId,
      title: "Appointment Booked",
      message: `Your appointment with Dr. ${req.body.doctorName} is confirmed`
    });*/

    return res.json({ success: true, appointment });
  } catch (err) {
    console.error("Booking failed (unexpected):", err);
    return res.status(500).json({ error: "Booking failed" });
  }
});

router.get("/my", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const appointments = await Appointment.find({ userId }).sort({ appointmentDate: 1 });
    res.json(appointments); // <-- MUST return JSON
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/cancel/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const appointment = await Appointment.findOne({ _id: req.params.id, userId });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    await appointment.remove();
    await Notification.deleteOne({
      userId,
      message: { $regex: appointment.doctorName, $options: "i" }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
