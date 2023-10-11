const express = require("express");
const Router = express.Router();
const Notes = require("../model/NoteModel");
const { authenticateToken } = require("./route");

Router.get("/notesofsem", authenticateToken, async (req, res) => {
  try {
    let sem = req.query.sem;
    let notes = await Notes.find({ sem: sem });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "My Server is very Bad You Know But It Will Work Again Soon So Try Again Now",
    });
  }
});

Router.post("/upload-notes", authenticateToken, async (req, res) => {
  const {
    subjectName,
    subjectCode,
    subjectType,
    chapterName,
    sem,
    File,
    uploadedBy,
  } = req.body;
  const { role } = req.user;
  if (role != "ADMIN") {
    return res.status(403).json({ message: "You Have Not Admin Access" });
  }
  try {
    const newNote = new Notes({
      subjectName,
      subjectCode,
      sem,
      File,
      uploadedBy,
      chapterName,
      subjectType,
    });
    await newNote.save();
    res.json({
      message: `Thank You ${uploadedBy} your Contribution means a lot to us!!`,
    });
  } catch (err) {
    console.error("Error is here" + err);
    res.status(500).json({
      message:
        "My Server is very Bad You Know But It Will Work Again Soon So Try Again Now",
    });
  }
});

Router.get("/subject", async (req, res) => {
  try {
    const { code, sem } = req.query;
    let notes = await Notes.find({ sem }).sort({
      _id: -1,
    });
    let subjects = notes.filter(
      (obj) => convertToCamelCase(obj.subjectCode) === convertToCamelCase(code)
    );
    res.json(subjects);
  } catch (err) {
    console.error("Error is here" + err);
    res.status(500).json({
      message:
        "My Server is very Bad You Know But It Will Work Again Soon So Try Again Now",
    });
  }
});

function convertToCamelCase(input) {
  return input.replace(/[-\s]/g, "").toUpperCase();
}

module.exports = Router;
