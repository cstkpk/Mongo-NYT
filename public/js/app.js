$(".note-btn").on("click", function(event) {
    // event.preventDefault();
    $("#notes").empty();
    let thisId = $(this).attr("id");
    console.log(thisId);
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h4>" + data.title + "</h4>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
          // Add a delete button to delete notes
          $("#notes").append(" <button data-id='" + data._id + "' id='deletenote'>X</button>");
        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    let thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/api/notes/" + thisId,
        data: {
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
    .then(function(data) {
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
    });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");

});

// When you click the delete note button
$(document).on("click", "#deletenote", function() {
    let thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "DELETE",
        url: "/api/notes/" + thisId,
        // data: {
        //     title: $("#titleinput").val(),
        //     body: $("#bodyinput").val()
        // }
    }).then(function(data) {
        console.log(data);
        console.log("empty notes");
        $("#notes").empty();
    });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");
    console.log("body input val empty");
})

// Save article
$(document).on("click", ".save-btn", function() {
    let articleToSave = $(this)
    .parents(".card")
    .data();

    // Remove card from page
    $(this)
    .parents(".card")
    .remove();

    let thisId = $(this).attr("id");

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
    method: "PUT",
    url: "/api/saved/" + thisId,
    data: articleToSave
    })
    .then(function(data) {
    // If the data was saved successfully
    if (data.saved) {
        // Remove saved card from home page ----- This doesn't work the way I thought it would...
        location.reload();
    }
    });
});

// Unsave article
$(document).on("click", ".unsave-btn", function() {
    let articleToSave = $(this)
    .parents(".card")
    .data();

    // Remove card from page
    $(this)
    .parents(".card")
    .remove();

    let thisId = $(this).attr("id");

    articleToSave.saved = false;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
    method: "PUT",
    url: "/api/unsaved/" + thisId,
    data: articleToSave
    })
    .then(function(data) {
    // If the data was saved successfully
    if (data.saved) {
        // Remove saved card from home page ----- This doesn't work the way I thought it would...
        location.reload();
    }
    });
});