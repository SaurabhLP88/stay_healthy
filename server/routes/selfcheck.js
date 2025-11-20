const express = require("express");
const router = express.Router();
const SelfCheck = require("../models/SelfCheck");

router.get("/", async (req, res) => {
  const data = await SelfCheck.find();
  res.json(data);
});

module.exports = router;