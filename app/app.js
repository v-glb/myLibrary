const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');
const ui = require('./classes/UI');

const userInterface = new ui.UI();
const storage = new store.Store();









// EVENT LISTENERS for index.html

window.addEventListener('DOMContentLoaded', (event) => {
  userInterface.displayBooks();
  console.log('DOM fully loaded and parsed');
});


// ipcMain signals handling
ipcRenderer.on('book:add', (e, newBook) => {
  // Add new Book to local storage
  storage.addBook(newBook);

  // Render new Book in html
  userInterface.addBookToList(newBook);
  console.log('Done!');
});