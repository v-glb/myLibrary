const electron = require('electron');
const { ipcRenderer } = electron;
const store = require('./classes/Store');
const ui = require('./classes/UI');

const userInterface = new ui.UI();
const storage = new store.Store();

// #################################################################
//
//                  HTML DOM ELEMENTS
//
// #################################################################


let searchInput = document.getElementById('pattern');
let bookPager = document.getElementById('book-pager');
let searchBookForm = document.getElementById('search-book-form');
let bookList = document.getElementById('book-list');
let addBook = document.getElementById('add-book');
let abortDelete = document.getElementById('abort-delete-button');
let confirmDelete = document.getElementById('confirm-delete-button');

// #################################################################
//
//                  PAGINATION HANDLING
//
// #################################################################

// Init paging layout
function initPagination() {
  // Clear pagination from before, needed when performing operations like searching
  bookPager.innerHTML = '';

  $('#book-table').pageMe({
    pagerSelector: '#book-pager',
    activeColor: 'teal',
    showPrevNext: true,
    hidePageNumbers: false,
    perPage: 5
  });
}

// #################################################################
//
//                EVENT LISTENERS HANDLING
//
// #################################################################

// Display book status in cards on first loading of page
window.addEventListener('DOMContentLoaded', (e) => {
  // Initialize modal trigger
  const elems = document.querySelectorAll('.modal');
  const instances = M.Modal.init(elems);

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

  // Display pagination based on amount of <tr>
  initPagination();

});

// Highlight Search form with ctrl+f for quick access
window.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'f') {
    searchInput.focus();
  }
});


// Handle search for book
searchBookForm.addEventListener('submit', e => {
  // Prevent actual submit
  e.preventDefault();

  // Get search value
  const searchPattern = searchInput.value;

  // Validate input
  if (searchPattern === '') {
    userInterface.showToast('Empty input!');
  } else {

    // Update <tr> with matching searchPattern
    userInterface.searchBook(searchPattern);

    // Update pagination
    initPagination();
  }
});

// Reset book search when hitting ESC
searchBookForm.addEventListener('keydown', e => {
  if (e.keyCode == 27) {
    searchInput.value = '';
    searchInput.blur();
    userInterface.displayBooks();
    initPagination();
  }
});



// needed for confirm-delete-modal to get passed into eventListener
let bookUI;
let bookStorage;

// Handle Book actions: Remove and Edit Book
// Right now via ugly DOM traversing, needs refactoring in future
bookList.addEventListener('click', e => {

  // Delete book from UI and localStorage
  if (e.target.classList.contains('delete')) {
    // UI book entry to remove
    bookUI = e.target;

    // LocalStorage book entry to remove
    // Get ISBN from e.target via DOM traversing!
    bookStorage = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

    // Actual delete process in the modal! See modal eventListener

    // Edit Book
  } else if (e.target.classList.contains('edit')) {

    // Get Book info via DOM traversing to send via ipc
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const author = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const isbn = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const comment = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;

    ipcRenderer.send('book:edit', title, author, isbn, comment);

    // Error handling (click on empty space in tr)
  } else {
    // TODO: Implement proper error handling when clicking on whitespace in tr

    console.log('error');
  }
});

// Add book via nav bar button
addBook.addEventListener('click', e => {
  const darkModeEnabled = document.getElementById('dark-mode-switch-status').checked;
  // Send to main process for launching the addBook Window
  ipcRenderer.send('book:new', darkModeEnabled);
});

// Confirm delete of book via modal dialog
abortDelete.addEventListener('click', e => {
  // Do nothing
});

confirmDelete.addEventListener('click', e => {
  // Remove Book from UI
  userInterface.deleteBook(bookUI);

  // // Remove Book from Local Storage
  storage.removeBook(bookStorage);

  // // Show success message
  userInterface.showToast('Book removed!');

  // // Update card stats
  userInterface.updateTotalBooks();
  userInterface.updateLentBooks();
  userInterface.updateRecentlyAddedBooks(5);
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

  // Update Pagination
  initPagination();
});

ipcRenderer.on('book:editDone', e => {
  // Show success message
  userInterface.showToast('Book edited!');

  // Update book cards and table in mainWindow
  userInterface.updateRecentlyAddedBooks(5);
  userInterface.updateLentBooks();
  userInterface.displayBooks();

  // Update pagination
  initPagination();
});

ipcRenderer.on('books:export', e => {
  // save objects from localStorage to books
  const books = storage.exportBooks();

  // Send back to mainProcess for launching the save dialog
  ipcRenderer.send('books:exportDone', books);
});

ipcRenderer.on('books:import', (e, importedBooks) => {
  storage.importBooks(importedBooks);
});