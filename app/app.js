const electron = require('electron');
const { ipcRenderer } = electron;
const store = require('./classes/Store');
const ui = require('./classes/UI');

const userInterface = new ui.UI();
const storage = new store.Store();






// #################################################################
//
//                EVENT LISTENERS HANDLING
//
// #################################################################

// Display book status in cards on first loading of page
window.addEventListener('DOMContentLoaded', (e) => {
  // Render card showing total books in posession
  userInterface.updateTotalBooks();

  // Render card showing lent books
  userInterface.updateLentBooks();

  // Render card showing recently added books
  userInterface.updateRecentlyAddedBooks();

  // Display all books
  // TODO: Render only a part of books so card doesn't look so empty...
  userInterface.displayBooks();

  // Render calendar
  // TODO: Implement calendar!

});

// Handle search for book
document.getElementById('search-book-form').addEventListener('submit', e => {
  // Prevent actual submit
  e.preventDefault();

  // Get search value
  const searchPattern = document.getElementById('pattern').value;

  // Validate input
  if (searchPattern === '') {
    userInterface.showToast('Empty input!');
  } else {
    userInterface.searchBook(searchPattern);
  }
});

// Handle Book actions: Remove and Edit Book
// Right now via ugly DOM traversing, needs refactoring in future
document.getElementById('book-list').addEventListener('click', e => {

  // Delete book from UI and localStorage
  if (e.target.classList.contains('delete')) {

    // Remove Book from UI
    userInterface.deleteBook(e.target);

    // Remove Book from Local Storage
    // Get ISBN from e.target via DOM traversing!
    storage.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show success message
    userInterface.showToast('Book removed!');

    // Update card stats
    userInterface.updateTotalBooks();
    userInterface.updateRecentlyAddedBooks(5);

    // Edit Book
  } else if (e.target.classList.contains('edit')) {

    // Get Book info via DOM traversing to send via ipc
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const author = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const isbn = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;

    ipcRenderer.send('book:edit', title, author, isbn);

    // Error handling (click on empty space in tr)
  } else {
    // TODO: Implement proper error handling when clicking on whitespace in tr

    console.log('error');
  }
});


// #################################################################
//
//                        IPC HANDLING
//
// #################################################################

ipcRenderer.on('book:add', (e, newBook) => {
  // Add new Book to local storage
  storage.addBook(newBook);

  // Show success message 
  userInterface.showToast('Book added!');

  // Update book cards and table in mainWindow
  userInterface.updateTotalBooks();
  userInterface.updateRecentlyAddedBooks(5);
  userInterface.displayBooks();
});

ipcRenderer.on('book:editDone', e => {
  // Show success message
  userInterface.showToast('Book edited!');

  // Update book cards and table in mainWindow
  userInterface.updateRecentlyAddedBooks(5);
  userInterface.updateLentBooks();
  userInterface.displayBooks();
});

ipcRenderer.on('books:export', e => {
  // save objects from localStorage to books
  const books = storage.exportBooks();

  // Send back to mainProcess for launching the save dialog
  ipcRenderer.send('books:exportDone', books);
});

ipcRenderer.on('books:import', e => {

});