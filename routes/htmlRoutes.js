// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
// Require all models
const db = require("../models");

module.exports = function(app) {
    // Root route to display index.handlebars
    // Makes the axios call to NYT and stores information in DB
    app.get("/", function(req, res) {
        // const result = {};
        // Axios call to get information from NYT through Cheerio
        axios.get("https://www.nytimes.com/section/world").then(function(response) {
            const $ = cheerio.load(response.data);
            const result = {};

            $("article h2").each(function(i, element) {

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .find("a")
                    .attr("href");
                result.summary = $(this)
                    .siblings("p")
                    .text();

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    return dbArticle; 
                })
                .catch(function(err) {
                    console.log(err);
                });
            });

            // console.log(result);
        });
        db.Article.find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.render("index", { dbArticle });
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
    });

    app.get("/saved", (req, res) => {
        db.Article.find({saved: true})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.render("saved", dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });




    // Route for grabbing a specific Article by id, populate it with it's note
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

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
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
}
