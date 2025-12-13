const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
//const Doctor = require("../models/Doctor");

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
      status: bookingType === "instant" ? "pending" : "booked"
    });

    return res.json({ success: true, appointment });
  } catch (err) {
    console.error("Booking failed (unexpected):", err);
    return res.status(500).json({ error: "Booking failed" });
  }
});

async function normalizeAppointmentStatus(appt) {
  const timeParts = appt.appointmentTime.split(" - ");
  const startTime = timeParts[0];
  const endTime = timeParts[1] || timeParts[0];

  console.log(
    `⏱️ Time parsed | ${appt._id} | start=${startTime} | end=${endTime}`
  );

  const start = convertToDate(appt.appointmentDate, startTime);
  const end = convertToDate(appt.appointmentDate, endTime);
  const now = new Date();

  let newStatus = appt.status;

  // 🔒 FINAL STATES — do NOT auto-change
  if (["completed", "cancelled"].includes(appt.status)) {
    console.log(`🔐 Final status preserved for ${appt._id}: ${appt.status}`);
    return appt;
  }

  // 🕒 Time-based transitions ONLY for active bookings
  if (appt.bookingType === "instant" && appt.status === "pending") {
    if (now > end) {
      newStatus = "expired";
    } else {
      return appt; // ⛔ do not downgrade to booked
    }
  }
  else if (now >= start && now <= end) {
    newStatus = "pending";
  } 
  else if (now > end) {
    newStatus = "expired";
  }

  console.log(
    `🧠 STATUS CHECK | Appt: ${appt._id}\n` +
    `   Date: ${appt.appointmentDate}\n` +
    `   Time: ${appt.appointmentTime}\n` +
    `   Now:  ${now.toISOString()}\n` +
    `   Start:${start.toISOString()}\n` +
    `   End:  ${end.toISOString()}\n` +
    `   Old Status: ${appt.status}\n` +
    `   New Status: ${newStatus}`
  );

  // ✅ Persist ONLY if changed
  if (newStatus !== appt.status) {
    appt.status = newStatus;
    await appt.save();
    console.log(`💾 DB UPDATED → ${appt._id} | status = ${newStatus}`);
  } else {
    console.log(`⏭️ No DB update needed for ${appt._id}`);
  }

  return appt;
}


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

    appointments = await Promise.all(
      appointments.map(async (appt, index) => {
        await normalizeAppointmentStatus(appt);

        const startTime = appt.appointmentTime.split(" - ")[0];
        const sortKey = convertToDate(appt.appointmentDate, startTime);

        console.log(
          `→ FIXED SORTKEY (${index + 1}): ${appt.appointmentDate} ${startTime} ==>`,
          sortKey
        );

        return {
          ...appt.toObject(),
          sortKey
        };
      })
    );

    /*appointments = appointments.map((appt, index) => {
      const [startTime, endTime] = appt.appointmentTime.split(" - ");

      let day, month, year;

      // detect yyyy-mm-dd
      if (appt.appointmentDate.includes("-")) {
        [year, month, day] = appt.appointmentDate.split("-");
      }
      // detect dd/mm/yyyy
      else if (appt.appointmentDate.includes("/")) {
        [day, month, year] = appt.appointmentDate.split("/");
      }

      // Convert time string such as "10:30 AM" → 24hr Date object
      function toDateObj(date, timeStr) {
        let [time, ampm] = timeStr.trim().split(" ");
        let [hr, min] = time.split(":").map(Number);

        if (ampm === "PM" && hr !== 12) hr += 12;
        if (ampm === "AM" && hr === 12) hr = 0;

        return new Date(date.year, date.month, date.day, hr, min);
      }

      const dateParts = {
        year: Number(year),
        month: Number(month) - 1,
        day: Number(day),
      };

      // Create actual DateTime objects
      const startDateTime = toDateObj(dateParts, startTime);
      const endDateTime = toDateObj(dateParts, endTime);
      const now = new Date();

      // Sort key remains the same
      let status = appt.status;

      // ✅ Mark expired ONLY if still booked
      if (status === "booked" && now > endDateTime) {
        status = "expired";
      }

      // Sort key remains the same
      const sortKey = startDateTime;

      console.log(
        `→ FIXED SORTKEY (${index + 1}): ${appt.appointmentDate} ${startTime} - ${endTime} ==>`,
        sortKey
      );

      return {
        ...appt.toObject(),
        status,
        sortKey
      };
    });*/

    console.log("\n================ BEFORE SORT ================");
    appointments.forEach((a, i) => {
      console.log(
        `${i + 1}. ${a.appointmentDate} ${a.appointmentTime} | sortKey: ${a.sortKey}`
      );
    });

    appointments.sort((a, b) => b.sortKey - a.sortKey);

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

