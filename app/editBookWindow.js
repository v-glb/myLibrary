const electron = require('electron');
const { ipcRenderer } = electron;
const store = require('./classes/Store');
const ui = require('./classes/UI');

// LocalStorage instance
const storage = new store.Store();

// UI instance
const userInterface = new ui.UI();

// Save value of old ISBN so book can be found in case of user wants to
// edit the ISBN too
let oldIsbn;


// #################################################################
//
//                EVENT LISTENERS HANDLING
//
// #################################################################

// Handle book information editing
document.getElementById('book-form').addEventListener('submit', e => {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const newIsbn = document.getElementById('isbn').value;

    // Validate form input
    if (storage.getBookAvailability(oldIsbn)) {
        //TODO: Validating for new form fields when book is not available
    }
    if (title === '' || author === '' || isbn === '') {
        userInterface.showToast('Please fill in all fields!');
    } else {
        storage.editBook(oldIsbn, title, author, newIsbn);

        // Send ipc to mainProcess to get this editBookWindow closed after edit
        ipcRenderer.send('book:editDone')
    }
});

// Handle book availability editing via checkbox
document.getElementById('book-avail-check').addEventListener('change', e => {
    const available = storage.toggleBookAvailability(oldIsbn);

    if (available) {
        toggleFormExtend(true);
    } else {
        toggleFormExtend(false);
    }

});

// Close window with ESCAPE key
window.onkeydown = e => {
    if (event.keyCode == 27) {
        window.close();
    }
};

// Extend form with additional fields if book is lent to somebody
function toggleFormExtend(availability) {
    if (!availability) {
        // create new form field for entering whom book is lent to
        const divToAppendTo = document.getElementById('book-avail-check-div');
        const div = document.createElement('div');
        div.classList.add('form-group');
        div.setAttribute("id", 'borrower-div')
        div.innerHTML = `
            <p>
              <label for="lent-to">Borrower</label>
              <input type="text" id="lent-to" class="form-control">
            </p>
        `;
        divToAppendTo.appendChild(div);

        // Create datepicker for selecting due date
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("class", "datepicker");
        input.setAttribute("id", "due-date");

        const label = document.createElement('label');
        label.setAttribute('class', 'active')
        label.setAttribute('for', 'due-date')
        label.innerHTML = 'Due Date';

        div.appendChild(label);
        div.appendChild(input);

    } else {
        // remove newly created form fields from DOM
        document.getElementById('borrower-div').remove();
    }

}


// #################################################################
//
//                        IPC HANDLING
//
// #################################################################

ipcRenderer.on('book:edit', (e, title, author, isbn) => {
    // Preset input fields with book info for editing
    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("isbn").value = isbn;

    // Handle case if isbn gets edited too
    oldIsbn = document.getElementById('isbn').value;

    // Determine if checkbox is checked (book is available) or not when window
    // is created
    const book = storage.getSpecificBook(oldIsbn);
    const checkbox = document.getElementById('book-avail-check');

    // Set checkbox status
    // book.available === true ? checkbox.checked = true : checkbox.checked = false;

    if (book.available === true) {
        checkbox.checked = true;
        toggleFormExtend(true);
    } else {
        checkbox.checked = false;
        toggleFormExtend(false);
        var elems = document.querySelectorAll('.datepicker');
        console.log(elems);
        var instances = M.Datepicker.init(elems);
    }
});