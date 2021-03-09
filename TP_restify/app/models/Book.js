let errs = require("restify-errors");

let fs = require('fs'),
    PersonModel = require(process.cwd() + "/app/models/Person.js");

// global book array
let books = []

/**
 * Book cst
 */
exports.Book = function Book(isbn, title, authors, price) {
    this.isbn = isbn;
    this.title = title;
    this.authors = authors;
    this.price = price;

    this.toString = function() {
        return this.isbn + ", " + this.title + ", " + this.authors + ", " + this.price;
    }
};

/**
 * Init a Book object array
 *
 * @param data data to construct Book object
 */
exports.loadBooks = function () {
    if (fs.existsSync('data/books.json')) {
        books = JSON.parse(fs.readFileSync("data/books.json"));
    }
    return books;
};

/**
 * Save a Book object array
 */
exports.saveBooks = function () {
    fs.writeFileSync("books.json", JSON.stringify(books));
    return books;
};

function alreadyExist(book){
    for(var i= 0; i < books.length; i++){
        if(JSON.stringify(books[i]) == JSON.stringify(book)){
            return true;
        }
    }
    return false;
}

function alreadyExistByIsbn(idBook){
    for(var i= 0; i < books.length; i++){
        if(books[i].isbn == idBook) {
            return true;
        }
    }
    return false;
}
function setTitleBook(isbn,value){
    books.forEach(element => {
        if(element.isbn== isbn){
            element.title = value;
        }
    });
}

function setPriceBook(isbn,value){
    books.forEach(element => {
        if(element.isbn== isbn){
            element.price = value;
        }
    });
}

/**
 * Get all Book objects
 */
exports.getBooks = function (callback) {
    callback(null,books);
};

exports.getBook = function(isbn,callback) {
    var book = null;
    for(var i= 0; i < books.length; i++){
        if(books[i].isbn == isbn){
            book = books[i];
        }
    }
    if(book == null){
        callback(new Error("Impossible de trouver le livre :"+ isbn),book)
    }else{
        callback(null, book);
    }
};

exports.postBook = function(book, callback){
    if(!alreadyExist(book)){
        books.push(book);
        callback(null,book);
    }else{
        callback(new Error("Le livre existe deja"),book)
    }
}

exports.putBook = function(isbn, paramBook, callback){

    if(!alreadyExistByIsbn(isbn)){
        callback(new errs.NotFoundError("Book "+isbn+" introuvable"))
    }else {
        if(paramBook.title != null){
            setTitleBook(isbn, paramBook.title);
        }
        if(paramBook.price != null){
            setPriceBook(isbn, paramBook.price)
        }
        var book = null;
        books.forEach(element => {
            if(element.isbn == isbn){
                book = element
            }
        });
        callback(null, book);
    }
}

exports.delBook = function(isbn,callback){
    if(alreadyExistByIsbn(isbn)){
        var book;
       for(var i = 0; i < books.length; i++){
           if(books[i].isbn == isbn){
               book = books[i];
               books.splice(i,1);
           }
       }
        callback(null, book)
    }else{
        callback(new Error("Le livre n'existe pas"),isbn)
    }
}

exports.getAuthorsV1 = function(isbn,callback){
    var authors = [];
    var bookfind = false;
    books.forEach(bookElement => {
        if(bookElement.isbn == isbn){
            bookfind = true
            bookElement.authors.forEach(listAuthorselement => {
                authors.push(listAuthorselement)
            });
        }
    })
    if(bookfind == true){
        callback(null, authors)
    }else {
        callback(new errs.NotFoundError("Book "+ req.params.isbn+" introuvable"))
    }
    
}

exports.getAuthorsV2 = function(isbn,callback){
    var idAuthors = [];
    var bookfind = false;
    books.forEach(bookElement => {
        if(bookElement.isbn == isbn){
            bookfind = true
            bookElement.authors.forEach(listAuthorselement => {
                idAuthors.push(listAuthorselement.id)
            });
        }
    })
    if(bookfind == true){
        callback(null, idAuthors)
    }else {
        callback(new errs.NotFoundError("Book "+ req.params.isbn+" introuvable"))
    }
    
}