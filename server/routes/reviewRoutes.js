const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Review = require("../models/Reviews");
const Appointment = require("../models/Appointment");

router.post("/", async (req, res) => {
  try {
    const { appointmentId, doctorId, userId, title, description, rating } = req.body;

    // Validate appointment exists
    const appt = await Appointment.findById(appointmentId);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Ensure review not already submitted
    const existing = await Review.findOne({ appointmentId });
    if (existing) {
      return res.status(400).json({ message: "Review already submitted for this appointment" });
    }

    // Create review
    const review = await Review.create({
      appointmentId,
      doctorId,
      userId,
      title,
      description,
      rating
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review
    });

  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/public", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("doctorId", "name speciality")
      .sort({ createdAt: -1 });

    const formatted = reviews.map(r => ({
      id: r._id,
      doctorId: r.doctorId?._id,
      appointmentId: r.appointmentId,
      userId: r.userId,
      doctorName: r.doctorId?.name,
      speciality: r.doctorId?.speciality,
      rating: r.rating,
      title: r.title,
      review: r.description,
    }));

    res.json({ success: true, reviews: formatted });
  } catch (error) {
    console.error("Error fetching public reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/my", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.user?.id;

    //const Review = require("../models/Reviews");

    const reviews = await Review.find({ userId })
      .populate("doctorId", "name speciality image")
      .sort({ createdAt: -1 });

    const formatted = reviews.map(r => ({
      id: r._id,
      doctorId: r.doctorId?._id,
      appointmentId: r.appointmentId,
      userId: r.userId,
      doctorName: r.doctorId?.name,
      speciality: r.doctorId?.speciality,
      rating: r.rating,
      title: r.title,
      review: r.description,
    }));

    //res.json(formatted);
    res.json({
      success: true,
      reviews: formatted 
    });


  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .populate("doctorId", "name speciality")
      .populate("appointmentId");

    res.json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.doctorId })
      .populate("userId", "name")
      .populate("appointmentId");

    res.json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
