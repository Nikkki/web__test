//This code requires mongoose node module
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    username:  String,
    email: String,
    phoneNum: String
});

var Subscriber = mongoose.model('Subscriber', {
    username:  String,
    email: String,
    phoneNum: String
});

exports.Subscriber = mongoose.model('Subscriber', Subscriber);


