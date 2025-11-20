const express = require("express");
const router = express.Router();

const HealthBlog = require("../models/HealthBlog");

router.get("/", async (req, res) => {
  const data = await HealthBlog.find();
  res.json(data);
});

module.exports = router;
