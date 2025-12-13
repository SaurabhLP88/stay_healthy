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
    console.log("📌 /stats called with doctorId:", doctorId);
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctorId) {
      console.log("❌ No doctorId provided");
      return res.status(400).json({ error: "doctorId is required" });
    }    

    // Fetch all appointments
    const appointments = await AppointmentModel.find({ doctorId })
      .populate("userId", "name phone");

    console.log("📌 Total appointments found:", appointments.length);
    console.log("📌 Raw appointments list:", appointments);

    const todayStr = new Date().toISOString().split("T")[0];
    console.log("📌 Today's date (YYYY-MM-DD) =", todayStr);

    // Calculate today, pending, completed
    const todayAppointments = appointments.filter(a =>
      (
        // Scheduled → match today
        a.bookingType === "scheduled" &&
        a.appointmentDate === todayStr &&
        !["expired", "cancelled"].includes(a.status)
      ) ||
      (
        // Instant → always today if active
        a.bookingType === "instant" &&
        ["booked", "pending"].includes(a.status)
      )
    );
    const pendingAppointments = appointments.filter(a => a.status === "pending");
    const completedAppointments = appointments.filter(a => a.status === "completed");
    const cancelledAppointments = appointments.filter(
      a => a.status === "cancelled"
    );
    const totalInstantAppointments = appointments.filter(a =>
      a.bookingType === "instant" &&
      ["booked", "pending", "completed"].includes(a.status)
    );
    const totalScheduledAppointments = appointments.filter(a =>
      a.bookingType === "scheduled" &&
      ["booked", "pending", "completed"].includes(a.status)
    );

    console.log("👉 Today count:", todayAppointments.length);
    console.log("👉 Pending count:", pendingAppointments.length);
    console.log("👉 Completed count:", completedAppointments.length);
    console.log("👉 Cancelled count:", cancelledAppointments.length);

    // Next appointment logic
    const upcoming = appointments
      .filter(a =>
        ["booked", "pending"].includes(a.status)
      )
      .filter(a => {
        if (a.bookingType === "instant") return true;
        const timeParts = a.appointmentTime.split(" - ");
        const startTime = timeParts[0];
        const apptDateTime = new Date(`${a.appointmentDate} ${startTime}`);
        //if (a.bookingType === "instant") return true;
        return apptDateTime > new Date();
      })
      .sort((a, b) => {
        const timeA = a.appointmentTime.split(" - ")[0];
        const timeB = b.appointmentTime.split(" - ")[0];
        return new Date(`${a.appointmentDate} ${timeA}`) - new Date(`${b.appointmentDate} ${timeB}`);
      });

    console.log("📌 Upcoming appointments sorted:", upcoming);

    let nextAppointment = null;
    if (upcoming.length > 0) {
      const appt = upcoming[0];
      console.log("⏭ Next Appointment Found:", appt);

      nextAppointment = {
        date: appt.appointmentDate,
        time: appt.appointmentTime,
        patient: appt.userId?.name || "Unknown",
        phone: appt.userId?.phone || "",
        bookingType: appt.bookingType
      };
    } else {
      console.log("⏭ No next appointment found");
    }

    const response = {
      doctor: {
        name: doctor.name,
        image: doctor.image,
        speciality: doctor.speciality,
        phone: doctor.phone,
        experience: doctor.experience,
        email: doctor.email,
      },
      today: todayAppointments.length,
      pending: pendingAppointments.length,
      completed: completedAppointments.length,
      cancelled: cancelledAppointments.length,
      totalInstantAppointments: totalInstantAppointments.length,
      totalScheduledAppointments: totalScheduledAppointments.length,

      next: nextAppointment,
    };

    console.log("📤 Final stats response:", response);

    res.json(response);

  } catch (err) {
    console.error("❌ Error in /stats route:", err);
    res.status(500).json({ error: "Server error" });
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
