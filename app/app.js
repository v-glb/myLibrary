const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');
const ui = require('./classes/UI');

const userInterface = new ui.UI();
const storage = new store.Store();






// EVENT LISTENERS for index.html

// window.addEventListener('DOMContentLoaded', (event) => {
//   userInterface.displayBooks();
//   console.log('DOM fully loaded and parsed');
// });

// Handle search for book
document.getElementById('search-book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form value
  const searchPattern = document.getElementById('pattern').value;

  // TODO: Implement show alert
  if (searchPattern === '') {
    userInterface.showAlert('Empty input!');
  } else {
    userInterface.searchBook(searchPattern);
  }
});

// Display total books in cards on first loading of page
window.addEventListener('DOMContentLoaded', (e) => {
  userInterface.updateTotalBooks();
});

// ipcMain signals handling
ipcRenderer.on('book:add', (e, newBook) => {
  // Add new Book to local storage
  storage.addBook(newBook);

  // Render new Book in html
  userInterface.updateTotalBooks();
});