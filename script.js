const name_input = document.querySelector("#book-name");
const author_input = document.querySelector("#book-author");
const num_pages_input = document.querySelector("#book-pages");
const has_read_input = document.querySelector("#has-read");
const book_display = document.querySelector(".books-display");
const form_modal = document.querySelector("form.modal");
const overlay = document.querySelector(".overlay");
const form_button = document.querySelector("form button");
const add_book_button = document.querySelector(".btnAddBook");
const stats_modal = document.querySelector(".user-stats");
const show_stats_button = document.querySelector(".btnShowStats");
const total_books = document.querySelector(".totalBooks");
const read_books = document.querySelector(".readBooks");
const unread_books = document.querySelector(".unreadBooks");
let curActiveModal;

class Library {
  #books = new Map();
  #_booksRead = 0;
  #_booksUnread = 0;
  get booksRead() {
    return this.#_booksRead;
  }
  get booksUnread() {
    return this.#_booksUnread;
  }
  get totalBooks() {
    return this.#books.size;
  }

  addBook(book, key) {
    this.#books.set(key, book);
    if (book.haveRead === "read") this.#_booksRead++;
    else this.#_booksUnread++;
  }
  removeBook(bookKey) {
    if (this.#books.get(bookKey).haveRead === "read") this.#_booksRead--;
    else this.#_booksUnread--;
    this.#books.delete(bookKey);
  }
  update(bookKey) {
    const status = this.#books.get(bookKey).haveRead;
    this.#books.get(bookKey).haveRead = status === "read" ? "unread" : "read";
    if (status === "read") {
      this.#_booksUnread++;
      this.#_booksRead--;
    } else {
      this.#_booksUnread--;
      this.#_booksRead++;
    }
  }
  contains(bookKey) {
    return this.#books.has(bookKey);
  }
}

const myLib = new Library();

class Book {
  constructor(title, author, pages, haveRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.haveRead ? "read" : "not read yet"
    }`;
  }
}
const formFields = Array.from(form_modal.elements);
formFields.forEach((field) => {
  const err = field.nextElementSibling;
  field.addEventListener("input", (e) => {
    if (!field.checkValidity()) {
      if (field.classList.contains("valid")) {
        err.textContent = err.dataset.empty;
        if (
          field.id === "book-pages" &&
          (field.value < field.min || field.value > field.max)
        )
          err.textContent = err.dataset.outRange;
        field.classList.remove("valid");
        field.classList.add("invalid");
      }
    } else {
      if (err) err.textContent = "";
      field.classList.remove("invalid");
      field.classList.add("valid");
    }
  });
  field.addEventListener("blur", () => {
    if (!field.checkValidity()) {
      err.textContent = err.dataset.empty;
      field.classList.add("invalid");
    }
  });
});

function showModal() {
  curActiveModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function hideModal() {
  curActiveModal.classList.add("hidden");
  overlay.classList.add("hidden");
}

show_stats_button.addEventListener("click", () => {
  curActiveModal = stats_modal;
  showModal();
});

add_book_button.addEventListener("click", () => {
  curActiveModal = form_modal;
  showModal();
});

overlay.addEventListener("click", hideModal);

has_read_input.addEventListener("input", (e) => {
  if (has_read_input.checked) {
    has_read_input.value = "read";
  } else {
    has_read_input.value = "unread";
  }
});

function updateReadUnread(read, unread, total) {
  read_books.textContent = read;
  unread_books.textContent = unread;
  total_books.textContent = total;
}

function formFieldsAllValid() {
  let formInvalid = false;
  let focusField = false;

  for (const field of formFields) {
    field.blur();
    if (!field.checkValidity()) {
      field.classList.add("invalid");
      if (!focusField) {
        field.focus();
        focusField = true;
      }
      formInvalid = true;
    }
  }

  return !formInvalid;
}

function resetForm() {
  name_input.value = "";
  author_input.value = "";
  num_pages_input.value = "";
  has_read_input.value = "unread";
  formFields.forEach((field) => {
    field.classList.remove("valid");
    const err = field.nextElementSibling;
    if (err) err.textContent = "";
    if (field.checked) {
      field.checked = false;
    }
  });
}

function createBookCard(book, bookKey) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.key = bookKey;

  const book_name = document.createElement("span");
  book_name.textContent = "📔 " + book.title;

  const book_author = document.createElement("span");
  book_author.textContent = "✍️ " + book.author;

  const book_pages = document.createElement("span");
  book_pages.textContent = "📄 " + book.pages + " pages";

  const book_read = document.createElement("button");
  book_read.classList.add(book.haveRead === "read" ? "btnRead" : "btnUnread");
  book_read.textContent = book.haveRead;

  book_read.addEventListener("click", () => {
    book_read.classList.toggle("btnUnread");
    book_read.classList.toggle("btnRead");
    myLib.update(card.dataset.key);
    updateReadUnread(myLib.booksRead, myLib.booksUnread, myLib.totalBooks);
    book_read.textContent =
      book_read.textContent === "read" ? "unread" : "read";
  });

  const remove_btn = document.createElement("button");
  remove_btn.textContent = "Remove";
  remove_btn.addEventListener("click", (e) => {
    myLib.removeBook(card.dataset.key);
    card.remove();
    updateReadUnread(myLib.booksRead, myLib.booksUnread, myLib.totalBooks);
  });

  card.append(book_name, book_author, book_pages, book_read, remove_btn);
  book_display.appendChild(card);
}

form_button.addEventListener("click", (e) => {
  e.preventDefault();
  if (!formFieldsAllValid()) return;

  const name = name_input.value.trim();
  const author = author_input.value.trim();
  const pages = num_pages_input.value;
  const has_read = has_read_input.value;
  const bookKey = `${name.toLowerCase()}+${author.toLowerCase()}`;

  if (myLib.contains(bookKey)) {
    formFields[0].nextElementSibling.textContent =
      formFields[0].nextElementSibling.dataset.duplicate;
    formFields[0].classList.add("invalid");
    formFields[0].classList.remove("valid");
    formFields[1].classList.add("invalid");
    formFields[1].classList.remove("valid");
    return;
  }

  hideModal();

  const newBook = new Book(name, author, pages, has_read);
  createBookCard(newBook, bookKey);
  myLib.addBook(newBook, bookKey);
  updateReadUnread(myLib.booksRead, myLib.booksUnread, myLib.totalBooks);
  resetForm();
});
