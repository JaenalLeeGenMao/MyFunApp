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
var users = require('./controllers/users');
var helperFunctions = require('./helpers/helperFunctions');

//Grant access allowing both server and client to run in localhost
var allowCrossDomainMiddleWare = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', ['GET','PUT','POST','DELETE']);
  res.header('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}
app.use(allowCrossDomainMiddleWare);

// Uncomment the following lines to start logging requests to consoles.
app.use(morgan('combined'));
// app.get('/user/auth', function (req, res) {
//     // Set the content-type header so that the browser understands
//     //  the content of the response.
//     res.contentType('application/json');
//
//     // var people = [
//     //   { name: 'Dave', location: 'Atlanta' },
//     //   { name: 'Santa Claus', location: 'North Pole' },
//     //   { name: 'Man in the Moon', location: 'The Moon' }
//     // ];
//     var people = userModel.seed();
//
//     // Using response object send method to push the array back to browser
//     res.send(people);
// });

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

//Sending requiest to server to authorize the user
app.post('/user/auth', users.auth);

//Sending requiest to server to confirm user sessionId to be destroyed
app.get('/user/logout', helperFunctions.isAuthenticated, users.logout);

// serve video files.
app.use('/videos',express.static('videos'));
// serve client side code.
app.use('/',express.static('client'));

//Finally starting the listener
app.listen(configs.applicationPort, function () {
  console.log('Example app listening on port '+configs.applicationPort+'!');
});
