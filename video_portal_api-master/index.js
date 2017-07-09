//requiring NPM modeles
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connection;
var app = express();

db.on('error', console.error);

//requiring local modeles
var configs = require('./config');
var routes = require('./routes/routes');
var userModel = require('./models/users');
var helperFunctions = require('./helpers/helperFunctions');


// Uncomment the following lines to start logging requests to consoles.
app.use(morgan('combined'));
app.get('/', function (req, res) {
    // We want to set the content-type header so that the browser understands
    //  the content of the response.
    res.contentType('application/json');

    // Normally, the would probably come from a database, but we can cheat:
    // var people = [
    //   { name: 'Dave', location: 'Atlanta' },
    //   { name: 'Santa Claus', location: 'North Pole' },
    //   { name: 'Man in the Moon', location: 'The Moon' }
    // ];
    var people = userModel.seed();

    // Since the request is for a JSON representation of the people, we
    //  should JSON serialize them. The built-in JSON.stringify() function
    //  does that.
    // var peopleJSON = JSON.stringify(people.get());

    // Now, we can use the response object's send method to push that string
    //  of people JSON back to the browser in response to this request:
    res.send(people);
});
// parse application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json.
app.use(bodyParser.json());

//connedting to mongoDB
mongoose.connect('mongodb://'+configs.dbHost+'/'+configs.dbName);
//populating data if DB is not already populated.
helperFunctions.populateDb();

//Initilizing routes.
routes(app);

// serve video files.
app.use('/videos',express.static('videos'));
// serve client side code.
app.use('/',express.static('client'));

//Finally starting the listener
app.listen(configs.applicationPort, function () {
  console.log('Example app listening on port '+configs.applicationPort+'!');
});
