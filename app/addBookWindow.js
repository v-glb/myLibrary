const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');

// Local Storage for saving books into
const storage = new store.Store();


// EVENT LISTENERS

// Create new Book and send it to mainWindow for rendering

document.getElementById('book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  const newBook = new book.Book(title, author, isbn);

  // Send ipc with to mainWindow so new book gets immediately rendered on page
  ipcRenderer.send('book:add', newBook);
});

// Close window with ESCAPE key

$(document).keydown(function(e) {
    if (e.keyCode == 27) {
        window.close();
    }
});