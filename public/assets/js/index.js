let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === "/notes") {
  noteTitle = document.querySelector(".note-title-textarea");
  noteText = document.querySelector(".note-text-textarea");
  saveNoteBtn = document.querySelector(".save-btn");
  newNoteBtn = document.querySelector(".plus-btn");
  noteList = document.querySelectorAll("aside");

  //   If I want to count number of notes
  //   noteCounter = document.querySelector('.note-counter')
}

// ---------CODE FOR INDEX PAGE BELOW---------
let indexTakeNotes;

if (window.location.pathname === "/") {
  indexTakeNotes = document.querySelector(".index-take-notes");
  var i = 0;
  var txt = "Take notes with Express";
  var speed = 80;

  function typeWriter() {
    if (i < txt.length) {
      indexTakeNotes.innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
}
// -------------CODE FOR INDEX PAGE ABOVE----------------------

// --------------- EXP BELOW FOR NOTE LENGTH (FUNCTIONAL)------------
// fetch('/api/notes')
//   .then(response => response.json())
//   .then(data => {
//     // Access the array of objects directly from the data object
//     const myArray = data; // Assumes db.json directly represents an array of objects
//     // Get the length of the array
//     const arrayLength = myArray.length;
//     // Use the value as needed, e.g., update the noteCounter element
//     const noteCounter = document.querySelector('.note-counter');
//     noteCounter.textContent = `You have ${arrayLength} notes!`;
//     console.log(arrayLength)
//   })
//   .catch(error => console.error('Error fetching data:', error));

// ------------------ EXP ABOVE----------------------

// Show an element
const show = (elem) => {
  elem.style.display = "inline";
};

// Hide an element
const hide = (elem) => {
  elem.style.display = "none";
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute("readonly", true);
    noteText.setAttribute("readonly", true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = "";
    noteText.value = "";
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute("data-note")).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
    // reload is if I want to implement number of notes instantly
    // location.reload();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note"));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === "/notes") {
    noteList.forEach((el) => (el.innerHTML = ""));
  }

  let noteListItems = [];

  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement("div");
    liEl.classList.add("note-and-delete-container");

    const spanEl = document.createElement("div");
    spanEl.classList.add("saved-note");
    spanEl.innerText = text;
    spanEl.addEventListener("click", handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement("p");
      delBtnEl.textContent = "🗑";
      delBtnEl.classList.add("saved-note-delete");

      delBtnEl.addEventListener("click", handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi("No saved Notes", false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === "/notes") {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === "/notes") {
  saveNoteBtn.addEventListener("click", handleNoteSave);
  newNoteBtn.addEventListener("click", handleNewNoteView);
  noteTitle.addEventListener("keyup", handleRenderSaveBtn);
  noteText.addEventListener("keyup", handleRenderSaveBtn);
}

getAndRenderNotes();
