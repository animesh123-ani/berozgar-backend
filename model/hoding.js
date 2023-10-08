const mongoose = require("mongoose");

const hodSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const HodMessage = mongoose.model("hod", hodSchema);

module.exports = HodMessage;
