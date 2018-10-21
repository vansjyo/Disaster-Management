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
var series = require('run-series')
var app= express();


module.exports = function(app, passport){


//#1
app.get('/autocomplete/:search/:categ',autocomplete.find);

//#3
app.get('/Found', function(req, res){
    res.render('Found.ejs', { Found : req.Found , head : head , slide : slide });
});

app.get('/', function(req, res){
  res.render('home.ejs');
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
    missing_photo: req.body.m_photo,
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
    found_photo: req.body.f_photo,
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


//#13*
app.post('/orderslist', isLoggedIn, function(req, res){
  console.log(req.body.order_id);
  console.log(req.body.order_status);
  console.log(req.body.order_email);
  Orders.findOne({ order_id : req.body.order_id }, function(err, result){
    if(result == null){
      req.flash('error','No order found. Some error');
    }
    result.status = req.body.order_status;
    if(req.body.order_status == "cancelled" || req.body.order_status == "delivered"){
      Found.findOne({'local.email' : req.body.order_email}, function(err, Found){
        console.log(Found);
        console.log(result);
        for(var i=0;i< result.orderList.length; i++){
          Found.local.orderList.unshift({order_id : result.order_id , no: result.orderList[i].no , item: result.orderList[i].item , quantity: result.orderList[i].quantity , price: result.orderList[i].price, amount: result.amount , status: req.body.order_status });         
        }
        Found.save(function(err){
          if(err) throw err;
        });
      });
    }
    result.save(function(err){
      if(err)
        throw err;
    });
  });
  
  res.redirect('/orderslist');   
}); 


//#14*
app.post('/itemslist', isLoggedIn, function(req, res , done){
  Items.findOne({ item_no: req.body.item_no },function(err,result){
    if(err) throw err;
    if(result == null){
      console.log("no item found");
      req.flash('error','no item with this item No. exists in the database');
      res.redirect('/itemslist');
    }
    else{
      result.item_name = req.body.item_name;
      result.item_price = req.body.item_price;
      result.item_quantity = req.body.item_quantity;
      result.item_defect = req.body.item_defect;
      result.item_category = req.body.item_category;
      result.item_sales = req.body.item_sales;
      var obj = {
        change_name : req.body.item_name,
        change_price : req.body.item_price,
        change_quantity : req.body.item_quantity,
        change_defect : req.body.item_defect,
        change_sales : req.body.item_sales,
        change_category : req.body.item_category,
        change_remark : req.body.item_change,
        change_Foundid : req.Found.local.email,
        change_time : new Date()};
        result.item_changes.push(obj);
        result.save(function(err){
          if(err)
            throw err;
          console.log("im saving");
        }); 
        req.flash('info','item has been edited');
        res.redirect('/deletestaff');
      }
    });
});


//#19*
app.post('/for_sale_upload', isLoggedIn, function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req , function(err, fields, files){
    if(err) throw err;
    var oldpath = files.sale.path;
    var path = require('path');
    __parentDir = path.dirname(process.mainModule.filename);
    var newpath = __parentDir + '/assets/images/sale/' + files.sale.name;
    console.log(newpath);
    fs.rename(oldpath, newpath, function(err){
      if (err) throw err;
    });
    var item = new Sale_Items({
      sale_url: '/assets/images/sale/' + files.sale.name
    });
    item.save(function(err){
      if(err) throw err; 
    });
    console.log('File uploaded and moved!');
    req.flash('info','image uploaded . Enter other details.');
    res.render('for_sale',{ sale_id : item._id });
  });
});


//#20*
app.post('/for_sale', isLoggedIn, function(req, res) {
  console.log(req.body.sale_id);
  Sale_Items.findOne({ _id : req.body.sale_id }, function(err,result){
    result.sale_owner= req.Found.local.email;
    result.sale_date=new Date();
    result.sale_contact=req.Found.local.telephone;
    result.sale_name=req.body.sale_name;
    result.sale_price=req.body.sale_price;
    result.sale_quantity=req.body.sale_quantity;
    result.sale_dop=req.body.sale_Date_OP;
    result.sale_category=req.body.sale_category;
    result.sale_type=req.body.sale_type;
    result.sale_status=1;
    result.save(function(err){
      if ( err ) throw err;
      console.log("Sale Saved Successfully");
    });
    console.log('going on peacefully');
    req.flash('info','item put for sale successfully.');
    res.redirect('/categories');

  })
});

// //#21*
// app.post('/track_order', isLoggedIn, function(req, res) {
//   console.log(req.body);
//   Orders.findOne({ order_id : req.body.order_id } , function(err,result){
//     console.log(result);
//     if(err) throw err;
//     if(result == null){ req.flash('error','no such order id exists'); }
//     else{
//       Items.findOne({ item_no : req.body.item_no }, function(errr,item){
//         item.item_sales -= req.body.item_quantity;
//         item.save(function(err){
//           if(err) throw err;
//           console.log("item removed from sales");
//         }); 
//       });
//       for(var i=0; i<result.orderList.length; i++ ){
//         if(result.orderList[i].no == req.body.item_no){
//           if(result.orderList.length == 1)
//             result.status = "cancelled";
//           result.amount = result.amount - result.orderList[i].price*result.orderList[i].quantity;
//           result.orderList.splice(i,1);
//           result.save(function(err){
//            if(err) throw err;
//          });
//           req.flash('info','your order has been cancelled');
//         }
//       }
//       function getchange(list , done) {
//         console.log(list);
//         var iteratorFcn = function(list, done) {
//           if(list.order_id == req.body.order_id && list.no == req.body.item_no){
//             console.log("condition matched");
//             list.status = "cancelled";
//             console.log(list);
//             console.log(list.status);
//           }
//           return done(null,list);
//         };

//         var doneIteratingFcn = function(err) {
//           if(err) throw err;
//           req.Found.save(function(err){
//             if(err) throw err;
//             console.log("status of Found history changed");
//           });
//           console.log(req.Found.local.orderList);
//           done(null,'done');
//         };
//     // iteratorFcn will be called for each element in cart.
//     async.forEach( list , iteratorFcn, doneIteratingFcn);
//   }
//   getchange(req.Found.local.orderList , function(err) {
//     if(err) {
//       throw err;
//     }
//     req.Found.save(function(err){
//       if(err) throw err;
//       console.log("cancellung saved");
//       console.log(req.Found.local.orderList);
//     });
//     req.flash('info','order cancelled successfully.');
//   });
//   console.log("im here outside now");
//   console.log(req.Found.local.orderList);
//   req.Found.save(function(err){
//    if(err) throw err;
//   });
//   res.redirect('/track_order');
// }
// });
// });

//#21*
app.post('/track_order', isLoggedIn, function(req, res) {
  console.log(req.body);
  Orders.findOne({ order_id : req.body.order_id } , function(err,result){
    console.log(result);
    if(err) throw err;
    if(result == null){ req.flash('error','no such order id exists'); }
    else{
      async.parallel([
        function (callback) {
    //function getchange(list , done) {
      var iteratorFcn = function(list, done) {
        if(list.order_id == req.body.order_id && list.no == req.body.item_no){
          console.log("condition matched");
          list.status = "cancelled";
          req.Found.markModified('local.orderList');
          req.Found.save(function(err){
            if(err) throw err;
            console.log("status of Found history changed");
            done(null,'done');
          });
        }
      };

      var doneIteratingFcn = function(err) {
        if(err) throw err;
        req.flash('info','order cancelled successfully.');
      };
    // iteratorFcn will be called for each element in cart.
    async.forEach( req.Found.local.orderList , iteratorFcn, doneIteratingFcn);
    callback(null,'three');
    
  },
  function (callback) {

   var iteratorFcn = function(item,done){
    if(item.no == req.body.item_no){
      if(result.orderList.length == 1)
        result.status = "cancelled";
      result.amount = result.amount - item.price*item.quantity;
      item.status = "cancelled";
          // result.orderList.splice(i,1);
          result.save(function(err){
           if(err) throw err;
           console.log("order changed");
           req.flash('info','your order has been cancelled');
           done(null,'done');
         });
        }
      };


      async.forEach(result.orderList , iteratorFcn , function(err){ if(err) throw err; console.log("order modiied")});

      
    // do some stuff ...
    callback(null, 'two');
  },
  function(callback){
    Items.findOne({ item_no : req.body.item_no }, function(err,item){
      item.item_sales -= req.body.item_quantity;
      item.save(function(err){
        if(err) throw err;
        console.log("item removed from sales");
      }); 
    });
    callback(null, 'one');
    // do some stuff ...
    // callback(null, 'one');
  }
  ],
// optional callback
function (err, results) {
  // the results array will equal ['one','two']
  if (err) return next(err);
  res.redirect('/track_order');
});
    }
  });

});




};





function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');
}