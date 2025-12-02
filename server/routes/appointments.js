const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const Doctor = require("../models/Doctor");

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

    //const appointment = await Appointment.create({ ...req.body, userId });
    const bookingType = req.body.bookingType || "scheduled";
    //const doctor = await Doctor.findOne({ name: req.body.doctorName });

    const appointment = await Appointment.create({
      ...req.body,
      doctorId: req.body.doctorId,
      //doctorId: doctor ? doctor._id : null,
      userId,
      bookingType,
      status: bookingType === "instant" ? "booked" : "booked"
    });

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
    const userId = decoded.id || decoded.user?.id;
    if (!userId) return res.status(401).json({ error: "Invalid token payload" });

    let appointments = await Appointment.find({ userId })
      .populate("doctorId", "name speciality image")
      .sort({ appointmentDate: 1 });

    appointments = await Promise.all(
      appointments.map(async (appt) => {
        const [startTime] = appt.appointmentTime.split(" - ");

        const apptDateTime = new Date(
          `${appt.appointmentDate} ${startTime}`
        );

        if (
          appt.bookingType !== "instant" &&
          appt.status === "booked" &&
          apptDateTime < new Date()
        ) {
          appt.status = "expired";
          await appt.save();
        }

        return appt;
      })
    );

    const Review = require("../models/Reviews");
    const updated = await Promise.all(
      appointments.map(async (appt) => {
        const review = await Review.findOne({ appointmentId: appt._id });

        return {
          ...appt.toObject(),
          doctorId: appt.doctorId?._id || null,
          hasReview: !!review 
        };
      })
    );

    res.json(updated);

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

router.put("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    appt.status = "cancelled";
    await appt.save();

    res.json({ success: true, message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
