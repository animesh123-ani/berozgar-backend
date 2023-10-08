const express = require("express");
const Router = express.Router();
const HodMessage = require("../model/hoding");

//for Reading messages
Router.get("/hodmessages", async (req, res) => {
  try {
    let messsages = await HodMessage.find({});
    res.json(messsages);
  } catch (err) {
    res.status(500).json({ message: "SomeThing Went Wrong in My Server" });
  }
});

//for creating messages
Router.post("/createHodMessages", async (req, res) => {
  try {
    let { message } = req.body;
    const newMessage = new HodMessage({
      message,
    });
    await newMessage.save();
    res.json({ message: "Notification Added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "SomeThing Went Wrong In My Server" });
  }
});

//for deleting messages
Router.delete("/deleteHodMessage", async (req, res) => {
  try {
    let { documentId } = req.query;
    await HodMessage.findByIdAndRemove(documentId);
    res.json({ message: "message deleted!!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong in my server" });
  }
});

module.exports = Router;
