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
