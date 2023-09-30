const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  subjectName: String,
  subjectCode: String,
  sem: Number,
  File: String,
  uploadedBy: String,
  chapterName: String,
  subjectType: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});
const Notes = mongoose.model("Note", NotesSchema);

module.exports = Notes;
