var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var is_json = require('is-json');
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




fs.readFile('questions.json', 'utf-8', function( err, data )  {
    if (err) throw new Error('I didn\'t find the file with questions');
    if (is_json(data) === false) throw new Error('The file with questions doesn\'t in JSON format');

    //remove all docs from collection with questions & answers
    TestPHP.remove({}, function(error)  {
        if (error) throw new Error();

        correctAnswers.remove({}, function(error) {
            if (error) throw new Error();
            // ----ended removing

            //далее мы парсим вопросы и ответы и начинаем сохранять их в бд
            var questions = JSON.parse(data);
            questions.TestPHP.forEach(function(question, i, questions_arr){
                var testPHP1 = new TestPHP(question);
                testPHP1.save(function (err, testPHP1 ) {
                    if(err) throw err;
                });
                //у каждого вопроса и ответа есть в файле questions.json поле с названием question_number,
                //то есть 1-му объекту с вопросом соответствует 1 объект с ответами и это значит, что question_number
                // у них одинаковые.
                questions.correctAnswers.forEach((correctAns, j, correctAns_arr) => {
                    // Мы находим соответствие вопрос-ответ по question_number
                    if(question.question_number === correctAns.question_number){
                        // и делаем связку вопрос-ответ по _id и далее сохраняем в бд
                        correctAns._id = testPHP1._id;
                        var correctAnswers1 = new correctAnswers(correctAns);
                        correctAnswers1.save((err2, correctAnswers1) => {
                           if(err2) throw err2;
                        });
                    }
                });
            });
        });
    });
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
        var checkedUserAnswersArr = [];
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

                        /*в объекте будет сохранеяться инфа о конкретном ответе пользователя*/
                        var eachUsersAnswerObj = require('../models/UsersAnswersModel');
                    /*
                     * item  - массив ответов пользователя
                     * item2  - массив правильных ответом
                     * */
                        switch (item.kind) {
                            case 'checkbox':
                            case 'radio':
                                correctAnswers.forEach(function (item2, i2, arr2){

                                if (item.kind == 'radio') {
                                    var answ = parseInt( item.answers, 10);
                                    item.answers = [];
                                    item.answers.push(answ);

                                } else if (item.kind == 'checkbox') {
                                    item.answers.forEach(function (item2, i2, arr2) {
                                        arr2.splice(i2, 1, parseInt(item2, 10));
                                    });
                                }

                                var EachUsersAnswerObj = require('../models/UsersAnswersModel');
                                var eachUsersAnswerObj = new EachUsersAnswerObj();
                                addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);

                                /*к каждому ответу пользователя привязан уникальный id правильного ответа*/
                                if (item._id === item2._id){
                                        console.log('Ответы пользователя = '+ item.answers + '\n' + 'Правильные ответы = ' + item2.correctAnswers);

                                        /*сортировка массива*/
                                        function sortNumber(a, b) {
                                            return a - b;
                                        }
                                        item.answers.sort(sortNumber);
                                        item2.correctAnswers.sort(sortNumber);
                                        /*END сортировки массива*/

                                    if (arraysEqual(item.answers, item2.correctAnswers) === true) {
                                        eachUsersAnswerObj.checkedAnswers = item.answers;
                                    } else {
                                        eachUsersAnswerObj.checkedAnswers = 'неправильный_ответ'
                                    }
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
                                        checkedUserAnswersArr = [];
                                    }
                                    console.log('------------------');
                                }
                                /* END проверка ответов для RADIO & CHECKBOX*/
                                /*--------------------------------------------------------------------*/

                                });
                            break;
                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов для ДИАГРАММ ВЕННА*/
                            case 'diagramVenn':
                                correctAnswers.forEach(function (item2, i2, arr2) {
                                    var arrCorrectUserAnswers = [];
                                    /*массив, где хранятся объединения, которые пользователь правильно определил*/

                                    /*должны совпадать id правильного ответа и конкретный вопрос*/
                                    if (item._id === item2._id) {
                                        item.answers.forEach(function (item3, i3, arr3) {
                                            item2.correctAnswers.forEach(function (item4, i4, arr4) {
                                                /*key название объединения в массиве прав ответов*/

                                                for (var key in item4) {

                                                    if (key === item3.nameOfUnion_js) {

                                                        item4[key].forEach(function (item5, i5, arr5) { //каждый из объектов, где есть правильные значения: leftPart, rightPart, innerPart
                                                            var counter = 0;
                                                            for (var keyPart in item5) {
                                                                for (var keyUsersPart in item3) { //значение leftPart, rightPart, innerPart У пользователя
                                                                    /*Если одинаковы название объединений и значения Part*/
                                                                    if (keyPart === keyUsersPart && String(item5[keyPart]) === item3[keyUsersPart]) {
                                                                        ++counter;
                                                                        /*Если левая, правая и средняя части отвечены правильно пользователем,
                                                                         тогда эта диаграмма правильна, сounter, как раз и считает такие совпадения*/
                                                                        if (counter === 3) {
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


                                    var EachUsersAnswerObj = require('../models/UsersAnswersModel');
                                    var eachUsersAnswerObj = new EachUsersAnswerObj();
                                    addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);
                                    eachUsersAnswerObj.checkedAnswers = unique(arrCorrectUserAnswers);

                                    checkedUserAnswersArr.push(eachUsersAnswerObj);
                                    /*---------------------------------------------------------*/
                                    /*saving in DB */
                                    if (i === arr.length - 1) {
                                        var checkedUserAnswersObj1 = new checkedUserAnswersObj({
                                            checkedAnswersArr: checkedUserAnswersArr,
                                            name: req.body.name
                                        });
                                        checkedUserAnswersObj1.save(function (err, checkedUserAnswersObj1) {
                                            if (err) throw err;
                                        });
                                        checkedUserAnswersArr = [];
                                    }

                                    /*END проверка ответов для ДИАГРАММ ВЕННА*/
                                });
                                break;
                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов для таблиц*/
                            /*если в массиве проверенных ответов есть NaN, то это значит, что пользователь просто не стал отвечать в данных select`ах*/
                            case 'tables':
                                correctAnswers.forEach(function (item2, i2, arr2) {

                                    var correctAnswersInTablesObj = {};
                                    if (item._id === item2._id) {
                                        console.log(item2.correctAnswers[2].arrUserAnswers);
                                        /*каждый объект с ответами и названием таблицы*/
                                        item.answers.forEach(function (item3, i3, arr3) {
                                            item2.correctAnswers.forEach(function (item4, i4, arr4) {
                                                //console.log(item3);
                                                //console.log('item2 = ' + item2);
                                                //console.log('item4 = '+ JSON.parse(item4));
                                                /*совпадение названий кажджой таблицы */
                                                if (item4.name === item3.name) {
                                                    console.log('item4.arr');
                                                    console.log(item4.arrUserAnswers);
                                                    correctAnswersInTablesObj[item4.name] = [];
                                                    item3.arrUserAnswers.forEach(function (item5, i5, arr5) {
                                                        item4.arrUserAnswers.forEach(function (item6, i6, arr6) {
                                                            /*значения в массиве ответов пользователя являются строкой ,
                                                             поэтому преобразовываем в числа*/
                                                            if (i5 === i6) {
                                                                item5.forEach(function (item7, i7, arr7) {
                                                                    arr7.splice(i7, 1, parseInt(item7, 10));
                                                                });
                                                                //console.log(i5);
                                                                //
                                                                //console.log('item5 = ' + item5);
                                                                //console.log('item6 =' +item6);
                                                                if (arraysEqual(item5, item6) === true) {
                                                                    //console.log('Name = ' + item3.name);
                                                                    correctAnswersInTablesObj[item4.name].push(i5);
                                                                    //console.log(correctAnswersInTablesObj);
                                                                }
                                                            }
                                                        })
                                                    })
                                                }
                                            });
                                        })
                                    }
                                    /*--------------------------------------------------------------------*/
                                    var EachUsersAnswerObj = require('../models/UsersAnswersModel');
                                    var eachUsersAnswerObj = new EachUsersAnswerObj();
                                    addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);
                                    eachUsersAnswerObj.checkedAnswers = correctAnswersInTablesObj;

                                    checkedUserAnswersArr.push(eachUsersAnswerObj);
                                    /*---------------------------------------------------------*/
                                    /*saving in DB */
                                    if (i === arr.length - 1) {
                                        var checkedUserAnswersObj1 = new checkedUserAnswersObj({
                                            checkedAnswersArr: checkedUserAnswersArr,
                                            name: req.body.name
                                        });
                                        checkedUserAnswersObj1.save(function (err, checkedUserAnswersObj1) {
                                            if (err) throw err;
                                        });
                                        checkedUserAnswersArr = [];
                                    }

                                    console.log('Значения строк в таблицах, которые правильно сделал пользователь: ');
                                    console.log(correctAnswersInTablesObj);

                                });
                                break;

                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*проверка ответов со скриптами*/
                            case 'textareaPHP':
                            case 'textareaJS':
                            case 'textareaHTML':


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
                                        ],
                                        textareaJS: [
                                            regExpFunc(/document\.getElementById\(["']my["']\)\.innerHTML\s*\=\s*(["']\s*Hello\s*world\s*["'])(\;)?/gm)
                                        ],
                                        textareaHTML: []
                                    };
                                    var checkedAswersArr = [];
                                    regExpsPatternsObj[item.kind].forEach (function (item10, i10, arr10 ) {
                                        /*item10 --> pattern*/
                                        checkedAswersArr.push(item10.test(item.answers));
                                    });
                                    addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);
                                    eachUsersAnswerObj.checkedAnswers = checkedAswersArr;
                                    console.log(item.answers);
                                    console.log(eachUsersAnswerObj.userAnswers);
                                    checkedUserAnswersArr.push(eachUsersAnswerObj);
                                    /*---------------------------------------------------------*/
                                    /*saving in DB */

                                    if (i === arr.length-1){ /*сохранение только, когда у нас последний вопрос*/
                                        console.log('значение i');
                                        console.log(i);
                                        console.log('длина массива');
                                        console.log(arr.length);
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
                                    /*обнуляем массив с ответами пользователя IMPORTANT*/
                                    checkedUserAnswersArr = [];
                                }
                                break;
                            /*------------------------------------------
                             * ------------------------------------------*/
                            /*Тесты Network*/
                            case 'network':
                                correctAnswers.forEach(function (item2, i2, arr2) {

                                    var arrCorrectUserAnswers = [];
                                    if (item._id === item2._id) {

                                        item.answers.forEach(function (item3, i3, arr3) {
                                            var counter = 0;
                                            item2.correctAnswers.forEach(function (item4, i4, arr4) {

                                                if (i3 === i4) {
                                                    /**/
                                                    for (var key4 in item4) {
                                                        if (item3[key4] === JSON.stringify(item4[key4])) {
                                                            console.log(key4);
                                                            console.log('--------');
                                                            ++counter;
                                                            /*add correct answers in array*/
                                                            if (counter === 3) {
                                                                arrCorrectUserAnswers.push(item3);

                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                    }

                                    if (i === i2){
                                        var EachUsersAnswerObj = require('../models/UsersAnswersModel');
                                        var eachUsersAnswerObj = new EachUsersAnswerObj();
                                        addItemsInEachUsersAnswersObj(eachUsersAnswerObj, item._id, item.kind, item.answers, questionsFromDB);
                                        eachUsersAnswerObj.checkedAnswers = arrCorrectUserAnswers;

                                        checkedUserAnswersArr.push(eachUsersAnswerObj);
                                        /*---------------------------------------------------------*/
                                        /*saving in DB */

                                        if (i === arr.length - 1) {
                                            var checkedUserAnswersObj1 = new checkedUserAnswersObj({
                                                checkedAnswersArr: checkedUserAnswersArr,
                                                name: req.body.name
                                            });
                                            checkedUserAnswersObj1.save(function (err, checkedUserAnswersObj1) {
                                                if (err) throw err;
                                            });
                                            checkedUserAnswersArr = [];
                                        }
                                    }

                                });
                                break;


                            default:
                                console.log( 'Я таких видов тестов не знаю...(' );
                        }

                });

        })
    });
    });

    return router;
};

module.exports = quizRoute;
