// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
    // Root route to display index.handlebars
    // Makes the axios call to NYT and stores information in DB
    app.get("/", function(req, res) {
        // Axios call to get information from NYT through Cheerio
        axios.get("https://www.nytimes.com").then(function(response) {
            const $ = cheerio.load(response.data);
            const result = {};

            $("article").each(function(i, element) {

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .children("a")
                    .text();
                result.link = $(this)
                    .find("a")
                    .attr("href");

                // Create a new Article using the `result` object built from scraping
                db.Article.create(results)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
            });

            console.log(results);
        });
        // TODO: Create Handlebars object to pass into index.handlebars
        res.render("index", { hbsObjectTBD });
    });
}
