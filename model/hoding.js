const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hours in seconds
  },
});

const HodMessage = mongoose.model("hod", hodSchema);

module.exports = HodMessage;
