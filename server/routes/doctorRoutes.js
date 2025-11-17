const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
//const fetch = require("node-fetch");

// Import doctors from npoint API → MongoDB
router.get("/import", async (req, res) => {
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
});

// Get doctors from MongoDB
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    const updatedDoctors = doctors.map(doc => ({
      ...doc._doc,
      rating: doc.ratings ? doc.ratings.length : 0
    }));
    res.json(updatedDoctors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

module.exports = router;
