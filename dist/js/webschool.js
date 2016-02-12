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
                router.navigate("quiz/questions/result", {trigger: true})
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
            console.log('click');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9jb250cm9sbGVyL3Rlc3Qvc3RhcnRpbmdUZXN0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL2Zha2VfMzlmNzk3NDAuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvbW9kZWwvUXVlc3Rpb25fQkJtb2RlbC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9tb2RlbC9Vc2Vyc0Fuc3dlcnNtb2RlbC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9yb3V0ZXIvcm91dGVyVGVzdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvQnRuVGVzdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvTmV4dFRlc3QuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0L1Byb2dyZXNzVmlldy5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvUmVzdWx0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdC9TdGFydC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvcXVlc3Rpb25Db250YWluZXIuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHZhciBidG5TdGFydCA9ICAkKCcjc3RhcnRUZXN0LWpzJyk7XG4gICAgdmFyIGFuc3dlcnMgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJyk7XG5cbiAgICBidG5TdGFydC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmdUZXN0IHdvcmtzJyk7XG4gICAgICAgIGlmICgkKCcjaW5wdXROYW1lJykudmFsKCkgIT0gXCJcIikge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKCcjaW5wdXROYW1lJykudmFsKCk7XG4gICAgICAgICAgICB2YXIgdGVzdEluU2Vzc2lvblN0b3IgPSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCduYW1lJywgSlNPTi5zdHJpbmdpZnkobmFtZSkpO1xuICAgICAgICAgICAgdmFyIGFuc3dlcnNBcnIgPSBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbnN3ZXJzJywgSlNPTi5zdHJpbmdpZnkoW10pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVzdEluU2Vzc2lvblN0b3I7XG5cbiAgICB9KTtcbn07XG4iLCJ2YXIgUm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXIvcm91dGVyVGVzdCcpO1xudmFyIHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcbnZhciBCdG5UZXN0ID0gcmVxdWlyZSgnLi92aWV3L3Rlc3QvQnRuVGVzdCcpO1xudmFyIE5leHRUZXh0ID1yZXF1aXJlKCcuL3ZpZXcvdGVzdC9OZXh0VGVzdCcpO1xudmFyIFZpZXdzPSByZXF1aXJlKCcuL3ZpZXcvdGVzdFZpZXcuanMnKShyb3V0ZXIpO1xudmFyIHN0YXJ0aW5nVGVzdCA9IHJlcXVpcmUoJy4vY29udHJvbGxlci90ZXN0L3N0YXJ0aW5nVGVzdCcpKHJvdXRlcik7XG5cblxuXG5cblxuXG5cblxuXG4iLCJ2YXIgUXVlc3Rpb25fQkJtb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAga2luZDogJycsXG4gICAgICAgIHRleHQ6ICcnLFxuICAgICAgICBhbnN3ZXJzOiBbXSxcbiAgICAgICAgX2lkOiAnJyxcbiAgICAgICAgX192OiAwLFxuICAgICAgICBhbW91bnRPZkRpYWdyYW1zOiAwXG4gICAgfVxufSk7XG5cbi8qLdCU0LvRjyDQtNC40LDQs9GA0LDQvNC80Ysg0JLQtdC90L3QsDpcbiAgICAgICAg0J7QkdCv0JfQkNCi0JXQm9Cs0J3QniDRg9C60LDQt9GL0LLQsNC10Lwg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQuNCw0LPRgNCw0LzQvCDQsiDQv9C+0LvQtSBhbW91bnRPZkRpYWdyYW1zLCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0LIg0JHQlCovXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXN0aW9uX0JCbW9kZWw7IiwidmFyIFVzZXJzQW5zd2Vyc21vZGVsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmtpbmQgPSBvcHRpb25zLmtpbmQgfHwgbnVsbDtcbiAgICB0aGlzLmFuc3dlcnMgPSBvcHRpb25zLmFuc3dlcnMgfHwgW107XG4gICAgdGhpcy5faWQgPSBvcHRpb25zLl9pZCB8fCBudWxsO1xuICAgIHRoaXMudGV4dCA9IG9wdGlvbnMudGV4dCB8fCAnJztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJzQW5zd2Vyc21vZGVsOyIsInZhciB2aWV3c0ZhY3RvcnkgPSByZXF1aXJlKCcuLi92aWV3L3Rlc3RWaWV3LmpzJyk7XG52YXIgVmlld3M7XG5cbnZhciBRdWVzdGlvbl9CQm1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvUXVlc3Rpb25fQkJtb2RlbCcpO1xudmFyIHF1ZXN0aW9uX0JCbW9kZWwgPSBuZXcgUXVlc3Rpb25fQkJtb2RlbCgpO1xudmFyIHF1ZXN0aW9uQ29udGFpbmVyO1xuXG52YXIgVXNlcnNBbnN3ZXJzbW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbC9Vc2Vyc0Fuc3dlcnNtb2RlbCcpO1xuXG52YXIgUm91dGVyID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG4gICAgcm91dGVzOiB7XG4gICAgICAgIFwicXVpeigvKVwiOiAnc3RhcnRQYWdlJywgLy8g0J3QsNGH0LDQu9GM0L3QsNGPINGB0YLRgNCw0L3QuNGG0LBcbiAgICAgICAgXCJxdWl6L3F1ZXN0aW9ucy86bnVtVGVzdFBhZ2UoLylcIjogJ25leHRUZXN0JyxcbiAgICAgICAgXCJxdWl6L3F1ZXN0aW9ucy9yZXN1bHRcIjogJ3Jlc3VsdCdcbiAgICB9LFxuXG4gICAgc3RhcnRQYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBudW1UZXN0UGFnZSA9IDA7XG4gICAgICAgIGlmIChWaWV3cy5zdGFydCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgVmlld3Muc3RhcnQucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbnVtVGVzdFBhZ2UnKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYW1vdW50T2ZRdWVzdGlvbnMnKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYW5zd2VycycpO1xuICAgICAgICBjb25zb2xlLmxvZygncm91dGVyIHdvcmtzIG9uIFNUQVJUIHBhZ2UnKTtcbiAgICB9LFxuXG4gICAgbmV4dFRlc3Q6IGZ1bmN0aW9uIChudW1UZXN0UGFnZSkge1xuICAgICAgICBpZiAobnVtVGVzdFBhZ2UgPT0gMSl7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICdxdWl6L2Ftb3VudE9mUXVlc3Rpb25zJyxcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgdGVzdFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChWaWV3cy5xdWVzdGlvbkNvbnRhaW5lciAhPT0gbnVsbCAmJiAhcXVlc3Rpb25Db250YWluZXIpIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uQ29udGFpbmVyID0gbmV3IFZpZXdzLnF1ZXN0aW9uQ29udGFpbmVyKHtcbiAgICAgICAgICAgICAgICBtb2RlbDogcXVlc3Rpb25fQkJtb2RlbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBxdWVzdGlvbkNvbnRhaW5lci5saXN0ZW5UbyhxdWVzdGlvbl9CQm1vZGVsLCAnY2hhbmdlJywgcXVlc3Rpb25Db250YWluZXIucmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygn0JfQsNGI0LvQuCDQsiDRgNC+0YPRgiwg0LTQtdC70LDQtdC8INC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgCcpO1xuICAgICAgICBxdWVzdGlvbl9CQm1vZGVsLmZldGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9xdWl6L25leHRUZXN0JyxcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgZGF0YToge2tleTogbnVtVGVzdFBhZ2V9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgICAgIC8qYWRkaW5nIG5leHQgbW9kZWwgb2YgYW5zd2VyIGluIHNlc3Npb25TdG9yYWdlLCBidXQgd2l0aG91dCB1c2VyYHMgYW5zd2VyKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJzQW5zd2Vyc21vZGVsID0gbmV3IFVzZXJzQW5zd2Vyc21vZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IHJlc3BvbnNlLmtpbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHJlc3BvbnNlLl9pZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW5zd2VycycpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlcnNBcnIgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Fuc3dlcnMnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlcnNBbnN3ZXJzbW9kZWwuX2lkICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzQXJyLnB1c2godXNlcnNBbnN3ZXJzbW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyrRgdC00LXQu9Cw0L3QsCDRgtCw0LrQsNGPINGB0LjRgdGC0LXQvNCwINC00L7QsdCw0LLQu9C10L3QuNGPINCyIHNlc3Npb25TdG9yYWdlLCDRh9GC0L7QsdGLINC00YPQsdC70LjQutCw0YIg0L7RgtCy0LXRgtCwXG4gICAgICAgICAgICAgICAgICAgICAgICAg0L3QtSDQtNC+0LHQsNCy0LvRj9C70YHRjyDQsiDQvNCw0YHRgdC40LIg0L7RgtCy0LXRgtC+0LIg0L/RgNC4INC+0LHQvdC+0LLQu9C10L3QuNC4INGB0YLRgNCw0L3QuNGG0YsqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyckxlbmd0aCA9IGFuc3dlcnNBcnIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyckxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KGFuc3dlcnNBcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyTGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhbnN3ZXJzQXJyW2Fyckxlbmd0aCAtIDFdLl9pZCA9PT0gYW5zd2Vyc0FyclthcnJMZW5ndGggLSAyXS5faWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgYW5zd2Vyc0FyclthcnJMZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbnN3ZXJzJywgSlNPTi5zdHJpbmdpZnkoYW5zd2Vyc0FycikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLypFTkQgYWRkaW5nIGFuc3dlcnMqL1xuXG4gICAgICAgICAgICAgICAgLyoqL1xuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuY2FsbGJhY2suZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSAsIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qd2hlbiBzZXJ2ZXIgc2VuZHMgJ2ZhbHNlJyAtIGl0IG1lYW5zLCB0aGF0IHF1ZXN0aW9ucyBlbmRzKi9cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ25hbWUnKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhbnN3ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyczogYW5zd2Vyc1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAncXVpei90ZXN0UmVzdWx0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHRlc3RTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFZpZXdzLnJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBWaWV3cy5yZXN1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Ftb3VudE9mUXVlc3Rpb25zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdudW1UZXN0UGFnZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Fuc3dlcnMnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGhhcyBiZWVuIG9jY3VyZWQgaW4gbW9kZWwgdXBkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXN1bHQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWx0cycpO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIFZpZXdzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgVmlld3MgPSB2aWV3c0ZhY3RvcnkodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCh7cHVzaFN0YXRlOiB0cnVlLCAgcmVwbGFjZTogdHJ1ZX0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICB2YXIgQnRuVGVzdCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGVtcGxhdGU6Xy50ZW1wbGF0ZSgkKCcjYnRuLXRlc3QtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIHRhZ05hbWU6ICdkaXYnLFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQnRuVGVzdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgdmFyIE5leHRUZXN0O1xuICAgIE5leHRUZXN0ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICB0ZW1wbGF0ZToge1xuICAgICAgICAgICAgY2hlY2tib3g6IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbi1jaGVja2JveC1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICByYWRpbzogXy50ZW1wbGF0ZSgkKCcjdGVzdFF1ZXN0aW9uLXJhZGlvLWpzJykuaHRtbCgpKSxcbiAgICAgICAgICAgIHRleHRhcmVhOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLXRleHRhcmVhLWpzJykuaHRtbCgpKSxcbiAgICAgICAgICAgIGRpYWdyYW1WZW5uOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLWRpYWdyYW1WZW5uLWpzJykuaHRtbCgpKSxcbiAgICAgICAgICAgIG5ldHdvcms6IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbnMtbmV0d29yay1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICB0YWJsZXM6IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbnMtdGFibGVzLWpzJykuaHRtbCgpKSxcbiAgICAgICAgICAgIHRleHRhcmVhSlM6IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbnMtdGV4dGFyZWFKUy1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICB0ZXh0YXJlYUhUTUw6IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbnMtdGV4dGFyZWFIVE1MLWpzJykuaHRtbCgpKSxcbiAgICAgICAgICAgIHRleHRhcmVhUEhQOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLXRleHRhcmVhUEhQLWpzJykuaHRtbCgpKVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cg0LXQvdC00LXRgNC40L3QsyDRgdCw0LzQvtCz0L4g0YLQtdGB0YLQsCcpO1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5tb2RlbDtcbiAgICAgICAgICAgIHZhciBhbW91bnRPZlF1ZXN0aW9ucyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Ftb3VudE9mUXVlc3Rpb25zJyk7XG4gICAgICAgICAgICB2YXIgbnVtVGVzdFBhZ2UgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdudW1UZXN0UGFnZScpO1xuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uLmF0dHJpYnV0ZXMuX2lkICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHZhciBraW5kID0gcXVlc3Rpb24uYXR0cmlidXRlcy5raW5kO1xuICAgICAgICAgICAgICAgIC8va2luZCDRgtC10YHRgtCwINC00L7Qu9C20LXQvSDRgdC+0LLQv9Cw0LTQsNGC0Ywg0YEg0L3QsNC30LLQsNC90LjQtSB0ZW1wbGF0ZVvRgtC40L9dXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlW2tpbmRdKHtxdWVzdGlvbjogdGhpcy5tb2RlbC50b0pTT04oKX0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwicXVpei9xdWVzdGlvbnMvcmVzdWx0XCIsIHt0cmlnZ2VyOiB0cnVlfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIE5leHRUZXN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICB2YXIgUHJvZ3Jlc3NWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICB0ZW1wbGF0ZTpfLnRlbXBsYXRlKCQoJyNwcm9ncmVzcy12aWV3LWpzJykuaHRtbCgpKSxcblxuICAgICAgICB0YWdOYW1lOiAnZGl2JyxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhbW91bnRPZlF1ZXN0aW9ucyA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW1vdW50T2ZRdWVzdGlvbnMnKSk7XG4gICAgICAgICAgICB2YXIgbnVtUXVlc3Rpb24gPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ251bVRlc3RQYWdlJykpO1xuICAgICAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHtcbiAgICAgICAgICAgICAgICBhbW91bnRPZlF1ZXN0aW9uczogYW1vdW50T2ZRdWVzdGlvbnMsXG4gICAgICAgICAgICAgICAgbnVtUXVlc3Rpb246IG51bVF1ZXN0aW9uXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBQcm9ncmVzc1ZpZXc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuXG4gICAgdmFyIFJlc3VsdCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICQoJyN0ZXN0JyksXG5cbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJCgnI3Jlc3VsdC1qcycpLmh0bWwoKSksXG5cbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMuZWwpLmh0bWwodGhpcy50ZW1wbGF0ZSgpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZW5kZXIgUmVzdWx0cycpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gUmVzdWx0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcblxuICAgIHZhciBTdGFydCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgZWw6ICQoJyN0ZXN0JyksIC8vIERPTSDRjdC70LXQvNC10L3RgiB3aWRnZXQn0LBcblxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgkKCcjZm9ybS1zdGFydC10ZXN0LWpzJykuaHRtbCgpKSxcblxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIFwiY2xpY2sgI3N0YXJ0VGVzdC1qc1wiOiBcInN0YXJ0VGVzdFwiIC8vINCe0LHRgNCw0LHQvtGC0YfQuNC6INC60LvQuNC60LAg0L3QsCDQutC90L7Qv9C60LUgXCLQndCw0YfQsNGC0Ywg0YLQtdGB0YJcIlxuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0VGVzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCQoJyNpbnB1dE5hbWUnKS52YWwoKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwicXVpei9xdWVzdGlvbnMvMVwiLCB7dHJpZ2dlcjogdHJ1ZX0pO1xuICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ251bVRlc3RQYWdlJywgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzLmVsKS5odG1sKHRoaXMudGVtcGxhdGUoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBTdGFydDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvdXRlcikge1xuICAgIHZhciBCdG5UZXN0ID0gcmVxdWlyZSgnLi9CdG5UZXN0Jykocm91dGVyKTtcbiAgICB2YXIgTmV4dFRlc3QgPSByZXF1aXJlKCcuL05leHRUZXN0Jykocm91dGVyKTtcbiAgICB2YXIgUHJvZ3Jlc3NWaWV3ID0gcmVxdWlyZSgnLi9Qcm9ncmVzc1ZpZXcnKShyb3V0ZXIpO1xuXG4gICAgdmFyIFF1ZXN0aW9uQ29udGFpbmVyID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgI2J0bi1jb250aW51ZScgOiAnbW92ZVRvTmV4dFRlc3QnXG4gICAgICAgIH0sXG5cbiAgICAgICAgbW92ZVRvTmV4dFRlc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljaycpO1xuICAgICAgICAgICAgdmFyIG51bVRlc3RQYWdlID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdudW1UZXN0UGFnZScpKTtcblxuICAgICAgICAgICAgbnVtVGVzdFBhZ2UrKztcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ251bVRlc3RQYWdlJywgSlNPTi5zdHJpbmdpZnkobnVtVGVzdFBhZ2UpKTtcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcInF1aXovcXVlc3Rpb25zL1wiICsgSlNPTi5zdHJpbmdpZnkobnVtVGVzdFBhZ2UpICwge3RyaWdnZXI6IHRydWUsIHJlcGxhY2U6IHRydWV9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JLRi9C30L7QsiDQtNC70Y8gcmVuZGVyaW5nYNCz0LAgVmlldycpO1xuICAgICAgICAgICAgdmFyIGJ0blRlc3QgPSBuZXcgQnRuVGVzdCgpO1xuICAgICAgICAgICAgdmFyIG5leHRUZXN0ID0gbmV3IE5leHRUZXN0KHtcbiAgICAgICAgICAgICAgICBtb2RlbDogdGhpcy5tb2RlbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3NWaWV3ID0gbmV3IFByb2dyZXNzVmlldygpO1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKCcnKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZChwcm9ncmVzc1ZpZXcucmVuZGVyKCkpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKG5leHRUZXN0LnJlbmRlcigpKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZChidG5UZXN0LnJlbmRlcigpKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gUXVlc3Rpb25Db250YWluZXI7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb3V0ZXIsIGJ0biwgbmV4dFRleHQpIHtcblxuICAgIHZhciBTdGFydCA9IHJlcXVpcmUoJy4vdGVzdC9TdGFydCcpKHJvdXRlciksXG4gICAgICAgIGJ0blRlc3QgPSByZXF1aXJlKCcuL3Rlc3QvQnRuVGVzdCcpKHJvdXRlciksXG4gICAgICAgIE5leHRUZXN0ID0gcmVxdWlyZSAoJy4vdGVzdC9OZXh0VGVzdCcpKHJvdXRlciksXG4gICAgICAgIFByb2dyZXNzVmlldyA9IHJlcXVpcmUoJy4vdGVzdC9Qcm9ncmVzc1ZpZXcnKShyb3V0ZXIpLFxuICAgICAgICBRdWVzdGlvbkNvbnRhaW5lciA9IHJlcXVpcmUoJy4vdGVzdC9xdWVzdGlvbkNvbnRhaW5lcicpKHJvdXRlciksXG4gICAgICAgIFJlc3VsdCA9IHJlcXVpcmUoJy4vdGVzdC9SZXN1bHQnKShyb3V0ZXIpO1xuXG4gICAgdmFyIFZpZXdzID0gVmlld3MgfHwge307XG5cbiAgICBWaWV3cyA9IHtcbiAgICAgICAgc3RhcnQ6IG5ldyBTdGFydCgpLFxuICAgICAgICBuZXh0VGVzdDogbmV3IE5leHRUZXN0KCksXG4gICAgICAgIGJ0blRlc3Q6IG5ldyBidG5UZXN0KCksXG4gICAgICAgIHByb2dyZXNzVmlldzogbmV3IFByb2dyZXNzVmlldygpLFxuICAgICAgICBxdWVzdGlvbkNvbnRhaW5lcjogUXVlc3Rpb25Db250YWluZXIsXG4gICAgICAgIHJlc3VsdDogIFJlc3VsdFxuICAgIH07XG4gICAgcmV0dXJuIFZpZXdzO1xufTsiXX0=
