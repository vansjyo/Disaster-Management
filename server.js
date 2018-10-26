var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('express-flash');
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var busboy = require('connect-busboy');
var compression = require('compression');
var helmet = require('helmet');
var NodeGeocoder = require('node-geocoder');
var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCoij47a8-utP5nX1fe3rBf41FyESjAbWc', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();
var client = new ThingSpeakClient({server:'http://localhost:8000'});
var client = new ThingSpeakClient({useTimeoutMode:false}); // disable client timeout handling between update request per channel
var client = new ThingSpeakClient({updateTimeout:20000}); // set the timeout to 20s (Note: 15 seconds is the default value), the timeout value is in milliseconds
client.attachChannel(609181, { readKey:'YOJ725Q23K7K8MXJ'});

app.use(busboy());
app.use(compression());
app.use(helmet());


var configDB = require('./config/database.js');
mongoose.connect(configDB.url,{ useNewUrlParser: true });

app.use('/assets',express.static('assets'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.set('view engine', 'ejs');


// app.use('/', function(req, res){
// 	res.send('Our First Express program!');
// 	console.log(req.cookies);
// 	console.log('================');
// 	console.log(req.session);
// });

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Server running on port: ' + port);




