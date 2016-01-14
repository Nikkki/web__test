//This code requires mongoose node module
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    username:  String,
    email: String,
    phoneNum: String,
    city: String,
    ip: String,
    country:String,
    update: Date
});

var Subscriber = mongoose.model('Subscriber', schema);

exports.Subscriber = mongoose.model('Subscriber', Subscriber);


