const express = require("express");
const router = express.Router();

//const UserModel = require("../models/User");
const DoctorModel = require("../models/Doctor");
const AppointmentModel = require("../models/Appointment");
//const fetch = require("node-fetch");

// Import doctors from npoint API → MongoDB
/*router.get("/import", async (req, res) => {
  try {
    const response = await fetch("https://api.npoint.io/9a5543d36f1460da2f63");
    const data = await response.json();

    await Doctor.deleteMany();  // optional: clear old
    await Doctor.insertMany(data);

    res.json({ message: "Doctors imported successfully!", count: data.length });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to import" });
  }
});*/

// Get doctors from MongoDB
router.get("/", async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    const updatedDoctors = doctors.map(doc => ({
      ...doc._doc,
      rating: doc.ratings ? doc.ratings.length : 0
    }));
    res.json(updatedDoctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Doctor Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const doctorId = req.query.doctorId;

    console.log("doctorId received:", doctorId);
    if (!doctorId) {
      console.log("❌ doctorId missing in request");
      return res.status(400).json({ error: "doctorId is required" });
    }

    const doctor = await DoctorModel.findById(doctorId);
    console.log("🔥 Doctor found:", doctor);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count today's appointments
    const todayCount = await AppointmentModel.countDocuments({
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    });
    console.log("📊 Today Appointments Count:", todayCount);

    // Pending (not completed)
    const pendingCount = await AppointmentModel.countDocuments({
      doctorId,
      status: "Pending"
    });
    console.log("🟡 Pending Appointments:", pendingCount);

    // Completed
    const completedCount = await AppointmentModel.countDocuments({
      doctorId,
      status: "Completed"
    });
    console.log("🟢 Completed Appointments:", completedCount);

    console.log("⏭ Next Appointment Raw:", doctorId);

    // Next upcoming appointment
    const nextAppt = await AppointmentModel.findOne({
      doctorId,
      date: { $gte: new Date() }
    })
      .sort({ date: 1 })
      .populate("userId", "name");

    console.log("⏭ Next Appointment Raw:", nextAppt);

    const nextData = nextAppt
      ? {
          time: nextAppt.time,
          patient: nextAppt.userId?.name || "Unknown"
        }
      : null;

    console.log("⏭ Next Appointment Processed:", nextData);

    const finalResponse = {
      today: todayCount,
      pending: pendingCount,
      completed: completedCount,
      next: nextData
    };

    console.log("📤 Sending Dashboard Data:", finalResponse);

    res.json(finalResponse);
  } catch (err) {
    console.error("🔥 Dashboard Stats Error:", err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

// Update Doctor Profile
router.put("/update", async (req, res) => {
    try {
        const email = req.headers.email; // doctor email from headers
        console.log("📨 Received Email from header:", email);
        if (!email) {
            console.log("❌ Error: Email missing in request header");
            return res.status(400).json({ error: "Email not provided" });
        }
        console.log("📝 Update Request Body:", req.body);
        const existingDoctor = await DoctorModel.findOne({ email });
        console.log("🔍 Doctor before update:", existingDoctor);
        if (!existingDoctor) {
            console.log("❌ No doctor found with email:", email);
            return res.status(404).json({ error: "Doctor not found" });
        }

        ["name", "phone", "speciality", "experience"].forEach(field => {
            if (req.body[field]) {
                console.log(`Updating ${field}:`, req.body[field]);
                existingDoctor[field] = req.body[field];
            }
        });

        // Password change
        if (req.body.password?.trim()) {
            console.log("Updating password");
            const bcrypt = require("bcryptjs");
            existingDoctor.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        }

        existingDoctor.updatedAt = new Date();
        await existingDoctor.save();

        res.json({
            success: true,
            message: "Doctor profile updated successfully"
        });

    } catch (error) {
        console.error("Doctor Update Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/profile", async (req, res) => {
    try {
        const email = req.headers.email;
        console.log("📨 Received Email from header:", email);
        if (!email) {
            console.log("❌ Error: Email missing in request header");
            return res.status(400).json({ error: "Email missing in header" });
        }

        const doctor = await DoctorModel.findOne({ email });
        console.log("🔍 Doctor Query Result:", doctor);

        if (!doctor) {
            console.log("❌ No doctor found with email:", email);
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorDetails = {
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            speciality: doctor.speciality,
            experience: doctor.experience,
            rating: doctor.ratings ? doctor.ratings.length : 0
        };
        console.log("✅ Sending doctor profile response", doctorDetails);
        res.json(doctorDetails);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
