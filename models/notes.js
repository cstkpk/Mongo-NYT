// Dependencies
const mongoose = require("mongoose");

// Reference to Schema constructor
const Schema = mongoose.Schema;

// Create new NoteSchema object
let NoteSchema = new Schema({
//   title: String,
  body: String
});

// Create our model
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;