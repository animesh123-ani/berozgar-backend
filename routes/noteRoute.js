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
    res.status(500).json({ message: "SomeThing Went wrong" });
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
    res.json({ message: "Note Uploaded!!" });
  } catch (err) {
    console.error("Error is here" + err);
    res.status(500).json({ message: "Something Went Wrong!!" });
  }
});

Router.get("/subject", async (req, res) => {
  try {
    const { code, sem } = req.query;
    let notes = await Notes.find({ sem });
    let subjects = notes.filter(
      (obj) => convertToCamelCase(obj.subjectCode) === convertToCamelCase(code)
    );
    res.json(subjects);
  } catch (err) {
    console.error("Error is here" + err);
    res.status(500).json({ message: "SomeThing Went Wrong!!" });
  }
});

function convertToCamelCase(input) {
  return input.replace(/[-\s]/g, "").toUpperCase();
}

module.exports = Router;
