let fs = require('fs'),
    BookModel = require(process.cwd() + "/app/models/Book.js"),
    PersonModel = require(process.cwd() + "/app/models/Person.js"),
    errs = require("restify-errors");

/**
 * Init book set.
 */

exports.initStorage = function () {
    let persons = PersonModel.loadPersons();
    console.log("Persons loaded: %j", persons);
};

/**
 * Save book set
 */

exports.saveStorage = function () {
    var data = BookModel.saveBooks();
    console.log("Data saved: %j", data);
};


exports.getPerson = function (req,res,next){
    if (req.params.id === undefined){
        PersonModel.getPersons(function(err, persons) {
            if (err) {
                return next(err);
            } else {
                res.json(200, persons);
                return next();
            }
        })
    }else{
        PersonModel.getPerson(req.params.id, function(err, person) {
            if(err) {
                return next(new errs.NotFoundError("Person "+ req.params.id + "est introuvable"));
            } else {
                res.json(200, person);
                return next();
            }
        }) 
    }
}