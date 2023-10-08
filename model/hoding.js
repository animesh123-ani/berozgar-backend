const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 21600,
  },
});

const HodMessage = mongoose.model("hod", hodSchema);

module.exports = HodMessage;
