const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');
const ui = require('./classes/UI');

// Local Storage for saving books into
const storage = new store.Store();

// UI for showing Toasts
const userInterface = new ui.UI();


// EVENT LISTENERS

// Create new Book and send it to mainWindow for rendering
document.getElementById('book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  // Validate form input

  if (title === '' || author === '' || isbn === '') {
    userInterface.showToast('Please fill in all fields!');
  } else {
    // instantiate Book for adding
    const newBook = new book.Book(title, author, isbn, true);

    // Send ipc with to mainWindow so new book gets immediately rendered on page
    ipcRenderer.send('book:add', newBook);
  }
});

// Close window with ESCAPE key
window.onkeydown = e => {
  if (event.keyCode == 27) {
    window.close();
  }
};