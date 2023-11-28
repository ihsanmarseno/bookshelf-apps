document.addEventListener('DOMContentLoaded', function () {
  const inputBookForm = document.getElementById('inputBook');
  const searchBookForm = document.getElementById('searchBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  // Load books from localStorage on page load
  loadBooks();

  inputBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
  });

  searchBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      searchBook();
  });

  function addBook() {
      const title = document.getElementById('inputBookTitle').value;
      const author = document.getElementById('inputBookAuthor').value;
      const year = parseInt(document.getElementById('inputBookYear').value, 10); // Convert year to number
      const isComplete = document.getElementById('inputBookIsComplete').checked;

      const id = new Date().getTime(); // Generating a unique id using current timestamp

      const bookItem = createBookItem(id, title, author, year, isComplete);
      if (isComplete) {
          completeBookshelfList.appendChild(bookItem);
      } else {
          incompleteBookshelfList.appendChild(bookItem);
      }

      // Save books to localStorage after adding a new book
      saveBooks();

      resetInputForm();
  }

  function createBookItem(id, title, author, year, isComplete) {
      const bookItem = document.createElement('article');
      bookItem.classList.add('book_item');

      const bookTitle = document.createElement('h3');
      bookTitle.innerText = title;

      const bookAuthor = document.createElement('p');
      bookAuthor.innerText = `Penulis: ${author}`;

      const bookYear = document.createElement('p');
      bookYear.innerText = `Tahun: ${year}`;

      const actionDiv = document.createElement('div');
      actionDiv.classList.add('action');

      const actionButton = document.createElement('button');
      actionButton.innerText = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
      actionButton.classList.add('green');
      actionButton.addEventListener('click', function () {
          toggleBookStatus(id, isComplete);
      });

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Hapus buku';
      deleteButton.classList.add('red');
      deleteButton.addEventListener('click', function () {
          deleteBook(id);
      });

      actionDiv.appendChild(actionButton);
      actionDiv.appendChild(deleteButton);

      bookItem.appendChild(bookTitle);
      bookItem.appendChild(bookAuthor);
      bookItem.appendChild(bookYear);
      bookItem.appendChild(actionDiv);

      // Menyimpan informasi penulis sebagai data atribut pada elemen
      bookItem.setAttribute('data-author', author);
      // Menyimpan id sebagai data atribut pada elemen
      bookItem.setAttribute('data-id', id);

      return bookItem;
  }

  function toggleBookStatus(id, isComplete) {
      const bookItem = document.querySelector(`[data-id='${id}']`);
      const author = bookItem.getAttribute('data-author');
      const year = bookItem.querySelector('p:nth-child(3)').innerText.split(': ')[1];

      // Hapus buku dari rak asal
      bookItem.parentNode.removeChild(bookItem);

      // Tambahkan buku ke rak yang sesuai
      const newIsComplete = !isComplete;
      const newBookItem = createBookItem(id, bookItem.querySelector('h3').innerText, author, year, newIsComplete);
      if (newIsComplete) {
          completeBookshelfList.appendChild(newBookItem);
      } else {
          incompleteBookshelfList.appendChild(newBookItem);
      }

      // Save books to localStorage after toggling book status
      saveBooks();
  }

  function deleteBook(id) {
      const bookItem = document.querySelector(`[data-id='${id}']`);

      // Hapus buku dari rak
      bookItem.parentNode.removeChild(bookItem);

      // Save books to localStorage after deleting a book
      saveBooks();
  }

  function searchBook() {
      const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();

      const allBooks = document.querySelectorAll('.book_item');
      allBooks.forEach(function (bookItem) {
          const title = bookItem.querySelector('h3').innerText.toLowerCase();
          if (title.includes(searchTitle)) {
              bookItem.style.display = 'block';
          } else {
              bookItem.style.display = 'none';
          }
      });
  }

  function resetInputForm() {
      inputBookForm.reset();
  }

  function saveBooks() {
      // Get all book items and convert them to an array
      const allBooks = Array.from(document.querySelectorAll('.book_item'));

      // Map each book item to an object representing a book
      const booksData = allBooks.map(bookItem => {
          const id = bookItem.getAttribute('data-id');
          const title = bookItem.querySelector('h3').innerText;
          const author = bookItem.getAttribute('data-author');
          const year = parseInt(bookItem.querySelector('p:nth-child(3)').innerText.split(': ')[1], 10); // Convert year to number
          const isComplete = bookItem.querySelector('button').innerText === 'Belum selesai dibaca';
          return { id, title, author, year, isComplete };
      });

      // Save the books data to localStorage as a JSON string
      localStorage.setItem('books', JSON.stringify(booksData));
  }

  function loadBooks() {
      // Get the books data from localStorage
      const booksData = localStorage.getItem('books');

      // If there are saved books, parse the JSON string and display them
      if (booksData) {
          const books = JSON.parse(booksData);

          books.forEach(book => {
              const { id, title, author, year, isComplete } = book;
              const bookItem = createBookItem(id, title, author, year, isComplete);
              if (isComplete) {
                  completeBookshelfList.appendChild(bookItem);
              } else {
                  incompleteBookshelfList.appendChild(bookItem);
              }
          });
      }
  }
});
