let restify = require('restify'),
    errs = require('restify-errors'),
    fs = require('fs');
    mongoose = require('mongoose');

// To activate controllers
let controllers = {}
    , controllers_path = process.cwd() + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') !== -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
});

// helper function
exports.getServer = function() {
    return server;
};

// server creation
var server = restify.createServer();

// server configuration
server.use(restify.plugins.bodyParser());  // needed for body request parsing
server.use(restify.plugins.queryParser()); // needed for query parameter request parsing

// route configuration
server.get("/api/book", controllers.BookController.getBookV1);
server.get("/api/book/:isbn",restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: controllers.BookController.getBookV1},
    { version: '2.0.0', handler: controllers.BookController.getBookV2}
  ]));
server.post("/api/book",controllers.BookController.postBook);
server.put("/api/book/:isbn",controllers.BookController.putBook);
server.del("/api/book/:isbn", controllers.BookController.delBook);
server.get("/api/book/:isbn/author",restify.plugins.conditionalHandler([
    { version: '1.0.0', handler: controllers.BookController.getAuthorsV1 },
    { version: '2.0.0', handler: controllers.BookController.getAuthorsV2 }
  ]));

server.get("/api/person",controllers.PersonController.getPerson)
//server.get("/api/person/:id",controllers.PersonController.getPerson)
server.get({name: 'author', path: '/api/person/:id'},controllers.PersonController.getPerson);


var port = process.env.PORT || 3000;

server.listen(port, function (err) {
    if (err)
        console.error(err)
    else {
        mongoose.connect('mongodb://localhost:/books', {useNewUrlParser: true, useUnifiedTopology: true});
        // pseudo persistence : load data from JSON files
        controllers.PersonController.initStorage(function(erre){
            controllers.BookController.initStorage(function(err){
                console.log('App is ready at : ' + port);
            });
        });
    }
});

process.on('SIGINT', function () {
    // pseudo persistence : backup current data into JSON files
    controllers.BookController.saveStorage(function(err)
    {
        controllers.PersonController.saveStorage(function(err)
        {
            mongoose.disconnect(function()
            {
                console.log("Connection close");
                console.log("App shutdown");
                process.exit(0);
            });
        });
    });
});

