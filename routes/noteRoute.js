const express = require("express");
const Router = express.Router();
const Notes = require("../model/NoteModel");
const { authenticateToken } = require("./route");

Router.get("/notesofyear", authenticateToken, async (req, res) => {
  try {
    const year = Number(req.query.year);
    let notes;
    switch (year) {
      case 1:
        notes = await Notes.find({
          sem: { $gt: 0, $lte: 2 },
        });
        break;
      case 2:
        notes = await Notes.find({
          sem: { $gt: 2, $lte: 4 },
        });
        break;
      case 3:
        notes = await Notes.find({
          sem: { $gt: 4, $lte: 6 },
        });
        break;
      case 4:
        notes = await Notes.find({
          sem: { $gt: 6, $lte: 8 },
        });
        break;
      default:
        notes = await Notes.find({});
    }
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SomeThing Went wrong" });
  }
});

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
    console.error("Error is here" + error);
    res.status(500).json({ message: "SomeThing Went Wrong!!" });
  }
});

Router.get("/subject", async (req, res) => {
  try {
    const { code, sem } = req.query;
    let notes = await Notes.find({ sem }).select({
      chapterName: 1,
      subjectCode: 1,
      _id: 1,
    });
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
