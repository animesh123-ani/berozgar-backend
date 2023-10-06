const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: { type: String, unique: true },
  profileImage: {
    type: String,
  },
  password: String,
  role: {
    type: String,
    default: "USER",
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
