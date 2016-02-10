var mongoose = require('mongoose');

var Answers = mongoose.Schema({
    name:  String,  /*kind of test: with checkboxes or radios*/
    checkedAnswersArr: Array
});

var CheckedUserAnswers = mongoose.model('CheckedUserAnswers', Answers);

exports.CheckedUserAnswers  = mongoose.model('CheckedUserAnswers', CheckedUserAnswers);