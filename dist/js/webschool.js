(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (router) {
    var btnStart =  $('#startTest-js');
    var answers = sessionStorage.getItem('answers');

    btnStart.on('click', function(){
        console.log('startingTest works');
        if ($('#inputName').val() != "") {
            var name = $('#inputName').val();
            var testInSessionStor = sessionStorage.setItem('name', JSON.stringify(name));
            var answersArr = sessionStorage.setItem('answers', JSON.stringify([]));
        }
        return testInSessionStor;

    });
};

},{}],2:[function(require,module,exports){
var Router = require('./router/routerTest');
var router = new Router();
var BtnTest = require('./view/test/BtnTest');
var NextText =require('./view/test/NextTest');
var Views= require('./view/testView.js')(router);
var startingTest = require('./controller/test/startingTest')(router);










},{"./controller/test/startingTest":1,"./router/routerTest":5,"./view/test/BtnTest":6,"./view/test/NextTest":7,"./view/testView.js":12}],3:[function(require,module,exports){
var Question_BBmodel = Backbone.Model.extend({
    defaults: {
        kind: '',
        text: '',
        answers: [],
        _id: '',
        __v: 0,
        amountOfDiagrams: 0
    }
});

/*-Для диаграммы Венна:
        ОБЯЗАТЕЛЬНО указываем количество диаграмм в поле amountOfDiagrams, при добавлении в БД*/
module.exports = Question_BBmodel;
},{}],4:[function(require,module,exports){
var UsersAnswersmodel = function (options) {
    options = options || {};
    this.kind = options.kind || null;
    this.answers = options.answers || [];
    this._id = options._id || null;
    this.text = options.text || '';
};
module.exports = UsersAnswersmodel;
},{}],5:[function(require,module,exports){
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
},{"../model/Question_BBmodel":3,"../model/UsersAnswersmodel":4,"../view/testView.js":12}],6:[function(require,module,exports){
module.exports = function (router) {
    var BtnTest = Backbone.View.extend({
        template:_.template($('#btn-test-js').html()),

        tagName: 'div',

        render: function () {
            this.$el.html(this.template());
            return this.el;
        }
    });
    return BtnTest;
};
},{}],7:[function(require,module,exports){
module.exports = function (router) {
    var NextTest;
    NextTest = Backbone.View.extend({
        template: {
            checkbox: _.template($('#testQuestion-checkbox-js').html()),
            radio: _.template($('#testQuestion-radio-js').html()),
            textarea: _.template($('#testQuestions-textarea-js').html()),
            diagramVenn: _.template($('#testQuestions-diagramVenn-js').html()),
            network: _.template($('#testQuestions-network-js').html()),
            tables: _.template($('#testQuestions-tables-js').html()),
            textareaJS: _.template($('#testQuestions-textareaJS-js').html()),
            textareaHTML: _.template($('#testQuestions-textareaHTML-js').html()),
            textareaPHP: _.template($('#testQuestions-textareaPHP-js').html())
        },

        render: function () {
            console.log('Рендеринг самого теста');
            var question = this.model;
            var amountOfQuestions = sessionStorage.getItem('amountOfQuestions');
            var numTestPage = sessionStorage.getItem('numTestPage');
            if (question.attributes._id !== '') {
                var kind = question.attributes.kind;
                //kind теста должен совпадать с название template[тип]
                this.$el.html(this.template[kind]({question: this.model.toJSON()}));
            } else {
                router.navigate("quiz/questions/result", {trigger: true, replace: true})
            }
            return this.el;
        }
    });
    return NextTest;
};
},{}],8:[function(require,module,exports){
module.exports = function (router) {
    var ProgressView = Backbone.View.extend({
        template:_.template($('#progress-view-js').html()),

        tagName: 'div',

        render: function () {
            var amountOfQuestions = JSON.parse(sessionStorage.getItem('amountOfQuestions'));
            var numQuestion = JSON.parse(sessionStorage.getItem('numTestPage'));
            this.$el.html(this.template({
                amountOfQuestions: amountOfQuestions,
                numQuestion: numQuestion
            }));
            return this.el;
        }
    });
    return ProgressView;
};
},{}],9:[function(require,module,exports){
module.exports = function (router) {

    var Result = Backbone.View.extend({
        el: $('#test'),

        template: _.template($('#result-js').html()),

        render: function () {
            router.navigate("quiz/questions/result", {replace: true})
            $(this.el).html(this.template());
            console.log('Render Results');
            return this;
        }
    });
    return Result;
};
},{}],10:[function(require,module,exports){
module.exports = function (router) {

    var Start = Backbone.View.extend({
        el: $('#test'), // DOM элемент widget'а

        template: _.template($('#form-start-test-js').html()),

        events: {
            "click #startTest-js": "startTest" // Обработчик клика на кнопке "Начать тест"
        },

        startTest: function () {
            if ($('#inputName').val() != "") {
                router.navigate("quiz/questions/1", {trigger: true});
                sessionStorage.setItem('numTestPage', 1);
            }
        },
        render: function () {
            $(this.el).html(this.template());
            return this;
        }
    });
    return Start;
};

},{}],11:[function(require,module,exports){
module.exports = function(router) {
    var BtnTest = require('./BtnTest')(router);
    var NextTest = require('./NextTest')(router);
    var ProgressView = require('./ProgressView')(router);

    var QuestionContainer = Backbone.View.extend({
        el: $('#test'),
        events: {
            'click #btn-continue' : 'moveToNextTest'
        },

        moveToNextTest: function () {
            var numTestPage = JSON.parse(sessionStorage.getItem('numTestPage'));

            numTestPage++;
            sessionStorage.setItem('numTestPage', JSON.stringify(numTestPage));
            router.navigate("quiz/questions/" + JSON.stringify(numTestPage) , {trigger: true, replace: true});
        },
        render: function () {
            console.log('Вызов для rendering`га View');
            var btnTest = new BtnTest();
            var nextTest = new NextTest({
                model: this.model
            });
            var progressView = new ProgressView();

            this.$el.html('');
            this.$el.append(progressView.render());
            this.$el.append(nextTest.render());
            this.$el.append(btnTest.render());

            return this;
        }
    });
    return QuestionContainer;
};

},{"./BtnTest":6,"./NextTest":7,"./ProgressView":8}],12:[function(require,module,exports){
module.exports = function(router, btn, nextText) {

    var Start = require('./test/Start')(router),
        btnTest = require('./test/BtnTest')(router),
        NextTest = require ('./test/NextTest')(router),
        ProgressView = require('./test/ProgressView')(router),
        QuestionContainer = require('./test/questionContainer')(router),
        Result = require('./test/Result')(router);

    var Views = Views || {};

    Views = {
        start: new Start(),
        nextTest: new NextTest(),
        btnTest: new btnTest(),
        progressView: new ProgressView(),
        questionContainer: QuestionContainer,
        result:  Result
    };
    return Views;
};
},{"./test/BtnTest":6,"./test/NextTest":7,"./test/ProgressView":8,"./test/Result":9,"./test/Start":10,"./test/questionContainer":11}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvY29udHJvbGxlci90ZXN0L3N0YXJ0aW5nVGVzdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9mYWtlXzYxNTI0Yzc0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL21vZGVsL1F1ZXN0aW9uX0JCbW9kZWwuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvbW9kZWwvVXNlcnNBbnN3ZXJzbW9kZWwuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvcm91dGVyL3JvdXRlclRlc3QuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0L0J0blRlc3QuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0L05leHRUZXN0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdC9Qcm9ncmVzc1ZpZXcuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0L1Jlc3VsdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvU3RhcnQuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0L3F1ZXN0aW9uQ29udGFpbmVyLmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICB2YXIgYnRuU3RhcnQgPSAgJCgnI3N0YXJ0VGVzdC1qcycpO1xuICAgIHZhciBhbnN3ZXJzID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW5zd2VycycpO1xuXG4gICAgYnRuU3RhcnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nVGVzdCB3b3JrcycpO1xuICAgICAgICBpZiAoJCgnI2lucHV0TmFtZScpLnZhbCgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCgnI2lucHV0TmFtZScpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHRlc3RJblNlc3Npb25TdG9yID0gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbmFtZScsIEpTT04uc3RyaW5naWZ5KG5hbWUpKTtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJzQXJyID0gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KFtdKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRlc3RJblNlc3Npb25TdG9yO1xuXG4gICAgfSk7XG59O1xuIiwidmFyIFJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyL3JvdXRlclRlc3QnKTtcbnZhciByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG52YXIgQnRuVGVzdCA9IHJlcXVpcmUoJy4vdmlldy90ZXN0L0J0blRlc3QnKTtcbnZhciBOZXh0VGV4dCA9cmVxdWlyZSgnLi92aWV3L3Rlc3QvTmV4dFRlc3QnKTtcbnZhciBWaWV3cz0gcmVxdWlyZSgnLi92aWV3L3Rlc3RWaWV3LmpzJykocm91dGVyKTtcbnZhciBzdGFydGluZ1Rlc3QgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvdGVzdC9zdGFydGluZ1Rlc3QnKShyb3V0ZXIpO1xuXG5cblxuXG5cblxuXG5cblxuIiwidmFyIFF1ZXN0aW9uX0JCbW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGtpbmQ6ICcnLFxuICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgYW5zd2VyczogW10sXG4gICAgICAgIF9pZDogJycsXG4gICAgICAgIF9fdjogMCxcbiAgICAgICAgYW1vdW50T2ZEaWFncmFtczogMFxuICAgIH1cbn0pO1xuXG4vKi3QlNC70Y8g0LTQuNCw0LPRgNCw0LzQvNGLINCS0LXQvdC90LA6XG4gICAgICAgINCe0JHQr9CX0JDQotCV0JvQrNCd0J4g0YPQutCw0LfRi9Cy0LDQtdC8INC60L7Qu9C40YfQtdGB0YLQstC+INC00LjQsNCz0YDQsNC80Lwg0LIg0L/QvtC70LUgYW1vdW50T2ZEaWFncmFtcywg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INCyINCR0JQqL1xubW9kdWxlLmV4cG9ydHMgPSBRdWVzdGlvbl9CQm1vZGVsOyIsInZhciBVc2Vyc0Fuc3dlcnNtb2RlbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5raW5kID0gb3B0aW9ucy5raW5kIHx8IG51bGw7XG4gICAgdGhpcy5hbnN3ZXJzID0gb3B0aW9ucy5hbnN3ZXJzIHx8IFtdO1xuICAgIHRoaXMuX2lkID0gb3B0aW9ucy5faWQgfHwgbnVsbDtcbiAgICB0aGlzLnRleHQgPSBvcHRpb25zLnRleHQgfHwgJyc7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBVc2Vyc0Fuc3dlcnNtb2RlbDsiLCJ2YXIgdmlld3NGYWN0b3J5ID0gcmVxdWlyZSgnLi4vdmlldy90ZXN0Vmlldy5qcycpO1xudmFyIFZpZXdzO1xuXG52YXIgUXVlc3Rpb25fQkJtb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL1F1ZXN0aW9uX0JCbW9kZWwnKTtcbnZhciBxdWVzdGlvbl9CQm1vZGVsID0gbmV3IFF1ZXN0aW9uX0JCbW9kZWwoKTtcbnZhciBxdWVzdGlvbkNvbnRhaW5lcjtcblxudmFyIFVzZXJzQW5zd2Vyc21vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvVXNlcnNBbnN3ZXJzbW9kZWwnKTtcblxudmFyIFJvdXRlciA9IEJhY2tib25lLlJvdXRlci5leHRlbmQoe1xuICAgIHJvdXRlczoge1xuICAgICAgICBcInF1aXooLylcIjogJ3N0YXJ0UGFnZScsIC8vINCd0LDRh9Cw0LvRjNC90LDRjyDRgdGC0YDQsNC90LjRhtCwXG4gICAgICAgIFwicXVpei9xdWVzdGlvbnMvOm51bVRlc3RQYWdlKC8pXCI6ICduZXh0VGVzdCcsXG4gICAgICAgIFwicXVpei9xdWVzdGlvbnMvcmVzdWx0XCI6ICdyZXN1bHQnXG4gICAgfSxcblxuICAgIHN0YXJ0UGFnZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbnVtVGVzdFBhZ2UgPSAwO1xuICAgICAgICBpZiAoVmlld3Muc3RhcnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIFZpZXdzLnN0YXJ0LnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ251bVRlc3RQYWdlJyk7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Ftb3VudE9mUXVlc3Rpb25zJyk7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Fuc3dlcnMnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3JvdXRlciB3b3JrcyBvbiBTVEFSVCBwYWdlJyk7XG4gICAgfSxcblxuICAgIG5leHRUZXN0OiBmdW5jdGlvbiAobnVtVGVzdFBhZ2UpIHtcbiAgICAgICAgaWYgKG51bVRlc3RQYWdlID09IDEpe1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAncXVpei9hbW91bnRPZlF1ZXN0aW9ucycsXG4gICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHRlc3RTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW1vdW50T2ZRdWVzdGlvbnMnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoVmlld3MucXVlc3Rpb25Db250YWluZXIgIT09IG51bGwgJiYgIXF1ZXN0aW9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgICBxdWVzdGlvbkNvbnRhaW5lciA9IG5ldyBWaWV3cy5xdWVzdGlvbkNvbnRhaW5lcih7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHF1ZXN0aW9uX0JCbW9kZWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcXVlc3Rpb25Db250YWluZXIubGlzdGVuVG8ocXVlc3Rpb25fQkJtb2RlbCwgJ2NoYW5nZScsIHF1ZXN0aW9uQ29udGFpbmVyLnJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ9CX0LDRiNC70Lgg0LIg0YDQvtGD0YIsINC00LXQu9Cw0LXQvCDQt9Cw0L/RgNC+0YEg0L3QsCDRgdC10YDQstC10YAnKTtcbiAgICAgICAgcXVlc3Rpb25fQkJtb2RlbC5mZXRjaCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvcXVpei9uZXh0VGVzdCcsXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHtrZXk6IG51bVRlc3RQYWdlfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAobW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKSB7XG5cbiAgICAgICAgICAgICAgICAvKmFkZGluZyBuZXh0IG1vZGVsIG9mIGFuc3dlciBpbiBzZXNzaW9uU3RvcmFnZSwgYnV0IHdpdGhvdXQgdXNlcmBzIGFuc3dlciovXG4gICAgICAgICAgICAgICAgICAgIHZhciB1c2Vyc0Fuc3dlcnNtb2RlbCA9IG5ldyBVc2Vyc0Fuc3dlcnNtb2RlbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBraW5kOiByZXNwb25zZS5raW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiByZXNwb25zZS5faWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Fuc3dlcnMnKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJzQXJyID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZXJzQW5zd2Vyc21vZGVsLl9pZCAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2Vyc0Fyci5wdXNoKHVzZXJzQW5zd2Vyc21vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8q0YHQtNC10LvQsNC90LAg0YLQsNC60LDRjyDRgdC40YHRgtC10LzQsCDQtNC+0LHQsNCy0LvQtdC90LjRjyDQsiBzZXNzaW9uU3RvcmFnZSwg0YfRgtC+0LHRiyDQtNGD0LHQu9C40LrQsNGCINC+0YLQstC10YLQsFxuICAgICAgICAgICAgICAgICAgICAgICAgINC90LUg0LTQvtCx0LDQstC70Y/Qu9GB0Y8g0LIg0LzQsNGB0YHQuNCyINC+0YLQstC10YLQvtCyINC/0YDQuCDQvtCx0L3QvtCy0LvQtdC90LjQuCDRgdGC0YDQsNC90LjRhtGLKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcnJMZW5ndGggPSBhbnN3ZXJzQXJyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJMZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2Fuc3dlcnMnLCBKU09OLnN0cmluZ2lmeShhbnN3ZXJzQXJyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyckxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoYW5zd2Vyc0FyclthcnJMZW5ndGggLSAxXS5faWQgPT09IGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMl0uX2lkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KGFuc3dlcnNBcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qRU5EIGFkZGluZyBhbnN3ZXJzKi9cblxuICAgICAgICAgICAgICAgIC8qKi9cbiAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5jYWxsYmFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmNhbGxiYWNrLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkgLCBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKndoZW4gc2VydmVyIHNlbmRzICdmYWxzZScgLSBpdCBtZWFucywgdGhhdCBxdWVzdGlvbnMgZW5kcyovXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCduYW1lJykpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VycyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW5zd2VycycpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYW5zd2Vycyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcnM6IGFuc3dlcnNcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJ3F1aXovdGVzdFJlc3VsdHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCB0ZXN0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW1vdW50T2ZRdWVzdGlvbnMnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChWaWV3cy5yZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgVmlld3MucmVzdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbnVtVGVzdFBhZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdhbnN3ZXJzJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBoYXMgYmVlbiBvY2N1cmVkIGluIG1vZGVsIHVwZGF0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVzdWx0OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VsdHMnKTtcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBWaWV3cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIFZpZXdzID0gdmlld3NGYWN0b3J5KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoe3B1c2hTdGF0ZTogdHJ1ZSwgIHJlcGxhY2U6IHRydWV9KTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgdmFyIEJ0blRlc3QgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRlbXBsYXRlOl8udGVtcGxhdGUoJCgnI2J0bi10ZXN0LWpzJykuaHRtbCgpKSxcblxuICAgICAgICB0YWdOYW1lOiAnZGl2JyxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEJ0blRlc3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHZhciBOZXh0VGVzdDtcbiAgICBOZXh0VGVzdCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICAgIGNoZWNrYm94OiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb24tY2hlY2tib3gtanMnKS5odG1sKCkpLFxuICAgICAgICAgICAgcmFkaW86IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbi1yYWRpby1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICB0ZXh0YXJlYTogXy50ZW1wbGF0ZSgkKCcjdGVzdFF1ZXN0aW9ucy10ZXh0YXJlYS1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICBkaWFncmFtVmVubjogXy50ZW1wbGF0ZSgkKCcjdGVzdFF1ZXN0aW9ucy1kaWFncmFtVmVubi1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICBuZXR3b3JrOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLW5ldHdvcmstanMnKS5odG1sKCkpLFxuICAgICAgICAgICAgdGFibGVzOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLXRhYmxlcy1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICB0ZXh0YXJlYUpTOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLXRleHRhcmVhSlMtanMnKS5odG1sKCkpLFxuICAgICAgICAgICAgdGV4dGFyZWFIVE1MOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLXRleHRhcmVhSFRNTC1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICB0ZXh0YXJlYVBIUDogXy50ZW1wbGF0ZSgkKCcjdGVzdFF1ZXN0aW9ucy10ZXh0YXJlYVBIUC1qcycpLmh0bWwoKSlcbiAgICAgICAgfSxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQoNC10L3QtNC10YDQuNC90LMg0YHQsNC80L7Qs9C+INGC0LXRgdGC0LAnKTtcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMubW9kZWw7XG4gICAgICAgICAgICB2YXIgYW1vdW50T2ZRdWVzdGlvbnMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycpO1xuICAgICAgICAgICAgdmFyIG51bVRlc3RQYWdlID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnbnVtVGVzdFBhZ2UnKTtcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbi5hdHRyaWJ1dGVzLl9pZCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICB2YXIga2luZCA9IHF1ZXN0aW9uLmF0dHJpYnV0ZXMua2luZDtcbiAgICAgICAgICAgICAgICAvL2tpbmQg0YLQtdGB0YLQsCDQtNC+0LvQttC10L0g0YHQvtCy0L/QsNC00LDRgtGMINGBINC90LDQt9Cy0LDQvdC40LUgdGVtcGxhdGVb0YLQuNC/XVxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZVtraW5kXSh7cXVlc3Rpb246IHRoaXMubW9kZWwudG9KU09OKCl9KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcInF1aXovcXVlc3Rpb25zL3Jlc3VsdFwiLCB7dHJpZ2dlcjogdHJ1ZSwgcmVwbGFjZTogdHJ1ZX0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBOZXh0VGVzdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgdmFyIFByb2dyZXNzVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGVtcGxhdGU6Xy50ZW1wbGF0ZSgkKCcjcHJvZ3Jlc3Mtdmlldy1qcycpLmh0bWwoKSksXG5cbiAgICAgICAgdGFnTmFtZTogJ2RpdicsXG5cbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYW1vdW50T2ZRdWVzdGlvbnMgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Ftb3VudE9mUXVlc3Rpb25zJykpO1xuICAgICAgICAgICAgdmFyIG51bVF1ZXN0aW9uID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdudW1UZXN0UGFnZScpKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSh7XG4gICAgICAgICAgICAgICAgYW1vdW50T2ZRdWVzdGlvbnM6IGFtb3VudE9mUXVlc3Rpb25zLFxuICAgICAgICAgICAgICAgIG51bVF1ZXN0aW9uOiBudW1RdWVzdGlvblxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gUHJvZ3Jlc3NWaWV3O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcblxuICAgIHZhciBSZXN1bHQgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAkKCcjdGVzdCcpLFxuXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyNyZXN1bHQtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwicXVpei9xdWVzdGlvbnMvcmVzdWx0XCIsIHtyZXBsYWNlOiB0cnVlfSlcbiAgICAgICAgICAgICQodGhpcy5lbCkuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbmRlciBSZXN1bHRzJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBSZXN1bHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuXG4gICAgdmFyIFN0YXJ0ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSwgLy8gRE9NINGN0LvQtdC80LXQvdGCIHdpZGdldCfQsFxuXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyNmb3JtLXN0YXJ0LXRlc3QtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgXCJjbGljayAjc3RhcnRUZXN0LWpzXCI6IFwic3RhcnRUZXN0XCIgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQvdCwINC60L3QvtC/0LrQtSBcItCd0LDRh9Cw0YLRjCDRgtC10YHRglwiXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnRUZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJCgnI2lucHV0TmFtZScpLnZhbCgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCJxdWl6L3F1ZXN0aW9ucy8xXCIsIHt0cmlnZ2VyOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbnVtVGVzdFBhZ2UnLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMuZWwpLmh0bWwodGhpcy50ZW1wbGF0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFN0YXJ0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm91dGVyKSB7XG4gICAgdmFyIEJ0blRlc3QgPSByZXF1aXJlKCcuL0J0blRlc3QnKShyb3V0ZXIpO1xuICAgIHZhciBOZXh0VGVzdCA9IHJlcXVpcmUoJy4vTmV4dFRlc3QnKShyb3V0ZXIpO1xuICAgIHZhciBQcm9ncmVzc1ZpZXcgPSByZXF1aXJlKCcuL1Byb2dyZXNzVmlldycpKHJvdXRlcik7XG5cbiAgICB2YXIgUXVlc3Rpb25Db250YWluZXIgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAkKCcjdGVzdCcpLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayAjYnRuLWNvbnRpbnVlJyA6ICdtb3ZlVG9OZXh0VGVzdCdcbiAgICAgICAgfSxcblxuICAgICAgICBtb3ZlVG9OZXh0VGVzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG51bVRlc3RQYWdlID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdudW1UZXN0UGFnZScpKTtcblxuICAgICAgICAgICAgbnVtVGVzdFBhZ2UrKztcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ251bVRlc3RQYWdlJywgSlNPTi5zdHJpbmdpZnkobnVtVGVzdFBhZ2UpKTtcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcInF1aXovcXVlc3Rpb25zL1wiICsgSlNPTi5zdHJpbmdpZnkobnVtVGVzdFBhZ2UpICwge3RyaWdnZXI6IHRydWUsIHJlcGxhY2U6IHRydWV9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JLRi9C30L7QsiDQtNC70Y8gcmVuZGVyaW5nYNCz0LAgVmlldycpO1xuICAgICAgICAgICAgdmFyIGJ0blRlc3QgPSBuZXcgQnRuVGVzdCgpO1xuICAgICAgICAgICAgdmFyIG5leHRUZXN0ID0gbmV3IE5leHRUZXN0KHtcbiAgICAgICAgICAgICAgICBtb2RlbDogdGhpcy5tb2RlbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3NWaWV3ID0gbmV3IFByb2dyZXNzVmlldygpO1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKCcnKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZChwcm9ncmVzc1ZpZXcucmVuZGVyKCkpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKG5leHRUZXN0LnJlbmRlcigpKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZChidG5UZXN0LnJlbmRlcigpKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gUXVlc3Rpb25Db250YWluZXI7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb3V0ZXIsIGJ0biwgbmV4dFRleHQpIHtcblxuICAgIHZhciBTdGFydCA9IHJlcXVpcmUoJy4vdGVzdC9TdGFydCcpKHJvdXRlciksXG4gICAgICAgIGJ0blRlc3QgPSByZXF1aXJlKCcuL3Rlc3QvQnRuVGVzdCcpKHJvdXRlciksXG4gICAgICAgIE5leHRUZXN0ID0gcmVxdWlyZSAoJy4vdGVzdC9OZXh0VGVzdCcpKHJvdXRlciksXG4gICAgICAgIFByb2dyZXNzVmlldyA9IHJlcXVpcmUoJy4vdGVzdC9Qcm9ncmVzc1ZpZXcnKShyb3V0ZXIpLFxuICAgICAgICBRdWVzdGlvbkNvbnRhaW5lciA9IHJlcXVpcmUoJy4vdGVzdC9xdWVzdGlvbkNvbnRhaW5lcicpKHJvdXRlciksXG4gICAgICAgIFJlc3VsdCA9IHJlcXVpcmUoJy4vdGVzdC9SZXN1bHQnKShyb3V0ZXIpO1xuXG4gICAgdmFyIFZpZXdzID0gVmlld3MgfHwge307XG5cbiAgICBWaWV3cyA9IHtcbiAgICAgICAgc3RhcnQ6IG5ldyBTdGFydCgpLFxuICAgICAgICBuZXh0VGVzdDogbmV3IE5leHRUZXN0KCksXG4gICAgICAgIGJ0blRlc3Q6IG5ldyBidG5UZXN0KCksXG4gICAgICAgIHByb2dyZXNzVmlldzogbmV3IFByb2dyZXNzVmlldygpLFxuICAgICAgICBxdWVzdGlvbkNvbnRhaW5lcjogUXVlc3Rpb25Db250YWluZXIsXG4gICAgICAgIHJlc3VsdDogIFJlc3VsdFxuICAgIH07XG4gICAgcmV0dXJuIFZpZXdzO1xufTsiXX0=
