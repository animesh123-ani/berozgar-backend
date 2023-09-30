const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEmail: { type: String, unique: true },
  profileImage: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/memogram-926ed.appspot.com/o/files%2Faccount_circle_FILL0_wght400_GRAD0_opsz24%20(1).svg?alt=media&token=91004aec-c359-45cd-8f88-e74b146b942e",
  },
  password: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
