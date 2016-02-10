var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/COURSES/testPHP');
var TestPHP = require('../models/testPHP').testPHP;
var correctAnswers = require('../models/correctAnswers').correctAnswers;
var checkedUserAnswersObj = require('../models/CheckedUserAnswersModel').CheckedUserAnswers;
var checkedUserAnswersArr = [];



/*при добавлении каждого теста надо включать
 свойство callback с таким урлом '/js/testControllers.js' из-за того,
 что кнопка "Далее" в каждом новом тесте
 прогружается позже после загрузки скриптов и
 она не будет ловиться jquery и нельзя обрабатывать события */
//var testPHP1 = new TestPHP({
//    callback: ['/js/testControllers.js'],
//    text: 'Вопросик с ',
//    kind: 'textarea'
//    //amountOfDiagrams: 4
//    //answers: ['1', '2', '3', '4', '5', '6']
//});
////
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
//    kind: 'textarea',
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
/*check arrays for equality*/
        var arraysEqual = function (a, b) {
            if (a === b) return true;
            if (a == null || b == null) return false;
            if (a.length != b.length) return false;

            for (var i = 0; i < a.length; ++i) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        };
/*check for uniqueness of elements*/
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
        /*   */
        var addItemsInEachUsersAnswersObj = function (obj, id, kind, answers, questionsFromDB) {
            obj._id = id;
            obj.kind = kind;
            obj.userAnswers = answers;
            questionsFromDB.forEach( function (item10, i10, arr10){
                /*берем вопрос из теста из базы данных с начальными данными*/
                if (item10._id == id) {
                    obj.text = item10.text;
                }
            });
        };

        correctAnswers.find({},function(err,docs) {
            TestPHP.find({},  function(err2, docs2){
                var usersAnswers = req.body.answers;
                var correctAnswers = docs;
                var questionsFromDB = docs2;
                /*на сервер приходят значения ответов с типом string,  поэтому и надо перевести их в number*/
                usersAnswers.forEach(function (item, i, arr) {
                    correctAnswers.forEach(function (item2, i2, arr2){
                        /*в объекте сохранеятся инфа о конкретном ответе пользователя*/
                        var eachUsersAnswerObj = require('../models/UsersAnswersModel');
                    /*
                     * item  - массив ответов пользователя
                     * item2  - массив правильных ответом
                     * */
                        switch (item.kind) {
                            case 'checkbox':
                            case 'radio':

                                console.log( 'checkbox или radio' );
                                if (item.kind == 'radio') {
                                    var answ = parseInt( item.answers, 10);
                                    item.answers = [];
                                    item.answers.push(answ);

                                } else if (item.kind == 'checkbox') {
                                    item.answers.forEach(function (item2, i2, arr2) {
                                        arr2.splice(i2, 1, parseInt(item2, 10));
                                    });
                                }
                                var amountOfIncorrectAnswers = 0;
                                /*к каждому ответу пользователя привязан уникальный id правильного ответа*/
                                if (item._id === item2._id){
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
                                console.log('Количество неправильных ответов в checkbox и в radio ворпосах ' + amountOfIncorrectAnswers);
                                /* END проверка ответов для RADIO & CHECKBOX*/

                            break;
                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов для ДИАГРАММ ВЕННА*/
                            case 'diagramVenn':

                                var arrCorrectUserAnswers = []; /*массив, где хранятся объединения, которые пользователь правильно определил*/

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
                                /* в массиве с правильными ответами пользователя может содержаться несколько повторяющихся объединений,
                                 так как пользователь может несколько раз иденичные схемы нарисовать, поэтому мы используем функцию unique
                                 для того, чтобы убрать эти одинаковые объединения из массива*/

                                console.log(unique(arrCorrectUserAnswers));
                                console.log('Правильно пользователь отметил диаграмм Венна: ' + unique(arrCorrectUserAnswers).length);

                                /*END проверка ответов для ДИАГРАММ ВЕННА*/
                                break;
                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов для таблиц*/
                            case 'tables':
                                var arrUserCorrectAnswers = {};
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

                                console.log('Значения строк в таблицах, которые правильно сделал пользователь: ');
                                console.log(arrUserCorrectAnswers);
                                console.log('tables');
                                break;

                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов со скриптами*/
                            case 'textareaPHP':

                                /*в объекте сохранеятся инфа о конкретном ответе пользователя*/
                                var EachUsersAnswerObj = require('../models/UsersAnswersModel');
                                var eachUsersAnswerObj = new EachUsersAnswerObj();
                                var regExpFunc = function (regExp){
                                    var pattern = regExp;
                                    return pattern;
                                };
                                var regExpsPatternsObj = {
                                    textareaPHP: [
                                        regExpFunc( /(public\s+)?function\s+(transformToCircle)\s*\(\s*\)\s*\{[\s]?(.*\s)*(return \$this;)\s*\}/gm ),
                                        regExpFunc( /(public\s+)?function\s+(show)\s*\(\s*\)\s*\{(.*\s*)*\}/gm )
                                    ]
                                };
                                var checkedAswersArr = [];
                                regExpsPatternsObj[item.kind].forEach (function (item10, i10, arr10 ) {
                                    /*item3 --> pattern*/
                                    checkedAswersArr.push(item10.test(item.answers[0]));
                                });
                                addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);
                                eachUsersAnswerObj.checkedAnswers = checkedAswersArr;

                                checkedUserAnswersArr.push(eachUsersAnswerObj);
                                /*---------------------------------------------------------*/
                                /*saving in DB */
                                if (i === arr.length-1){
                                    var checkedUserAnswersObj1 = new checkedUserAnswersObj({
                                        checkedAnswersArr: checkedUserAnswersArr,
                                        name: req.body.name
                                    });
                                    checkedUserAnswersObj1.save(function (err, checkedUserAnswersObj1){
                                        if (err) throw err;
                                    });
                                }

                                break;
                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов для textarea*/
                            case 'textarea':
                                var EachUsersAnswerObj = require('../models/UsersAnswersModel');
                                var eachUsersAnswerObj = new EachUsersAnswerObj();
                                addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);
                                eachUsersAnswerObj.checkedAnswers = null;

                                checkedUserAnswersArr.push(eachUsersAnswerObj);
                                /*---------------------------------------------------------*/
                                /*saving in DB */
                                if (i === arr.length-1){
                                    var checkedUserAnswersObj1 = new checkedUserAnswersObj({
                                        checkedAnswersArr: checkedUserAnswersArr,
                                        name: req.body.name
                                    });
                                    checkedUserAnswersObj1.save(function (err, checkedUserAnswersObj1){
                                        if (err) throw err;
                                    });
                                }
                                break;

                            default:
                                console.log( 'Я таких видов тестов не знаю...(' );
                        }
                    });
                });

        })
    });
    });

    return router;
};

module.exports = quizRoute;
