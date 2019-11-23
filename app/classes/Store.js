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
}

module.exports.Store = Store;