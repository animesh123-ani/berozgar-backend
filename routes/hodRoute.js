const express = require("express");
const Router = express.Router();
const HodMessage = require("../model/hoding");

// Error handling middleware
function errorHandler(err, res) {
  console.error(err);
  res.status(500).json({ message: "Something went wrong in the server" });
}

// For reading messages
Router.get("/hodmessages", async (req, res) => {
  try {
    const messages = await HodMessage.find({});
    res.json(messages);
  } catch (err) {
    errorHandler(err, res);
  }
});

// For creating messages
Router.post("/createHodMessages", async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message here if needed

    const newMessage = new HodMessage({
      message,
    });

    await newMessage.save();
    res.json({ message: "Notification Added" });
  } catch (err) {
    errorHandler(err, res);
  }
});

// For deleting messages
Router.get("/deleteHodMessage", async (req, res) => {
  try {
    const { documentId } = req.query;

    // Validate documentId here if needed

    const deletedMessage = await HodMessage.findByIdAndDelete(documentId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted!!" });
  } catch (err) {
    errorHandler(err, res);
  }
});

module.exports = Router;
