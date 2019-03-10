// BookCLass 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// ui class : waht shows us 
class UI {
    static displayBooks() {
        // const StoredBooks = [{
        //         title: 'B 3',
        //         author: 'N M',
        //         isbn: '2345'
        //     },
        //     {
        //         title: 'Bo1',
        //         author: 'J J',
        //         isbn: '234545'
        //     }
        // ];
        //  const books = StoredBooks;
        const books = Store.getBooks();
        // console.log(books[1]);
        books.forEach(el => UI.addBookToList(el));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>  ${book.title} </td>
                    <td>  ${book.author} </td>
                    <td>  ${book.isbn} </td>
                    <td> <a href="#" class="btn btn-danger btn-sm delete" >X<a/> </td>
                `;

        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {

        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 4000);
    }
    static deleteBook(targetbook) {
        if (targetbook.classList.contains('delete')) {


            targetbook.parentElement.parentElement.remove();
        }
    }
}

// store class : storage

class Store {

    //stringify before storing and parse
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

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {

            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        // reset local storage after removing 
        localStorage.setItem('books', JSON.stringify(books));

    }
}

// events: showBookds
document.addEventListener('DOMContentLoaded', UI.displayBooks);
/// event : Add Book 

document.querySelector('#book-form').addEventListener('submit', (e) => {
    // prevent submit
    e.preventDefault();

    // get form vlaues
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    // validate
    if (title === '' || author === '' || isbn === '') {

        UI.showAlert('Please enter all the fields', 'danger');

    } else {
        // instatiate book 
        const book = new Book(title, author, isbn);
        // console.log(book)


        // add book to UI
        UI.addBookToList(book);

        //add book to localStorage
        Store.addBook(book);

        // show alert
        UI.showAlert('Book added', 'success');
        UI.clearFields();
    }

});

/// even remove book
//
document.querySelector('#book-list').addEventListener('click', (e) => {
    // delete book from UI
    UI.deleteBook(e.target);

    // delete book by isbn from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


    UI.showAlert('Book deleted', 'warning');
});