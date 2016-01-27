var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/COURSES/testPHP');
var TestPHP = require('../models/testPHP').testPHP;

var testPHP1 = new TestPHP({
    text: 'questions_4',
    answers: ['answ_4_3','answ_4_4', 'answ_4_5', 'answ_4_6'],
    kind: 'radio'
});
//
//testPHP1 .save(function (err, testPHP1 ) {
//    if(err) throw err;
//    console.log(testPHP1);
//});
//
//TestPHP.find({},function(err,docs) {
//    console.log(docs);
//   return docs;
//});



//GET home page
var quizRoute = function (root) {

    router.get('/', function(req, res, next) {
        res.sendFile(root + '/dist/quiz.html');
        console.log(root);
    });

    //POSt form validation
    router.post('/nextTest', function(req, res) {
        console.log('Получаем запрос на получение след. теста');
        //Запрос у монги данных
        TestPHP.find({},function(err,docs) {
            if(err) err;
                var numberOfQuestion = req.body.key;
                console.log('№ вопроса ' + numberOfQuestion);

            if( docs.length >= numberOfQuestion ){
                res.end(JSON.stringify(docs[numberOfQuestion - 1])); /* '-1' т.к. в ajax присылается значение из роутера*/
            } else {
                console.log('Вопросы закончились');
                res.end(JSON.stringify(false));
            }

            });
        console.log('----------------');
    });


    return router;
};

module.exports = quizRoute;
