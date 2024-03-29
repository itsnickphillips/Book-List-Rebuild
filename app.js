// Book Class: Represents a book
class Book {
  constructor(title, author, genre) {
    this.title = title;
    this.author = author;
    this.genre = genre;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book))
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td> `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    //Vanish in 2.5 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2500);
  }


  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#genre').value = '';
  }

}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

  }

  static removeBook(genre) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.genre = genre) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));

  }

}
// Event: Display Books
document.addEventListener('DomContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  //Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const genre = document.querySelector('#genre').value;

  // Validate
  if (title === "" || author === "" || genre === "") {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate book
    const book = new Book(title, author, genre);

    // Add Book to UI
    UI.addBookToList(book);

    // Add Book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    //Clear fields
    UI.clearFields();
  }
});

//Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {

  //Remove Book from UI
  UI.deleteBook(e.target);

  //Remove Book from Storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show success message
  UI.showAlert('Book Removed', 'success')

});

