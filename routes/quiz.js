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
//    callback: ['/js/testControllers.js','/js/codemirror/codemirror.js', '/js/codemirror/php.js', '/js/codemirror/textareaPHP.js'],
//    text: 'Вопросик с ',
//    kind: 'textareaPHP'
//    //amountOfDiagrams: 4
//    //answers: ['1', '2', '3', '4', '5', '6']
//});
//
//testPHP1.save(function (err, testPHP1 ) {
//    if(err) throw err;
//    console.log(testPHP1);
//});
//
//var correctAnswers1 = new correctAnswers({
//    //correctAnswers:  [
//    //    {
//    //        name: 'table-huge',
//    //        arrUserAnswers: [[1,0,1,1,1],[1,1,0,0,1], [0,1,0,1,1], [0,1,0,1,1]]
//    //    },
//    //    {
//    //        name: 'table-small-and',
//    //        arrUserAnswers: [[1,0],[0,0]]
//    //    },
//    //    {
//    //        name: 'table-small-or',
//    //        arrUserAnswers: [[1,1],[1,0]]
//    //    }
//    //],
//    kind: 'textareaPHP',
//    _id: testPHP1._id
//});
//
////
//correctAnswers1.save(function (err, correctAnswers1 ) {
//    if(err) throw err;
//    console.log(correctAnswers1);
//});
//
//
//
//
//
//TestPHP.find({},function(err, docs) {
//   return docs;
//});



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

/*проверка ответов для RADIO & CHECKBOX*/
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
            /*
             * item  - массив ответов пользователя
             * item2  - массив правильных ответом
             * */

            var arraysEqual = function (a, b) {
                if (a === b) return true;
                if (a == null || b == null) return false;
                if (a.length != b.length) return false;

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
                            /*сортировка массива*/
                            function sortNumber(a, b) {
                                return a - b;
                            }
                            item.answers.sort(sortNumber);
                            item2.correctAnswers.sort(sortNumber);
                            /*END сортировки массива*/
                            if (arraysEqual(item.answers, item2.correctAnswers) === false) {
                                amountOfIncorrectAnswers++;
                            }
                        }
                    }
                });

            });
            console.log('Количество неправильных ответов в checkbox и в radio ворпосах ' + amountOfIncorrectAnswers);
