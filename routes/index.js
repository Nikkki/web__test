var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var Validator = require('./../public/javascripts/controller/validateForms');
var SubscriberDB = require('../models/subscriber').Subscriber;
//var geolocation = require('geolocation');
var sendmail = require('sendmail')();
useragent = require('express-useragent');

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


    if (validator.errors.length > 0) {
        res.sendStatus(400);

    } else {
        res.sendStatus(200);
        //console.log(req.navigator.userAgent);
        var subscriberDB = new SubscriberDB({
            username: subscriber.username,
            phoneNum: subscriber.phoneNum,
            email: subscriber.email,
            ip: subscriber.ip,
            city: subscriber.city,
            country: subscriber.country,
            update: subscriber.update
        });
        /*saving in DB*/
        subscriberDB.save(function (err, subscriberDB) {
            if(err) throw err;
        });
        /*END saving in DB*/

        /*---USer Agent---*/
        var source = req.headers['user-agent'],
            userAgent = useragent.parse(source);
        /*---USER Agent end-----*/


        /*----------sending on email -------------*/
        sendmail({
            from: subscriber.email,
            to: 'nikita.nesterchuk@yandex.ru',
            subject: 'Заявка на PHP/JS обучение с edu.apibest.com',
            content: 'Здравствуйте,' + '\n'+
                'поступила заявка на обучение.' + '\n'+'\n'+
                'Имя = ' +  subscriber.username + '\n'+ge
                'Телефон = ' + subscriber.phoneNum + '\n'+
                'Email = ' + subscriber.email + '\n' +
                'ip = ' + subscriber.ip + '\n' +
                'city = ' + subscriber.city + '\n' +
                'country = ' + subscriber.country + '\n' +
                'userAgent: ' + JSON.stringify(userAgent.source) + '\n'
        }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
        /* -----------END sending on email ---------*/

        res.end();
    }
});




module.exports = router;
