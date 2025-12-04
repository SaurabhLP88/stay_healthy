const express = require("express");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
const Appointment = require("../models/Appointment");
const router = express.Router();

// Helper to extract userId from JWT
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.user.id; // adjust if your payload structure differs
};

function toDateTime(dateStr, timeRange) {
  const [start] = timeRange.split(" - ");
  const dateParts = dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/");
  
  // Convert to YYYY,MM,DD
  let year, month, day;
  if(dateStr.includes("-")){
    [year, month, day] = dateParts;
  } else {
    [month, day, year] = dateParts;
  }

  const [time, modifier] = start.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return new Date(`${year}-${month}-${day}T${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:00`);
}

// CREATE NOTIFICATION
router.post("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { title, message, appointmentId } = req.body;

    console.log("[create] Decoded User ID:", userId);
    console.log("[create] Request Body Received:", req.body);

    if (!title || !message) {
      console.log("[create] Missing title or message");
      return res.status(400).json({ error: "title and message required" });
    }

    if (!appointmentId) {
      console.log("[create] Missing appointmentId");
    }

    const notify = await Notification.create({
      userId,
      title,
      message,
      //isRead: false,
      appointmentId,
      createdAt: new Date()
    });

    console.log("[create] Notification created successfully:", notify);

    res.json({ success: true, notify });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CLEAR ALL NOTIFICATIONS
/*router.post("/clear", async (_, res) => {
  try {
    await Notification.deleteMany({});
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to clear notifications" });
  }
});*/

// GET LATEST NOTIFICATION (optional)
router.get("/latest", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    console.log("[/latest] userId:", userId);

    // 1️⃣ Find all booked, future appointments
    //const now = new Date();

    const appointments = await Appointment.find({
      userId,
      status: "booked"
    });

    const upcoming = appointments
      .map(appt => ({
        ...appt._doc,
        dateTime: toDateTime(appt.appointmentDate, appt.appointmentTime)
      }))
      .filter(appt => appt.dateTime >= new Date())
      .sort((a, b) => a.dateTime - b.dateTime); // earliest first

    console.log("[/latest] Upcoming booked appointments:", upcoming);
    
    if (!upcoming || upcoming.length === 0) {
      console.log("[/latest] No upcoming booked appointment found");
      return res.json(null);
    }

    const nextAppointment = upcoming[0];
    console.log("[/latest] Nearest upcoming appointment:", nextAppointment);
    
    const notify = await Notification.findOne({
      userId,
      appointmentId: nextAppointment._id
    }).sort({ createdAt: -1 });

    console.log("[/latest] Found related notification:", notify);

    if (!notify) {
      console.log("[/latest] No notification for this appointment");
      return res.json(null);
    }

    res.json({
      ...notify._doc,
      appointmentStatus: nextAppointment.status,
      appointmentId: nextAppointment._id
    });

  } catch (err) {
    console.error("Error loading latest notification:", err);
    res.status(500).json({ error: "Could not load notifications" });
  }
});


/*
// GET ALL NOTIFICATIONS FOR LOGGED-IN USER
router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
});



// GET UNREAD NOTIFICATIONS FOR LOGGED-IN USER
router.get("/unread", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const notifications = await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching unread notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// MARK ONE NOTIFICATION AS READ
router.patch("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// MARK ALL NOTIFICATIONS AS READ FOR LOGGED-IN USER
router.patch("/read-all", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});
*/

module.exports = router;
