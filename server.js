// Dependencies
// =============================================================
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");

let dbJSON = require("./db.json");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up the Express app to handle css and js files
app.use(express.static('public'))


// Routes
// =============================================================

// API to get all notes
app.get("/api/notes", function(req, res) {
  res.json(dbJSON)
});

// API to add a note
app.post("/api/notes", function(req, res) {

  // Copy request body and generate ID
  const note = {...req.body, id: uuidv4()}

  // Push note to dbJSON array - saves data in memory
  dbJSON.push(note);

  // Saves data to file
  fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(dbJSON), (err) => {
    if (err) {
      return res.json({error: "Error writing to file"});
    }
    return res.json(note);
  })
    
});

// API to delete a note
app.delete("/api/notes/:id", function(req, res) {

  // Filter out the id that needs to be deleted
  dbJSON = dbJSON.filter(note => {
    return note.id !== req.params.id
  })

  // Saves data to file
  fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(dbJSON), (err) => {
    if (err) {
      return res.json({error: "Error writing to file"});
    }
    return res.send();
  })

});

// Notes page
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Home page
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
