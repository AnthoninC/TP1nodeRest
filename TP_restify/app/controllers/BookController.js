let fs = require('fs'),
    BookModel = require(process.cwd() + "/app/models/Book.js"),
    PersonModel = require(process.cwd() + "/app/models/Person.js"),
    Server = require(process.cwd() + "/app/core/router.js"),
    errs = require("restify-errors");

/**
 * Init book set.
 */
exports.initStorage = function () {
    let books = BookModel.loadBooks();
    console.log("Books loaded: %j", books);
};

/**
 * Save book set
 */
exports.saveStorage = function () {
    var data = BookModel.saveBooks();
    console.log("Data saved: %j", data);
}

function checkBodyTobook(body) {
    if(body.isbn !== undefined){
        if(body.title !== undefined){
            if(body.price !== undefined){
                if(body.authors !== undefined){
                    return true; }
                return false; }
            return false; }
        return false; }  
    return false;
}
/**
 * Returns the specified book (if exists) or all books if isbn is not provided.
 */
exports.getBookV1 = function (req, res, next) {
    if (req.params.isbn === undefined){
        BookModel.getBooks(function(err, books) {
            if (err) {
                return next(err);
            } else {
                res.json(200, books);
                return next();
            }
        })
    }
    else{
        BookModel.getBook(req.params.isbn, function(err, book) {
            if(err) {
                return next(new errs.NotFoundError("Book "+ req.params.isbn + "est introuvable"));
            } else {
                res.json(200, book);
                return next();
            }
        }) 
    }
}

exports.getBookV2 = function (req, res, next) {
    if (req.params.isbn === undefined){
        BookModel.getBooks(function(err, books) {
            if (err) {
                return next(err);
            } else {
                res.json(200, books);
                return next();
            }
        })
    }
    else{
        BookModel.getBook(req.params.isbn, function(err, book) {
            if(err) {
                return next(new errs.NotFoundError("Book "+ req.params.isbn + "est introuvable"));
            } else {
                res.json(200,books);
                return next();
            }
        }) 
    }
}


exports.postBook = function(req, res, next){
    if (!checkBodyTobook(req.body)){
        return next(errs.UnprocessableEntityError+ "Impossblie de parse la donnée");
    }
    BookModel.postBook(req.body, function(err, book) {
        if(err) {
            //le livre existe deja
            return next(new errs.ConflictError("Book " + req.params.isbn+" already exist"))
        } else {
            //mise a jour de la liste des books des auteurs
            req.body.authors.forEach(element => {
                PersonModel.getPerson(element, function(erre, person)
                {
                    if(person !== null )
                        person.books.push(book.isbn);                        
                    else
                        return next(errs.NotFoundError("Person "+ element +" Not found"));
                    
                    })
            });
            res.json(201, book)
            return next()
        }
    })
}


exports.putBook = function(req, res, next){
    BookModel.putBook(req.params.isbn,req.body, function(err, book) {
        if(err) {
            return next(err);
        } else {
            res.json(200, book);
            return next();
        }
    }) 
}  

exports.delBook = function(req, res, next){
    BookModel.delBook(req.params.isbn, function(err,book){
        if(err) {
            return next(new errs.NotFoundError("Book "+ req.params.isbn+" introuvable"));
        } else {
            res.json(200, book);
            return next();
        }
    })
}

exports.getAuthorsV1 = function(req,res,next){
    BookModel.getAuthorsV1(req.params.isbn, function(err, authors){
        if(err){
            return next(err);
        }else{
            res.json(200,authors)
            return next();
        }
    })
}

exports.getAuthorsV2 = function(req,res,next){
    BookModel.getAuthorsV2(req.params.isbn, function(err, idAuthors){
        if(err){
            return next(err);
        }else{
            var authorsBack = []
            PersonModel.getListPersons().forEach(person => {
                idAuthors.forEach(idAuthor => {
                    if(idAuthor == person.id){
                        authorsBack.push(person)
                    }
                });
            });
            res.json(200,authorsBack)
            return next();
        }
    })
}
;
