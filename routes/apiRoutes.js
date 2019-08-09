// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app) {

    // Route for getting all articles
    app.get("/articles", function(req, res) {
        db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // Route for grabbing a specific Article by id, populate it with its note
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // Route for saving an article's note
    app.post("/api/notes/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

  // Route for deleting an article's note
  app.delete("/api/notes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbNote) {
            console.log("Deleting note...");
            // return db.Article.findOneAndDelete({ _id: req.params.id }, remove({ note: dbNote._id }));
            return db.Article.deleteOne(({ note: dbNote._id }));
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
            console.log("Note deleted");
            console.log(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
    });

  app.put("/api/saved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});
};