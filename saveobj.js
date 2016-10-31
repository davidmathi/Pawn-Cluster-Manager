//get the dockerfile
var stormpath=require('express-stormpath');
var paypal = require('paypal-rest-sdk');

//build the image

//

var express = require('express'),
    async = require("async"),
    router = express.Router(),
   
   // r = require("../../lib/request"),
    request=require("request");
//var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
//var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
//var url = 'mongodb://localhost:27017/pyCloud';
// ===
//var assert = require('assert');

//var rpi=[0,0];

router.get('/',function(req,res, next){
//console.log("inside");
res.render('home.jade');
});

router.get('/dashboard.jade',stormpath.loginRequired,function(req,res,next){
console.log("hit");
   res.render('dashboard.jade');
});

router.get('/paypal.jade',function(req,res){
         res.render('paypal.jade');
});


router.get('/success', function(req, res) {
  var payerId = req.param('PayerID');
 var paymentId = req.param('paymentId');
  var details = { "payer_id": payerId };
  paypal.payment.execute(paymentId, details, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
      console.log(payment);
res.redirect("http://localhost:8587/");
    }

});
});
 
// Page will display when you canceled the transaction 
router.get('/cancel', function(req, res) {
  res.send("Payment canceled successfully.");
});


router.post('/paynow',function(req,res){
var payment = {
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "redirect_urls": {
    "return_url": "http://localhost:8587/success",
    "cancel_url":"http://localhost:8587/"
  },
  "transactions": [{
    "amount": {
      "total":"100",
      "currency":  "USD"
    },
    "description": "Pawn Payment"
  }]
};

paypal.payment.create(payment, function (error, payment) {
  if (error) {
    console.log(error);
  } else {
    if(payment.payer.payment_method === 'paypal') {
      req.paymentId = payment.id;
      var redirectUrl;
      console.log(payment);
      for(var i=0; i < payment.links.length; i++) {
        var link = payment.links[i];
        if (link.method === 'REDIRECT') {
          redirectUrl = link.href;
        }
      }
      res.redirect(redirectUrl);

    }
  }
});


});
module.exports = router;