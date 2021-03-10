let fs = require('fs'),
    Server = require(process.cwd() + "/app/core/router.js"),
    errs = require("restify-errors"),
    mongoose = require('mongoose');

    const BookSchema = new mongoose.Schema({
        isbn: String,
        title: String,
        price: Number, 
        authors: [Number]
    }); 

    const Book = mongoose.model('Book', BookSchema);

/**
 * Init book set.
 */
exports.initStorage = function (next) {

    const book1 = new Book({ "isbn": "ZT56","title": "Essai","authors": [{"id": 1},{"id": 2}],"price": 12.4});    
    book1.save(function (err, book1){
        if (err) return console.error(err);
    });

    const book2 = new Book({ "isbn": "ZT57","title": "Roman","authors": [{"id": 2}],"price": 8});
    book1.save(function (err, book2){
        if (err) return console.error(err);
    });

};

/**
 * Save book set
 */
exports.saveStorage = function () {
    //var data = BookModel.saveBooks();
    //console.log("Data saved: %j", data);
}

/*
* Verifie que le parametre a bien la structure d'un book
*/
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
        res.json(200, Book.find({}));
        return next();
    }else{
        var isbn = req.param.isbn;
        bookRetour = Book.find({isbn}).exec();
        if(bookRetour == null){
            return next(new errs.NotFoundError("Book "+ req.params.isbn + "est introuvable"));
        } else {
            res.json(200, bookRetour);
            return next();
        }
        }) 
    }
}

/*
* Retourne les livres ou un livre au format hypermedia
*/
exports.getBookV2 = function (req, res, next) {
    if (req.params.isbn === undefined){
                res.json(200, Book.find({}));
                return next();
    }else{
        var isbn = req.param.isbn
        bookRetour = Book.find({isbn}).exec();
            if(bookRetour == null) {
                return next(new errs.NotFoundError("Book "+ req.params.isbn + "est introuvable"));
            } else {
                var bookHypermedia = {
                    isbn: bookRetour.isbn,
                    title: bookRetour.title,                    
                    price: bookRetour.price,
                    authors : []
                }
                bookRetour.authors.forEach(element => {
                    bookHypermedia.authors.push({
                        id: element.id,
                        authorLink : Server.getServer().router.render('author', {id:element.id},{})  
                    });
                });

                res.json(200,bookHypermedia);
                return next();
            }
    }
}

/*
 * Permet la création d'un book 
 */
exports.postBook = function(req, res, next){
    if (!checkBodyTobook(req.body)){
        return next(errs.UnprocessableEntityError+ "Impossblie de parse la donnée");
    }
        var isbn = req.boby.isbn
        bookRetour = Book.find({isbn}).exec();
        if(bookRetour != null) {
            //le livre existe deja
            return next(new errs.ConflictError("Book " + req.params.isbn+" already exist"))
        } else {
            Book.post(req.body, function(err) {});
            res.json(201, req.body)
            return next()
        }
    })
}

/*
* Modification d'un book 
*/
exports.putBook = function(req, res, next){
    var isbn = req.param.isbn
    bookRetour = Book.find({isbn}).exec();
    if(bookRetour != null) {
        return next(err);
    } else {
        Book.put(req.body, function(err) {});
        res.json(200, book);
        return next();
        } 
}  

/*
 * Suppression d'un book 
 */
exports.delBook = function(req, res, next){
        var isbn = req.boby.isbn
        bookRetour = Book.find({isbn}).exec();
        if(bookRetour == null) {
            return next(new errs.NotFoundError("Book "+ req.params.isbn+" introuvable"));
        } else {
            Book.delete(req.param.isbn, function(err){});
            res.json(200, bookRetour);
            return next();
        }
}

/*
 *  retourne la liste des id des auteurs d'un book 
 */
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

/*
*  retourne la liste des auteurs d'un book 
*/
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

