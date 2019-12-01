const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');
const ui = require('./classes/UI');

// Local Storage for saving books into
const storage = new store.Store();

// UI for showing Toasts
const userInterface = new ui.UI();

// Save value of old ISBN so book can be found 
let oldIsbn;

// EVENT LISTENERS

document.getElementById('book-form').addEventListener('submit', e => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const newIsbn = document.getElementById('isbn').value;

    // Validate form input
    if (title === '' || author === '' || isbn === '') {
        userInterface.showToast('Please fill in all fields!');
    } else {
        storage.editBook(oldIsbn, title, author, newIsbn);

        // Send ipc to mainProcess to get this editBookWindow closed after edit
        ipcRenderer.send('book:editDone')
    }
});

// Close window with ESCAPE key
window.onkeydown = e => {
    if (event.keyCode == 27) {
        window.close();
    }
};

// IPC HANDLING

ipcRenderer.on('book:edit', (e, title, author, isbn) => {
    // Preset input fields with book info that needs to be edited
    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("isbn").value = isbn;

    // Handle case if isbn gets edited
    oldIsbn = document.getElementById('isbn').value;
});