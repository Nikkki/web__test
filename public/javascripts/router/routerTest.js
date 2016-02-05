var viewsFactory = require('../view/testView.js');
var Views;

var Question_BBmodel = require('../model/Question_BBmodel');
var question_BBmodel = new Question_BBmodel();
var questionContainer;

var UsersAnswersmodel = require('../model/UsersAnswersmodel');


var Router = Backbone.Router.extend({
    routes: {
        "quiz(/)": 'startPage', // Начальная страница
        "quiz/questions/:numTestPage(/)": 'nextTest',
        "quiz/questions/result": 'result'
    },

    startPage: function () {
        var numTestPage = 0;
        if (Views.start !== null) {
            Views.start.render();
        }
        sessionStorage.removeItem('numTestPage');
        sessionStorage.removeItem('amountOfQuestions');
        sessionStorage.removeItem('answers');
        console.log('router works on START page');
    },

    nextTest: function (numTestPage) {
        if (numTestPage == 1){
            $.ajax({
                type: 'POST',
                url: 'quiz/amountOfQuestions',
                cache: false,
                async: true,
                dataType: 'json',
                success: function (data, testStatus) {
                    sessionStorage.setItem('amountOfQuestions', JSON.stringify(data));
                }
            });
        }

        if (Views.questionContainer !== null && !questionContainer) {
            questionContainer = new Views.questionContainer({
                model: question_BBmodel
            });
            questionContainer.listenTo(question_BBmodel, 'change', questionContainer.render);
        }
        console.log('Зашли в роут, делаем запрос на сервер');
        question_BBmodel.fetch({
            type: 'POST',
            url: '/quiz/nextTest',
            cache: false,
            async: true,
            data: {key: numTestPage},
            dataType: 'json',
            success: function (model, response, options) {

                /*adding next model of answer in sessionStorage, but without user`s answer*/
                    var usersAnswersmodel = new UsersAnswersmodel({
                        kind: response.kind,
                        _id: response._id
                    });
                    if (JSON.parse(sessionStorage.getItem('answers')) !== null) {
                        var answersArr = JSON.parse(sessionStorage.getItem('answers'));
                        if (usersAnswersmodel._id !== null){
                            answersArr.push(usersAnswersmodel);
                        }
                        /*сделана такая система добавления в sessionStorage, чтобы дубликат ответа
                         не добавлялся в массив ответов при обновлении страницы*/
                        var arrLength = answersArr.length;
                        if (arrLength == 1) {
                            sessionStorage.setItem('answers', JSON.stringify(answersArr));
                        } else if (arrLength >= 2) {
                            if(answersArr[arrLength - 1]._id === answersArr[arrLength - 2]._id){
                                delete answersArr[arrLength - 1];
                            } else {
                                sessionStorage.setItem('answers', JSON.stringify(answersArr));
                            }
                        }
                    }

                /*END adding answers*/

                /**/
                if(response.callback !== undefined) {
                    response.callback.forEach(function (item, i , arr) {
                        var script = document.createElement("script");
                        script.setAttribute('src', item);
                        document.body.appendChild(script);
                    });
                }
                /*when server sends 'false' - it means, that questions ends*/
                if (response === false){
                    var name = JSON.parse(sessionStorage.getItem('name'));
                    var answers = JSON.parse(sessionStorage.getItem('answers'));
                    console.log(answers);
                    var request = {
                        name: name,
                        answers: answers
                    };
                    $.ajax({
                        type: 'POST',
                        url: 'quiz/testResults',
                        cache: false,
                        async: true,
                        dataType: 'json',
                        data: request,
                        success: function (data, testStatus) {
                            sessionStorage.setItem('amountOfQuestions', JSON.stringify(data));
                        }
                    });

                    if (Views.result !== null) {
                        var result = new Views.result();
                        result.render();
                        sessionStorage.removeItem('amountOfQuestions');
                        sessionStorage.removeItem('numTestPage');
                        //sessionStorage.removeItem('name');
                        //sessionStorage.removeItem('answers');
                    }
                }
            },
            error: function (model, response, options) {
                console.error('Error has been occured in model update');
            }
        });
    },

    result: function (){
        console.log('results');

    },

    initialize: function () {
        if (typeof Views === 'undefined') {
            Views = viewsFactory(this);
        }
        Backbone.history.start({pushState: true,  replace: true});
    }
});

module.exports = Router;