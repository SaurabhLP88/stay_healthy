const express = require("express");
const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");
const router = express.Router();

// Helper to extract userId from JWT
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error("No token provided");
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.user.id; // adjust if your payload structure differs
};

// CREATE NOTIFICATION
router.post("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "title and message required" });
    }

    const notify = await Notification.create({
      userId,
      title,
      message,
      isRead: false,
      createdAt: new Date()
    });

    res.json({ success: true, notify });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CLEAR ALL NOTIFICATIONS
router.post("/clear", async (_, res) => {
  try {
    await Notification.deleteMany({});
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to clear notifications" });
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

// GET LATEST NOTIFICATION (optional)
router.get("/latest", async (req, res) => {
  try {
    const latest = await Notification.findOne().sort({ createdAt: -1 });
    return res.json({ notification: latest || null });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch notification" });
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
