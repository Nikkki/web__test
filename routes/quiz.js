var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/COURSES/testPHP');
var TestPHP = require('../models/testPHP').testPHP;
var correctAnswers = require('../models/correctAnswers').correctAnswers;


/*при добавлении каждого теста надо включать
 свойство callback с таким урлом '/js/testControllers.js' из-за того,
 что кнопка "Далее" в каждом новом тесте
 прогружается позже после загрузки скриптов и
 она не будет ловиться jquery и нельзя обрабатывать события */
//var testPHP1 = new TestPHP({
//    callback: ['/js/diagramVenn.js', '/js/testControllers.js'],
//    text: 'Вопросик с диаграммой',
//    kind: 'diagramVenn',
//    amountOfDiagrams: 4
//    //answers: ['answ1', 'answ2', 'answ3', 'answ4', 'answ5', 'answ6']
//});
//
//testPHP1.save(function (err, testPHP1 ) {
//    if(err) throw err;
//    console.log(testPHP1);
//});
//
//var correctAnswers1 = new correctAnswers({
//    correctAnswers: [5, 2, 4],//отсчет от нуля
//    kind: 'tables',
//    _id: testPHP1._id
//});
//
////
//correctAnswers1.save(function (err, correctAnswers1 ) {
//    if(err) throw err;
//    console.log(correctAnswers1);
//});





TestPHP.find({},function(err,docs) {
    console.log(docs);
   return docs;
});



//GET home page
var quizRoute = function (root) {

    router.get('/', function(req, res, next) {
        res.sendFile(root + '/dist/quiz.html');
    });


    router.post('/nextTest', function(req, res) {
        console.log('Получаем запрос на получение след. теста');
        //Запрос у монги данных
        TestPHP.find({},function(err,docs) {
            if(err) throw err;
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

    router.post('/amountOfQuestions', function (req, res){
        TestPHP.find({}, function (err, docs){
           if (err) throw err;
            res.end(JSON.stringify(docs.length));
        });
    });

    router.post('/testResults', function (req, res){

        correctAnswers.find({},function(err,docs) {
            var usersAnswers = req.body.answers;
            var correctAnswers = docs;
            /*на сервер приходят значения ответов с типом string,  поэтому и надо перевести их в number*/
            usersAnswers.forEach(function (item, i, arr) {
                if (item.kind == 'checkbox') {
                    item.answers.forEach(function (item2, i2, arr2) {
                        arr2.splice(i2, 1, parseInt(item2, 10));
                    });
                }
                if (item.kind == 'radio') {
                    var answ = parseInt( item.answers, 10);
                    item.answers = [];
                    item.answers.push(answ);
                }
            });


/*проверка ответов для RADIO & CHECKBOX*/
            /*
             * item  - массив ответов пользователя
             * item2  - массив правильных ответом
             * */

            var arraysEqual = function (a, b) {
                if (a === b) return true;
                if (a == null || b == null) return false;
                if (a.length != b.length) return false;

                function sortNumber(a, b) {
                    return a - b;
                }
                a.sort(sortNumber);
                b.sort(sortNumber);

                for (var i = 0; i < a.length; ++i) {
                    if (a[i] !== b[i]) return false;
                }
                return true;
            };

            var amountOfIncorrectAnswers = 0;
            usersAnswers.forEach(function(item, i, arr) {
                correctAnswers.forEach(function (item2, i2, arr2){
                    /*к каждому ответу пользователя привязан уникальный id правильного ответа*/
                    if (item._id === item2._id){
                        if(item.kind === 'checkbox' || item.kind === 'radio'){
                            console.log('Ответы пользователя = '+ item.answers + '\n' + 'Правильные ответы = ' + item2.correctAnswers);
                            console.log('------------------');
                            if (arraysEqual(item.answers, item2.correctAnswers) === false) {
                                amountOfIncorrectAnswers++;
                            }
                        }
                    }
                });

            });
            console.log('Количество неправильных ответов в checkbox и в radio ворпосах' + amountOfIncorrectAnswers);
            /*проверка ответов для RADIO & CHECKBOX*/
        })
    });

    return router;
};

module.exports = quizRoute;
