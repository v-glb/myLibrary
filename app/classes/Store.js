class Store {
  getBooks() {
    let books;

    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  getLentBooks() {
    const totalBooks = this.getBooks();
    let lentBooksCounter = 0;

    totalBooks.forEach((book) => {

      if (book.available === false) {
        lentBooksCounter++;
      }

    });

    return lentBooksCounter;
  }

  addBook(book) {
    const books = this.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  removeBook(isbn) {
    const books = this.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

  editBook(oldIsbn, title, author, newIsbn) {
    const books = this.getBooks();
    // Grab the book via index in localStorage that needs to be edited
    const bookIndex = this.getIndexOfBook(oldIsbn);

    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].isbn = newIsbn;

    localStorage.setItem('books', JSON.stringify(books));
  }

  getIndexOfBook(isbn) {
    const books = this.getBooks();
    let bookIndex;

    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      if (book.isbn === isbn) {
        bookIndex = i;
        break;
      }

      bookIndex++;
    }

    return bookIndex;
  }

  getSpecificBook(isbn) {
    const books = this.getBooks();
    const bookIndex = this.getIndexOfBook(isbn);

    return books[bookIndex];
  }

  getRecentlyAddedBooks(numberOfBooks) {
    // Return last n added books
    const books = this.getBooks();
    let recentBooks = [];

    // How many 'recently added' to return
    let bookCounter = 1;

    for (let i = books.length - 1; i >= 0; i--) {
      const element = books[i];
      recentBooks.push(element);

      if (bookCounter === numberOfBooks) {
        break;
      }

      bookCounter++;
    }

    return recentBooks;
  }

  toggleBookAvailability(isbn) {
    const books = this.getBooks();
    const bookIndex = this.getIndexOfBook(isbn);

    books[bookIndex].available === true ? books[bookIndex].available = false :
      books[bookIndex].available = true;

    localStorage.setItem('books', JSON.stringify(books));

  }

  exportBooks() {
    // Read all book objects from localStorage and return them as string
    const books = JSON.stringify(localStorage);
    return books;
  }

  importBooks(books) {
    // Parse passed in String with book objects
    var booksToImport = JSON.parse(books);

    // Iterate and set each item in localStorage
    for (let key in booksToImport) {
      localStorage[key] = booksToImport[key];
    }
  }
}

module.exports.Store = Store;