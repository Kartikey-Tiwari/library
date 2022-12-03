const name_input = document.querySelector("#book-name");
const author_input = document.querySelector("#book-author");
const num_pages_input = document.querySelector("#book-pages");
const has_read_input = document.querySelector("#has-read");
const book_display = document.querySelector(".books-display");
const form_button = document.querySelector("form button");

const myLib = new Library();

form_button.addEventListener("click", (e) => {
  e.preventDefault();
  myLib.addBook();
});

function Library(books = new Map()) {
  this.books = books;
  this.booksRead = 0;
  this.booksUnread = 0;
  this.totalBooks = 0;
  this.cur_book_key = 0;
}

Library.prototype.addBook = function () {
  const name = name_input.value;
  const author = author_input.value;
  const pages = num_pages_input.value;
  const has_read = has_read_input.value;

  const newBook = new Book(name, author, pages, has_read);
  createBookCard(newBook);
  this.books.set(this.cur_book_key++, newBook);
};

function Book(title, author, pages, haveRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.haveRead = haveRead;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.haveRead ? "read" : "not read yet"
    }`;
  };
}

function createBookCard(book) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.key = myLib.cur_book_key;

  const book_name = document.createElement("h2");
  book_name.textContent = book.title;

  const book_author = document.createElement("h3");
  book_author.textContent = book.author;

  const book_pages = document.createElement("h4");
  book_pages.textContent = book.pages;

  const book_read = document.createElement("span");
  book_read.textContent = book.haveRead;

  card.append(book_name, book_author, book_pages, book_read);
  book_display.appendChild(card);
}
