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
            .then(function (savedArticle) {
                res.render("saved", { savedArticle });
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}
