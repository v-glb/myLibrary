const store = require('./Store');

// Local Storage needed for fetching and displaying books
const storage = new store.Store();

class UI {
  displayBooks() {
    const books = storage.getBooks();
    books.forEach((book) => this.addBookToList(book));
  }

  addBookToList(book) {
    const list = document.getElementById('book-list');

    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

    list.appendChild(row);
  }

  deleteBook(book) {
    if (book.classList.contains('delete')) {
      book.parentElement.parentElement.remove();
    }
  }

  // TODO: Add function for showing success/error message
  showAlert() {

  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

module.exports.UI = UI;