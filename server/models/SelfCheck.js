const mongoose = require("mongoose");

const SelfCheckSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String
});

module.exports = mongoose.model("SelfCheck", SelfCheckSchema);