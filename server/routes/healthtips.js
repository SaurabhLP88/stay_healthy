const express = require("express");
const router = express.Router();
const HealthTips = require("../models/HealthTips");

router.get("/", async (req, res) => {
  const data = await HealthTips.find();
  res.json(data);
});

module.exports = router;