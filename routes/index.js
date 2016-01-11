var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var Validator = require('./../public/javascripts/controller/validateForms');
var SubscriberDB = require('../models/subscriber').Subscriber;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/COURSES');


 //GET home page
router.get('/', function(req, res, next) {
  res.sendFile('/../dist/index.html');
});
//POSt form validation
router.post('/subscribe', function(req, res) {
    var subscriber = req.body;

    var validator = new Validator({
        username: ['isNonEmpty', 'isAlpha'],
        email: ['isNonEmpty', 'isEmail'],
        phoneNum: ['isNonEmpty','isPhoneUA']
    });

    validator.validate(subscriber);
    console.log(validator.errors);

    if (validator.errors.length > 0) {
        res.sendStatus(400);

    } else {
        res.sendStatus(200);
        console.log(subscriber.username);
        var subscriberDB = new SubscriberDB({
            username: subscriber.username,
            phoneNum: subscriber.phoneNum,
            email: subscriber.email
        });
        subscriberDB.save(function (err, subscriberDB) {
            if(err) throw err;
        });

        res.end();
    }



    //res.sendFile(path.resolve('dist/index.html'));
    //var username = req.body.username;
    //var phoneNum = req.body.phoneNum;
  	//var email = req.body.email;
    //
    //var data = function(){
    //    return 'Имя - ' + username + '\n'
    //        + 'Номер телефона - ' + phoneNum + '\n'
    //        + 'Email - ' + email + '\n'
    //        + '--------------------' + '\n';
    //}
    //
    //JSON.stringify(data());
    //
    //fs.appendFile(path.resolve('registration.txt'), data(), function(err) {
    //    if(err) {
    //        console.log(err);
    //    } else {
    //        console.log("Файл сохранен.");
    //    }
    //});
});




module.exports = router;
