const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Review = require("../models/Reviews");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

router.post("/", async (req, res) => {
  try {
    let { appointmentId, doctorId, userId, title, description, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointmentId" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    appointmentId = new mongoose.Types.ObjectId(appointmentId);
    doctorId = new mongoose.Types.ObjectId(doctorId);
    userId = new mongoose.Types.ObjectId(userId);

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
    console.log("[Reviews] Incoming Request: GET /reviews/public");

    console.log("[Reviews] Fetching ALL public reviews...");
    const reviews = await Review.find()
      .populate("doctorId", "name speciality")
      .sort({ createdAt: -1 });

    console.log(`[Reviews] Total Public Reviews Found: ${reviews.length}`);

    const formatted = reviews.map((r, index) => {
      console.log(`[Reviews] Formatting Review #${index + 1}`);
      console.log("[Reviews] Doctor:", r.doctorId?.name || "N/A");
      console.log("[Reviews] Speciality:", r.doctorId?.speciality || "N/A");
      console.log("[Reviews] Rating:", r.rating);
      console.log("[Reviews] Title:", r.title);

      return {
        id: r._id,
        doctorId: r.doctorId?._id,
        appointmentId: r.appointmentId,
        userId: r.userId,
        doctorName: r.doctorId?.name,
        speciality: r.doctorId?.speciality,
        rating: r.rating,
        title: r.title,
        review: r.description,
        createdAt: r.createdAt
      };
    });

    console.log("[Reviews] Sending public reviews response...");

    res.json({ success: true, reviews: formatted });

  } catch (error) {
    console.error("[Reviews] Error fetching public reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/my", async (req, res) => {
  try {
    console.log("[Reviews] Incoming Request: GET /reviews/my");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("[Reviews] Failed: No token provided");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.user?.id;

    console.log("[Reviews] Fetching reviews for this user...");
    const reviews = await Review.find({ userId })
      .populate("doctorId", "name speciality image")
      .sort({ createdAt: -1 });

    console.log(`📊 Total Reviews Found: ${reviews.length}`);

    const formatted = reviews.map((r, index) => {
      console.log(`[Reviews] Formatting Review #${index + 1}`);
      console.log("[Reviews] Doctor Name:", r.doctorId?.name);
      console.log("[Reviews] Speciality:", r.doctorId?.speciality);
      console.log("[Reviews] Rating:", r.rating);
      console.log("[Reviews] Title:", r.title);

      return {
        id: r._id,
        doctorId: r.doctorId?._id,
        appointmentId: r.appointmentId,
        userId: r.userId,
        doctorName: r.doctorId?.name,
        speciality: r.doctorId?.speciality,
        rating: r.rating,
        title: r.title,
        review: r.description,
        createdAt: r.createdAt
      };
    });

    console.log("[Reviews] Sending formatted user reviews...");

    res.json({
      success: true,
      reviews: formatted
    });

  } catch (err) {
    console.error("[Reviews] Error fetching user reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/patient/:userId", async (req, res) => {
  try {
    console.log("[Reviews] Incoming Request: GET /reviews/patient/:userId");
    console.log("[Reviews] Requested Patient/User ID:", req.params.userId);

    const userId = req.params.userId;

    console.log("[Reviews] Fetching patient reviews from DB...");
    const reviews = await Review.find({ userId })
      .populate("doctorId", "name speciality");

    console.log(`[Reviews] Reviews found for patient: ${reviews.length}`);

    const formatted = reviews.map((r, index) => {
      console.log(`[Reviews] Formatting Review #${index + 1}`);
      console.log("[Reviews] Doctor Name:", r.doctorId?.name);
      console.log("[Reviews] Speciality:", r.doctorId?.speciality);
      console.log("[Reviews] Rating:", r.rating);
      console.log("[Reviews] Title:", r.title);

      return {
        id: r._id,
        doctorName: r.doctorId?.name,
        speciality: r.doctorId?.speciality,
        rating: r.rating,
        title: r.title,
        review: r.description,
        createdAt: r.createdAt
      };
    });

    console.log("[Reviews] Sending formatted patient reviews...");

    res.json({ reviews: formatted });

  } catch (error) {
    console.error("[Reviews] Error in /reviews/patient/:userId:", error);
    res.status(500).json(error);
  }
});

router.get("/doctor/:doctorId", async (req, res) => {
  try {
    console.log("[Reviews] Incoming Request: GET /reviews/doctor/:doctorId");
    console.log("[Reviews] Requested Doctor ID:", req.params.doctorId);

    if (!mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
      console.log("[Reviews] Invalid Doctor ID format");
      return res.status(400).json({ error: "Invalid doctorId" });
    }
    const doctorId = new mongoose.Types.ObjectId(req.params.doctorId);

    // Fetch reviews
    console.log("[Reviews] Fetching reviews from DB...");
    const reviews = await Review.find({ doctorId })
      .populate("userId", "name phone");

    console.log(`[Reviews] Reviews found: ${reviews.length}`);

    const formatted = reviews.map((r, index) => {
      console.log(`[Reviews] Formatting Review #${index + 1}`);
      console.log("[Reviews] Patient Name:", r.userId?.name);
      console.log("[Reviews] Rating:", r.rating);
      console.log("[Reviews] Title:", r.title);

      return {
        id: r._id,
        patientName: r.userId?.name,
        phone: r.userId?.phone,
        rating: r.rating,
        title: r.title,
        review: r.description,
        createdAt: r.createdAt
      };
    });

    console.log("[Reviews] Sending formatted reviews...");

    res.json({ reviews: formatted });

  } catch (error) {
    console.error("[Reviews] Error in /reviews/doctor/:doctorId:", error);
    res.status(500).json(error);
  }
});


module.exports = router;
