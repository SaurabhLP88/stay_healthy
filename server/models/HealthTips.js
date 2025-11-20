const mongoose = require("mongoose");

const HealthTipsSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String
});

module.exports = mongoose.model("HealthTips", HealthTipsSchema);