var Missing = require('./models/missing');
var Found = require('./models/found');
var flash = require('express-flash');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var busboy = require('connect-busboy');
var nodemailer = require('nodemailer');
var express= require('express');
const SendOtp = require('sendotp');
var autocomplete=require('../app/autocomplete.js');
var formidable = require('formidable');
var series = require('run-series');
var NodeGeocoder = require('node-geocoder');
// var options = {
//   provider: 'google',
 
//   // Optional depending on the providers
//   httpAdapter: 'https', // Default
//   apiKey: 'AIzaSyCoij47a8-utP5nX1fe3rBf41FyESjAbWc', // for Mapquest, OpenCage, Google Premier
//   formatter: null         // 'gpx', 'string', ...
// };
// var geocoder = NodeGeocoder(options);
// geocoder.geocode('120/345 lajpat nagar kanpur uttar pradesh india')
//   .then(function(res) {
//     console.log(res);
//   })
//   .catch(function(err) {
//     console.log(err);
//   });
// var app= express();


module.exports = function(app, passport){


//#1
app.get('/autocomplete/:search/:categ',autocomplete.find);

app.get('/', function(req, res){
  var reported= [];
  Found.find({ status:"found"},function(err, result) {
   if (err) throw err;
   reported = result;
   res.render('home.ejs', { people : reported });
 });
});

app.get('/avalanche', function(req, res){
  res.render('avalanche.ejs');
});

app.get('/blizzard', function(req, res){
  res.render('blizzard.ejs');
});

app.get('/cyclone', function(req, res){
  res.render('cyclone.ejs');
});

app.get('/earthquake', function(req, res){
  res.render('earthquake.ejs');
});

app.get('/flood', function(req, res){
  res.render('flood.ejs');
});

app.get('/guide', function(req, res){
  res.render('guide.ejs');
});

app.get('/landslide', function(req, res){
  res.render('landslide.ejs');
});

app.get('/tsunami', function(req, res){
  res.render('tsunami.ejs');
});

app.get('/volcano', function(req, res){
  res.render('volcano.ejs');
});

app.get('/report', function(req, res){
  res.render('report.ejs');
});



app.get('/reportMissing', function(req, res){
  res.render('reportMissing.ejs');
});

app.get('/reportFound', function(req, res){
  res.render('reportFound.ejs');
});

app.get('/find', function(req, res){
  res.render('find.ejs');
});

app.get('/findFound', function(req, res){
  var people_found= [];
  Found.find({ status:"found"},function(err, result) {
   if (err) throw err;
   people_found = result;
   res.render('findFound.ejs', { people_found : people_found });
 });
});

app.get('/findMissing', function(req, res){
  var people_missing = [];
  Missing.find({ status:"missing"},function(err, result) {
   if (err) throw err;
   people_missing = result;
   res.render('findMissing.ejs', { people_missing : people_missing });
 });
});

//#6
app.get('/profileFound/:id', function(req, res) {
 Found.findOne({ '_id': req.params.id }, function(err, user) {
  if(err) throw err;
  if (!user) {
   req.flash('error', 'No such entry exists in the database.');
   console.log("no entry in database for found");
   return res.redirect('/findFound');
 }
 res.render('profileFound', { profile_found : user });
});
});

//#6
app.get('/profileMissing/:id', function(req, res) {
 Missing.findOne({ '_id': req.params.id }, function(err, user) {
  if(err) throw err;
  if (!user) {
   req.flash('error', 'No such entry exists in the database.');
   console.log("no entry in database");
   return res.redirect('/findMissing');
 }
 res.render('profileMissing', { profile_missing : user });
});
});

//#4*
app.post('/reportMissing', function(req, res){
  var rand = Math.floor((Math.random()*1000)+1).toString();
  var id= req.body.r_contact1 + "@" + rand;
  var report = new Missing({
    reporter_ID: id,
    reporter_name : req.body.r_name,
    reporter_contact1: req.body.r_contact1,
    reporter_contact2: req.body.r_contact2,
    reporter_address: req.body.r_address,
    reporter_pincode: req.body.r_zip,
    reporter_relation: req.body.r_relation,
    reporter_email: req.body.r_email,
    missing_name: req.body.m_name,
    missing_contact: req.body.m_contact ,
    missing_address: req.body.m_address,
    missing_state: req.body.m_state,
    missing_city: req.body.m_city,
    missing_pincode: req.body.m_zip,
    missing_description: req.body.m_description,
    missing_date: req.body.m_date,
    missing_time: req.body.m_time,
    missing_location: req.body.m_location,
    missing_gender: req.body.m_gender,
    missing_age: req.body.m_age,
    missing_photo: "",
    status: "missing"
  });
  report.save(function(err){
    if ( err ) throw err;
    console.log("Missing person saved successfully");
  });
  req.flash('info', 'Missing person has been successfully added to the database');
  res.redirect('/upload_photo/' + "missing/" + report._id);

});

app.get('/upload_photo/:type/:id', function(req, res) {
 res.render('upload_photo');
});


app.post('/reportFound', function(req, res){
  var rand = Math.floor((Math.random()*1000)+1).toString();
  var id= req.body.r_contact1 + "@" + rand;
  var found = new Found({
    reporter_ID: id,
    reporter_name : req.body.rf_name,
    reporter_contact1: req.body.rf_contact1,
    reporter_contact2: req.body.rf_contact2,
    reporter_address: req.body.rf_address,
    reporter_email: req.body.rf_email,
    found_name: req.body.f_name,
    found_address: req.body.f_address,
    found_state: req.body.f_state,
    found_city: req.body.f_city,
    found_pincode: req.body.f_zip,
    found_description: req.body.f_description,
    found_date: req.body.f_date,
    found_location: req.body.f_location,
    found_gender: req.body.f_gender,
    found_age: req.body.f_age,
    found_photo: "",
    status: "found"
  });
  found.save(function(err){
    if ( err ) throw err;
    console.log("Found person saved successfully");
  });
  req.flash('info', 'Found person has been successfully added to the database');
  res.redirect('/upload_photo/' + "found/" + found._id);

});

app.post('/upload_photo/:type/:id', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req , function(err, fields, files){
    if(err) throw err;
    var oldpath = files.m_photo.path;
    var path = require('path');
    __parentDir = path.dirname(process.mainModule.filename);
    var newpath = __parentDir + '/assets/images/photos/' + req.params.type + "/" + files.m_photo.name ;
    console.log(newpath);
    fs.rename(oldpath, newpath, function(err){
      if (err) throw err;
    });
    if(req.params.type == "missing"){
      Missing.findOneAndUpdate({ _id : req.params.id }, function(err,result){
        if(err) throw err;
        result.missing_photo = '/assets/images/photos/' + req.params.type + "/" + files.m_photo.name;
      });
    }
    else{
      Found.findOneAndUpdate({ _id : req.params.id }, function(err,result){
        if(err) throw err;
        result.found_photo = '/assets/images/photos/' + req.params.type + "/" + files.m_photo.name;
      });
    }
    console.log('File uploaded and moved!');
    req.flash('info','image uploaded');
    res.render('report',);
  });
});

//#9
app.get('/admin', isLoggedIn, function(req, res){
  if(req.Found.local.admin == "owner"){
    res.render('admin.ejs', { Found: req.Found });}
    else res.end();
  });

//#20
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

};





function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');
}