let fs = require('fs'),
    errs = require("restify-errors");

    const PersonSchema = new moogoose.Schema({
        id: String,
        firstname : String,
        lastname : String,
        books:[BookSchema]
    });

    const Person = mongoose.model('Person', PersonSchema);

/**
 * Init book set.
 */
exports.initStorage = function () {

    const person1 = new Person({"id": 1,"firstname": "Pierre","lastname": "Durand","books": [{"isbn": 1},{"isbn": 2}]});
    person1.save(function (err, person1){
        if (err) return console.error(err);
    });
    const person2 = new Person({"id": 2,"firstname": "Paul","lastname": "Martin","books": [{"isbn": 2}]});
    person2.save(function (err, person2){
        if (err) return console.error(err);
    });

};

/**
 * Save book set
 */

exports.saveStorage = function () {
   // var data = BookModel.saveBooks();
   // console.log("Data saved: %j", data);
};

/*
* Retourne toute les peronnnes s'il n'y a pas de parametre
* sinon retourne la personne en fonction du parametre
*/
exports.getPerson = function (req,res,next){
    if (req.params.id === undefined){
        res.json(200, Person.find({}));
        return next();
    }else{
        var isbn = req.param.isbn;
        var personRetour = Person.find({isbn}).exec();
            if(bookRetour == null) {
                return next(new errs.NotFoundError("Person "+ req.params.id + "est introuvable"));
            } else {
                res.json(200, personRetour);
                return next();
            }
    }
}
