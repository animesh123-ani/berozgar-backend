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
  userName: {
    type: String,
    default: null,
  },
  Year: {
    type: Number,
    default: null,
  },
  collegeName: {
    type: String,
    default: null,
  },
  homeTown: {
    type: String,
    default: null,
  },
  pinCode: {
    type: Number,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