// Get appointments for a doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log("➡️ doctorId received from params:", doctorId);

    if (!doctorId) {
      console.log("❌ ERROR: doctorId missing in request params");
      return res.status(400).json({ error: "doctorId is required" });
    }

    // Fetch appointments for this doctor
    let appointments = await Appointment.find({ doctorId })
      .populate("userId", "name phone")
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    console.log("➡️ Raw appointments from DB:", appointments.length);
    appointments.forEach((a, i) => {
      console.log(
        `   ${i + 1}. Date: ${a.appointmentDate}, Time: ${a.appointmentTime}, Status: ${a.status}`
      );
    });
    const now = new Date();

    // Auto-update expired/pending status (same logic as /my)
    appointments = await Promise.all(
      appointments.map(async (appt, index) => {
        await normalizeAppointmentStatus(appt);
        return appt;
      })
    );
    
    /*appointments = appointments.map((appt, index) => {
      const [startTime] = appt.appointmentTime.split(" - ");
      console.log(
        `\n⏱️ Processing Appointment #${index + 1}:`,
        `Date: ${appt.appointmentDate}, StartTime: ${startTime}`
      );
      const start = convertToDate(appt.appointmentDate, startTime);

      if (start < now && appt.status === "booked") {
        console.log("🔄 Status updated: booked → expired");
        appt.status = "expired";
      } else {
        console.log("✔ Status unchanged:", appt.status);
      }

      return appt;
    });*/

    appointments.sort((a, b) => {
      // Convert appointment a
      const startA = a.appointmentTime.split(" - ")[0];
      const dateA = convertToDate(a.appointmentDate, startA);

      // Convert appointment b
      const startB = b.appointmentTime.split(" - ")[0];
      const dateB = convertToDate(b.appointmentDate, startB);

      console.log(
        `\n🔽 Comparing:\n A => ${a.appointmentDate} ${startA}\n B => ${b.appointmentDate} ${startB}`
      );
      console.log("   Converted A:", dateA);
      console.log("   Converted B:", dateB);

      // 1️⃣ Sort by date descending (newest date on top)
      if (dateA.toDateString() !== dateB.toDateString()) {
        //return dateB - dateA; // newer date first
      }

      // 2️⃣ If same date → sort time ascending
      return dateB - dateA;
    });
    res.json(appointments);

  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
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

    appointment.status = "cancelled";
    await appointment.save();

    //await appointment.remove();
    await Notification.deleteOne({
      userId,
      message: { $regex: appointment.doctorName, $options: "i" }
    });
    res.json({ success: true, message: "Appointment cancelled" });
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

router.put("/complete/:id", async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    if (["cancelled", "expired"].includes(appt.status)) {
      return res.status(400).json({ error: "Cannot complete cancelled/expired appointment" });
    }

    appt.status = "completed";
    await appt.save();

    res.json({ success: true, message: "Appointment completed" });
  } catch (err) {
    console.error("Complete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Helper to convert date + time to Date()
function convertToDate(dateStr, timeStr) {
  let day, month, year;

  if (dateStr.includes("-")) {
    [year, month, day] = dateStr.split("-");
  } else {
    [day, month, year] = dateStr.split("/");
  }

  const [time, ampm] = timeStr.split(" ");
  let [h, m] = time.split(":").map(Number);

  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;

  return new Date(year, month - 1, day, h, m);
}

module.exports = router;
