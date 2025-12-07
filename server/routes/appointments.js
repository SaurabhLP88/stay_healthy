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
      .populate("doctorId", "name speciality image");

    console.log("\n================ RAW APPOINTMENTS FROM DB ================");
    appointments.forEach((a, i) => {
      console.log(
        `${i + 1}. ${a.appointmentDate} | ${a.appointmentTime} | ${a.status}`
      );
    });

    appointments = appointments.map((appt, index) => {
      const [startTime] = appt.appointmentTime.split(" - ");

      let day, month, year;

      // detect yyyy-mm-dd
      if (appt.appointmentDate.includes("-")) {
        [year, month, day] = appt.appointmentDate.split("-");
      }
      // detect dd/mm/yyyy
      else if (appt.appointmentDate.includes("/")) {
        [day, month, year] = appt.appointmentDate.split("/");
      }

      const [time, ampm] = startTime.split(" ");
      let [hr, min] = time.split(":").map(Number);

      if (ampm === "PM" && hr !== 12) hr += 12;
      if (ampm === "AM" && hr === 12) hr = 0;

      const sortKey = new Date(year, month - 1, day, hr, min);

      console.log(
        `→ FIXED SORTKEY (${index + 1}): ${appt.appointmentDate} ${startTime} ==>`,
        sortKey
      );

      return {
        ...appt.toObject(),
        sortKey
      };
    });

    console.log("\n================ BEFORE SORT ================");
    appointments.forEach((a, i) => {
      console.log(
        `${i + 1}. ${a.appointmentDate} ${a.appointmentTime} | sortKey: ${a.sortKey}`
      );
    });

    appointments.sort((a, b) => {
      // First sort by date descending (latest date first)
      if (b.sortKey.toDateString() !== a.sortKey.toDateString()) {
        return b.sortKey - a.sortKey; // descending date
      }
      // If same date, sort by time ascending
      return a.sortKey - b.sortKey; // ascending time
    });

    console.log("\n================ AFTER SORT ================");
    appointments.forEach((a, i) => {
      console.log(
        `${i + 1}. ${a.appointmentDate} ${a.appointmentTime} | sortKey: ${a.sortKey}`
      );
    });

    const Review = require("../models/Reviews");
    const updated = await Promise.all(
      appointments.map(async (appt) => {
        const review = await Review.findOne({ appointmentId: appt._id });

        return {
          ...appt,
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
