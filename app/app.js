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

  // Delete book from UI and localStorage
  if (e.target.classList.contains('delete')) {

    // Remove Book from UI
    userInterface.deleteBook(e.target);

    // Remove Book from Local Storage
    // Get ISBN from e.target via DOM traversing!
    storage.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    userInterface.showToast('Book removed!');

    // Update card stats
    userInterface.updateTotalBooks();
    userInterface.updateRecentlyAddedBooks(5);

    // Launch book edit window
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

  // Show success toast
  userInterface.showToast('Book added!');

  // Render new Book in html
  userInterface.updateTotalBooks();

  // Update recently added books
  userInterface.updateRecentlyAddedBooks(5);
});

ipcRenderer.on('book:editDone', e => {
  userInterface.showToast('Book edited!');

  userInterface.updateRecentlyAddedBooks(5);

  userInterface.updateLentBooks();

  userInterface.displayBooks();

});