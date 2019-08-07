// Depenencies
const mongoose = require("mongoose");

// Reference to Schema constructor
const Schema = mongoose.Schema;

// Create a new ArticleSchema object
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create our model
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;