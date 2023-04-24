const express = require("express");
const path = require("path");
const fs = require("fs");     // Needed for the delete request

const api = require("./routes/index.js");
// const notesApi = require('./routes/notes.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://localhost:3001/api
app.use("/api", api);

app.use(express.static("public"));

// GET Route for homepage
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET Route for feedback page
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// Deletes note    https://stackoverflow.com/questions/65015000/how-do-i-use-express-js-app-delete-to-remove-a-specific-object-from-an-array
app.delete("/api/notes/:id", (req, res) => {
  const notesArray = JSON.parse(fs.readFileSync("./db/db.json"));
  const deleteNote = notesArray.filter(
    (removeNote) => removeNote.id !== req.params.id
  );
  fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote));
  res.json(deleteNote);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);