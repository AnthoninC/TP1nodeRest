    errs = require("restify-errors");

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

exports.putBook = function(callback){

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