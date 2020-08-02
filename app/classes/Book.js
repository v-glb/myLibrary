class Book {
  constructor(title, author, isbn, available, comment) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.available = available;
    this.comment = comment;
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

  getComment() {
    return this.comment;
  }

}

module.exports.Book = Book;