const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');
const ui = require('./classes/UI');

const userInterface = new ui.UI();
const storage = new store.Store();






// #################################################################
//
//                EVENT LISTENERS HANDLING
//
// #################################################################

// Display total books in cards on first loading of page
window.addEventListener('DOMContentLoaded', (e) => {
  // Render card showing total books in posession
  userInterface.updateTotalBooks();

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

  // Get form value
  const searchPattern = document.getElementById('pattern').value;

  if (searchPattern === '') {
    userInterface.showToast('Empty input!');
  } else {
    userInterface.searchBook(searchPattern);
  }
});

// Handle remove a book
document.getElementById('book-list').addEventListener('click', e => {

  // Handle Edit and Delete Button clicking
  if (e.target.classList.contains('delete')) {

    // Remove Book from UI
    userInterface.deleteBook(e.target);

    // Remove Book from Local Storage
    // Get ISBN from e.target via DOM traversing!
    storage.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    userInterface.showToast('Book removed!');

    // Update card stats
    userInterface.updateTotalBooks();
    userInterface.updateRecentlyAddedBooks(5);

  } else if (e.target.classList.contains('edit')) {
    // TODO: Implement editing feature

    ipcRenderer.send('book:edit');
    console.log('Editing!');

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

  // Show success toast
  userInterface.showToast('Book added!');

  // Render new Book in html
  userInterface.updateTotalBooks();

  // Update recently added books
  userInterface.updateRecentlyAddedBooks(5);
});