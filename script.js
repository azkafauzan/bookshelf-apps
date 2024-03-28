// Resource
const submitBook = document.querySelector("#submit-book");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const year = document.querySelector("#year");
const isComplete = document.querySelector("#is-complete");
const finished = document.querySelector("#finished-reading");
const notFinished = document.querySelector("#not-finished-reading");
const main = document.querySelector("main");
const editBook = document.querySelector("#edit-book");
const editTitle = document.querySelector("#edit-title");
const editAuthor = document.querySelector("#edit-author");
const editYear = document.querySelector("#edit-year");
const searchInput = document.querySelector("#search-input");
const modalBook = document.querySelector("#modal-book");

// Config Local Storage
const setStorage = () => {
  if (localStorage.getItem("books") === null) {
    localStorage.setItem("books", "[]");
  }
};
setStorage();

// Event Submit Book
submitBook.addEventListener("submit", function (e) {
  e.preventDefault();
  addBook(title.value, author.value, Number(year.value), isComplete.checked);
  finished.innerHTML = renderBook(true);
  notFinished.innerHTML = renderBook(false);
  clearInput();
});

// Event Load
window.addEventListener("load", function () {
  if (localStorage.getItem("books") !== null) {
    finished.innerHTML = renderBook(true);
    notFinished.innerHTML = renderBook(false);
  }
});

// Event Delete, Switch, Edit
main.addEventListener("click", function (e) {
  const storageBooks = JSON.parse(localStorage.getItem("books"));
  const id = e.target.parentElement.parentElement.parentElement.parentElement.id;
  // Delete
  if (e.target.classList.contains("delete")) {
    const newSB = storageBooks.filter((book) => book.id !== id);
    localStorage.setItem("books", JSON.stringify(sortByAlphabet(newSB)));
    finished.innerHTML = renderBook(true);
    notFinished.innerHTML = renderBook(false);
  }
  // Switch
  if (e.target.classList.contains("switch")) {
    const newSB = storageBooks.map((book) => {
      if (book.id === id) {
        book.isComplete = !book.isComplete;
      }
      return book;
    });
    localStorage.setItem("books", JSON.stringify(sortByAlphabet(newSB)));
    finished.innerHTML = renderBook(true);
    notFinished.innerHTML = renderBook(false);
  }
  // Edit
  if (e.target.classList.contains("edit")) {
    storageBooks.map((book) => {
      if (book.id === id) {
        editTitle.value = book.title;
        editAuthor.value = book.author;
        editYear.value = book.year;
      }
    });
    editBook.addEventListener("submit", function (e) {
      e.preventDefault();
      const newSB = storageBooks.map((book) => {
        if (book.id === id) {
          book.title = editTitle.value;
          book.author = editAuthor.value;
          book.year = editYear.value;
        }
        return book;
      });
      localStorage.setItem("books", JSON.stringify(sortByAlphabet(newSB)));
      finished.innerHTML = renderBook(true);
      notFinished.innerHTML = renderBook(false);
    });
  }
});

// Event Search
searchInput.addEventListener("keyup", (e) => {
  const value = e.target.value.toLowerCase();
  const storageBooks = JSON.parse(localStorage.getItem("books"));
  const books = storageBooks.filter((book) => {
    return book.title.toLowerCase().includes(value) || book.author.toLowerCase().includes(value);
  });
  modalBook.innerHTML = renderSearchBook(books);
  if (searchInput.value === "") {
    modalBook.innerHTML = "";
  }
});

// Function addBook
const addBook = (title, author, year, isComplete) => {
  const book = {
    id: String(+new Date()),
    title,
    author,
    year,
    isComplete,
  };
  const storageBooks = JSON.parse(localStorage.getItem("books"));
  storageBooks.push(book);
  localStorage.setItem("books", JSON.stringify(sortByAlphabet(storageBooks)));
};

// Function escapeHTML
const escapeHtml = (_) => {
  return _.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
};

// Function renderBook
const renderBook = (status) => {
  const books = JSON.parse(localStorage.getItem("books"));
  let html = "";
  books.forEach((book) => {
    if ((status && book.isComplete) || (!status && !book.isComplete)) {
      html += /*html*/ `
        <div class="col-lg-6 mb-3" id="${book.id}">
          <div class="card">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${escapeHtml(book.title)}</h5>
              <h6 class="card-subtitle mb-2 text-dark-emphasis">Author : ${escapeHtml(book.author)}</h6>
              <h6 class="card-subtitle mb-2 text-dark-emphasis">${book.year}</h6>
              <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, nostrum distinctio animi sed adipisci eligendi saepe magnam eveniet excepturi sint?</p>
              <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" class="btn btn-success fw-medium switch">Switch</button>
                <button type="button" class="btn btn-warning fw-medium edit" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                <button type="button" class="btn btn-danger fw-medium delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });
  return html;
};

// Function renderSearchBook
const renderSearchBook = (source) => {
  const books = source;
  let html = "";
  books.forEach((book) => {
    html += /*html*/ `
      <div class="col-12 mb-3" id="${book.id}">
        <div class="card">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${escapeHtml(book.title)}</h5>
            <h6 class="card-subtitle mb-2 text-dark-emphasis">Author : ${escapeHtml(book.author)}</h6>
            <h6 class="card-subtitle mb-2 text-dark-emphasis">${book.year}</h6>
          </div>
        </div>
      </div>
    `;
  });
  return html;
};

// Function clearInput
const clearInput = () => {
  title.value = "";
  author.value = "";
  year.value = "";
};

// Function sortByAlphabet
const sortByAlphabet = (arr) => arr.filter((book) => book.title).sort((a, b) => a.title.localeCompare(b.title));
