const electron = require('electron');
const { ipcRenderer } = electron;
const book = require('./classes/Book');
const store = require('./classes/Store');
const ui = require('./classes/UI');

// Local Storage for saving books into
const storage = new store.Store();

// UI for showing Toasts
const userInterface = new ui.UI();

console.log('test');


// EVENT LISTENERS


// IPC HANDLING

ipcRenderer.on('book:edit', (e, title, author, isbn) => {
    console.log(title, author, isbn);

    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("isbn").value = isbn;

});