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
            <td id="title">${book.title}</td>
            <td id="author">${book.author}</td>
            <td id="isbn">${book.isbn}</td>
            <td id="edit">
              <a id="edit-button" class="waves-effect waves-light btn edit">edit</a>
            </td>
            <td>
              <a id="delete-button" class="waves-effect waves-light btn delete">X</a>
            </td>
        `;

    list.appendChild(row);
  }

  deleteBook(book) {
    if (book.classList.contains('delete')) {
      book.parentElement.parentElement.remove();
    }
  }

  showToast(message) {
    M.toast({ html: message })
  }

  searchBook(pattern) {
    // Remove previous search results
    const row = document.getElementById('book-list');
    while (row.firstChild) {
      row.removeChild(row.firstChild);
    }

    const books = storage.getBooks();

    // Show "nothing found" message if this counter is not increasing
    let bookFound = 0;

    books.forEach((book) => {
      if (book.title.includes(pattern) || book.author.includes(pattern) ||
        book.isbn.includes(pattern)) {

        this.addBookToList(book);
        bookFound++;
      }
    });

    if (bookFound === 0) {
      this.showToast('No books found!');
    }
  }

  updateTotalBooks() {
    const totalBooks = storage.getBooks().length;
    document.getElementById('total-books-counter').innerHTML = totalBooks;
  }

  updateLentBooks() {
    // TODO: Display books which are lent
  }

  updateRecentlyAddedBooks() {
    const recentBooksList = document.getElementById('recent-books-list');

    // Get recently added books as objects
    const recentBooks = storage.getRecentlyAddedBooks(5);

    // Clear last results
    recentBooksList.innerHTML = '';

    recentBooks.forEach((book) => {

      // Create single list element with class 'collection-item' for each book
      let li = document.createElement('li');
      li.setAttribute('class', 'collection-item');
      li.innerHTML = `'${book.title}' by ${book.author}`;

      // Append list elements to ul
      recentBooksList.appendChild(li);
    });
  }
}

module.exports.UI = UI;