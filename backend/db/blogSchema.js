const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true // logged-in user ka email
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel" // reference user model
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("blogModel", blogSchema, "blogsDatas");
