const mongoose = require("mongoose");

const HealthBlogSchema = new mongoose.Schema({
  category: String,
  title: String,
  description: String,
  thumbnail: String,
  videofile: String
});

module.exports = mongoose.model("HealthBlog", HealthBlogSchema, "healthblog");
