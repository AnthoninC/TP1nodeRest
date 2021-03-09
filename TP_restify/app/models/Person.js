let fs = require('fs');

// global person array
let persons = []

/**
 * Person cst
 */
exports.Person = function Person(id, firstname, lastname, books) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.books = books;

    this.toString = function() {
        return this.id + ", " + this.firstname + ", " + this.lastname + ", " + this.books;
    }
};

exports.getListPersons = function(){
    return persons;
}

/**
 * Init a Person object array
 *
 * @param data to construct Person object
 */
exports.loadPersons = function () {
    if (fs.existsSync('data/persons.json')) {
        persons = JSON.parse(fs.readFileSync("data/persons.json"));
    }
    return persons;
};

/**
 * Save a Person object array
 */
exports.savePersons = function () {
    fs.writeFileSync("data/persons.json", JSON.stringify(persons));
    return persons;
};

exports.getPersons = function(callback){
    callback(null, persons)
}

exports.getPerson = function (id, callback){
    var person = null;
    persons.forEach(element => {
        if(element.id == id){
            person = element;
        }
    })
    if(person == null){
        callback(new Error("Impossible de trouver la personne :"+id),person)
    }else{
        callback(null,person);
    }
}