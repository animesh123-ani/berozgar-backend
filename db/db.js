const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const url = process.env.MONGOURL;

const connectToDb = (callback) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Connected to MongoDB Atlas");
      callback(true);
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB Atlas:", err.message);
      callback(false);
    });
};

module.exports = connectToDb;