/* END проверка ответов для RADIO & CHECKBOX*/

            /*проверка ответов для ДИАГРАММ ВЕННА*/

            var arrCorrectUserAnswers = []; /*массив, где хранятся объединения, которые пользователь правильно определил*/
            usersAnswers.forEach(function (item, i, arr) {
                if (item.kind === 'diagramVenn') {
                    correctAnswers.forEach(function (item2, i2, arr2){
                        /*должны совпадать id правильного ответа и конкретный вопрос*/
                        if (item._id === item2._id){
                            item.answers.forEach(function (item3, i3, arr3){
                                item2.correctAnswers.forEach( function (item4, i4, arr4){
                                    /*key название объединения в массиве прав ответов*/
                                    for (var key in item4 ){
                                        if (key === item3.nameOfUnion_js) {
                                            item4[key].forEach (function (item5, i5, arr5) { //каждый из объектов, где есть правильные значения: leftPart, rightPart, innerPart
                                                var counter = 0;
                                                for (var keyPart in item5){
                                                    for (var keyUsersPart in item3){ //значение leftPart, rightPart, innerPart У пользователя
                                                        /*Если одинаковы название объединений и значения Part*/
                                                        if (keyPart === keyUsersPart && String(item5[keyPart]) === item3[keyUsersPart]){
                                                            ++counter;
                                                            /*Если левая, правая и средняя части отвечены правильно пользователем,
                                                            тогда эта диаграмма правильна, сounter, как раз и считает такие совпадения*/
                                                            if (counter === 3){
                                                                arrCorrectUserAnswers.push(item3.nameOfUnion_js);

                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    });
                }

            });
            /* в массиве с правильными ответами пользователя может содержаться несколько повторяющихся объединений,
            так как пользователь может несколько раз иденичные схемы нарисовать, поэтому мы используем функцию unique
             для того, чтобы убрать эти одинаковые объединения из массива*/
            var unique = function (arr) {
                var result = [];

                nextInput:
                    for (var i = 0; i < arr.length; i++) {
                        var str = arr[i]; // для каждого элемента
                        for (var j = 0; j < result.length; j++) { // ищем, был ли он уже?
                            if (result[j] == str) continue nextInput; // если да, то следующий
                        }
                        result.push(str);
                    }
                return result;
            };

            console.log(unique(arrCorrectUserAnswers));
            console.log('Правильно пользователь отметил диаграмм Венна: ' + unique(arrCorrectUserAnswers).length);

            /*END проверка ответов для ДИАГРАММ ВЕННА*/
            /*------------------------------------------
            * ------------------------------------------*/

            /*проверка ответов для таблиц*/

            var arrUserCorrectAnswers = {};

            usersAnswers.forEach(function (item, i, arr) {
                if (item.kind === 'tables') {
                    correctAnswers.forEach(function (item2, i2, arr2){
                        if (item._id === item2._id){
                            /*каждый объект с ответами и названием таблицы*/
                            item.answers.forEach( function (item3, i3, arr3){
                                item2.correctAnswers.forEach ( function (item4, i4, arr4) {
                                    console.log(item3);
                                    console.log('item2 = ' + item2);
                                    console.log('item4 = '+ item4);
                                    /*совпадение названий кажджой таблицы */
                                    if (item4.name === item3.name) {
                                        arrUserCorrectAnswers[item4.name] = [];
                                        item3.arrUserAnswers.forEach(function (item5, i5, arr5){
                                            item4.arrUserAnswers.forEach( function (item6, i6, arr6){
                                                /*значения из в массиве ответов пользователя являются строкой,
                                                 поэтому преобразовываем в числа*/
                                                if (i5 === i6){
                                                    item5.forEach(function (item7, i7, arr7) {
                                                        arr7.splice(i7, 1, parseInt(item7, 10));
                                                    });
                                                    //console.log(i5);
                                                    //
                                                    //console.log('item5 = ' + item5);
                                                    //console.log('item6 =' +item6);
                                                    if (arraysEqual(item5, item6) === true) {
                                                        //console.log('Name = ' + item3.name);
                                                        arrUserCorrectAnswers[item4.name].push(i5);
                                                        //console.log(arrUserCorrectAnswers);
                                                    }
                                                    /*Довести до ума упаковку правильных ответов*/
                                                    //console.log('--------------');
                                                }
                                            })
                                        })
                                    }
                                });
                            })
                        }
                    });
                }
            });
            console.log('Значения строк в таблицах, которые правильно сделал пользователь: ');
            console.log(arrUserCorrectAnswers);
            /*END проверка ответов для таблиц*/
            /*--------------------------------*/


            /*--------------------------------*/
            /*проверка кода PHP*/
            usersAnswers.forEach(function (item, i, arr) {
                if (item.kind === 'textareaPHP') {
                    console.log(usersAnswers);

                    var pattern1 = /(public\s+)?function\s+(transformToCircle)\s*\(\s*\)\s*\{[\s]?(.*\s)*(return \$this;)\s*\}/gim;
                    var pattern2 = /(public\s+)?function\s+(show)\s*\(\s*\)\s*\{(.*\s)*\}/gim;
                    arrCorrectUserAnswers.push(pattern1.test(item.answers[0]));
                    arrCorrectUserAnswers.push(pattern2.test(item.answers[0]));

                }
            });
            console.log(arrCorrectUserAnswers);
            /*END проверка кода PHP*/
            /*--------------------------------*/
        })
    });

    return router;
};

module.exports = quizRoute;
