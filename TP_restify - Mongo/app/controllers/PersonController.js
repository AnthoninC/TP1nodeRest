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
    const Person2 = new Person({"id": 2,"firstname": "Paul","lastname": "Martin","books": [{"isbn": 2}]});
    person2.save(function (err, person2){
        if (err) return console.error(err);
    });

};

/**
 * Save book set
 */

exports.saveStorage = function () {

};

/*
* Retourne toute les peronnnes s'il n'y a pas de parametre
* sinon retourne la personne en fonction du parametre
*/
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
