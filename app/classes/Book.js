class Book {
  constructor(title, author, isbn, available) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.available = available;
  }

  getTitle() {
    return this.title;
  }

  getAuthor() {
    return this.author;
  }

  getIsbn() {
    return this.isbn;
  }

  getBookInfo() {
    return `${this.getTitle()} by ${this.getAuthor()}`;
  }

}

module.exports.Book = Book;