//This code requires mongoose node module
var mongoose = require('mongoose');

var simpleTests = mongoose.Schema({
    text:  String,
    answers: Array,
    amountOfDiagrams: Number,
    kind: String,    /*kind of test: with checkboxes or radios*/
    callback: Array

});

var testPHP = mongoose.model('testPHP', simpleTests);

exports.testPHP  = mongoose.model('testPHP', testPHP);
