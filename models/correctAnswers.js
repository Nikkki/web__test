//This code requires mongoose node module
var mongoose = require('mongoose');

var Answers = mongoose.Schema({
    kind:  String,  /*kind of test: with checkboxes or radios*/
    correctAnswers: Array,
    _id: String
});

var correctAnswers = mongoose.model('correctAnswers', Answers);

exports.correctAnswers  = mongoose.model('correctAnswers', correctAnswers);