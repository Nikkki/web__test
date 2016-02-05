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
            tables: _.template($('#testQuestions-tables-js').html())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9jb250cm9sbGVyL3Rlc3Qvc3RhcnRpbmdUZXN0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL2Zha2VfNWFjZDQ0ZjIuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvbW9kZWwvUXVlc3Rpb25fQkJtb2RlbC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9tb2RlbC9Vc2Vyc0Fuc3dlcnNtb2RlbC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9yb3V0ZXIvcm91dGVyVGVzdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvQnRuVGVzdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvTmV4dFRlc3QuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0L1Byb2dyZXNzVmlldy5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvUmVzdWx0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdC9TdGFydC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvcXVlc3Rpb25Db250YWluZXIuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgdmFyIGJ0blN0YXJ0ID0gICQoJyNzdGFydFRlc3QtanMnKTtcbiAgICB2YXIgYW5zd2VycyA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Fuc3dlcnMnKTtcblxuICAgIGJ0blN0YXJ0Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydGluZ1Rlc3Qgd29ya3MnKTtcbiAgICAgICAgaWYgKCQoJyNpbnB1dE5hbWUnKS52YWwoKSAhPSBcIlwiKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9ICQoJyNpbnB1dE5hbWUnKS52YWwoKTtcbiAgICAgICAgICAgIHZhciB0ZXN0SW5TZXNzaW9uU3RvciA9IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ25hbWUnLCBKU09OLnN0cmluZ2lmeShuYW1lKSk7XG4gICAgICAgICAgICB2YXIgYW5zd2Vyc0FyciA9IHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2Fuc3dlcnMnLCBKU09OLnN0cmluZ2lmeShbXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXN0SW5TZXNzaW9uU3RvcjtcblxuICAgIH0pO1xufTtcbiIsInZhciBSb3V0ZXIgPSByZXF1aXJlKCcuL3JvdXRlci9yb3V0ZXJUZXN0Jyk7XG52YXIgcm91dGVyID0gbmV3IFJvdXRlcigpO1xudmFyIEJ0blRlc3QgPSByZXF1aXJlKCcuL3ZpZXcvdGVzdC9CdG5UZXN0Jyk7XG52YXIgTmV4dFRleHQgPXJlcXVpcmUoJy4vdmlldy90ZXN0L05leHRUZXN0Jyk7XG52YXIgVmlld3M9IHJlcXVpcmUoJy4vdmlldy90ZXN0Vmlldy5qcycpKHJvdXRlcik7XG52YXIgc3RhcnRpbmdUZXN0ID0gcmVxdWlyZSgnLi9jb250cm9sbGVyL3Rlc3Qvc3RhcnRpbmdUZXN0Jykocm91dGVyKTtcblxuXG5cblxuXG5cblxuXG5cbiIsInZhciBRdWVzdGlvbl9CQm1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBraW5kOiAnJyxcbiAgICAgICAgdGV4dDogJycsXG4gICAgICAgIGFuc3dlcnM6IFtdLFxuICAgICAgICBfaWQ6ICcnLFxuICAgICAgICBfX3Y6IDAsXG4gICAgICAgIGFtb3VudE9mRGlhZ3JhbXM6IDBcbiAgICB9XG59KTtcblxuLyot0JTQu9GPINC00LjQsNCz0YDQsNC80LzRiyDQktC10L3QvdCwOlxuICAgICAgICDQntCR0K/Ql9CQ0KLQldCb0KzQndCeINGD0LrQsNC30YvQstCw0LXQvCDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC40LDQs9GA0LDQvNC8INCyINC/0L7Qu9C1IGFtb3VudE9mRGlhZ3JhbXMsINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQsiDQkdCUKi9cbm1vZHVsZS5leHBvcnRzID0gUXVlc3Rpb25fQkJtb2RlbDsiLCJ2YXIgVXNlcnNBbnN3ZXJzbW9kZWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMua2luZCA9IG9wdGlvbnMua2luZCB8fCBudWxsO1xuICAgIHRoaXMuYW5zd2VycyA9IG9wdGlvbnMuYW5zd2VycyB8fCBbXTtcbiAgICB0aGlzLl9pZCA9IG9wdGlvbnMuX2lkIHx8IG51bGw7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBVc2Vyc0Fuc3dlcnNtb2RlbDsiLCJ2YXIgdmlld3NGYWN0b3J5ID0gcmVxdWlyZSgnLi4vdmlldy90ZXN0Vmlldy5qcycpO1xudmFyIFZpZXdzO1xuXG52YXIgUXVlc3Rpb25fQkJtb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVsL1F1ZXN0aW9uX0JCbW9kZWwnKTtcbnZhciBxdWVzdGlvbl9CQm1vZGVsID0gbmV3IFF1ZXN0aW9uX0JCbW9kZWwoKTtcbnZhciBxdWVzdGlvbkNvbnRhaW5lcjtcblxudmFyIFVzZXJzQW5zd2Vyc21vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWwvVXNlcnNBbnN3ZXJzbW9kZWwnKTtcblxuXG52YXIgUm91dGVyID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XG4gICAgcm91dGVzOiB7XG4gICAgICAgIFwicXVpeigvKVwiOiAnc3RhcnRQYWdlJywgLy8g0J3QsNGH0LDQu9GM0L3QsNGPINGB0YLRgNCw0L3QuNGG0LBcbiAgICAgICAgXCJxdWl6L3F1ZXN0aW9ucy86bnVtVGVzdFBhZ2UoLylcIjogJ25leHRUZXN0JyxcbiAgICAgICAgXCJxdWl6L3F1ZXN0aW9ucy9yZXN1bHRcIjogJ3Jlc3VsdCdcbiAgICB9LFxuXG4gICAgc3RhcnRQYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBudW1UZXN0UGFnZSA9IDA7XG4gICAgICAgIGlmIChWaWV3cy5zdGFydCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgVmlld3Muc3RhcnQucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnbnVtVGVzdFBhZ2UnKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYW1vdW50T2ZRdWVzdGlvbnMnKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnYW5zd2VycycpO1xuICAgICAgICBjb25zb2xlLmxvZygncm91dGVyIHdvcmtzIG9uIFNUQVJUIHBhZ2UnKTtcbiAgICB9LFxuXG4gICAgbmV4dFRlc3Q6IGZ1bmN0aW9uIChudW1UZXN0UGFnZSkge1xuICAgICAgICBpZiAobnVtVGVzdFBhZ2UgPT0gMSl7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICdxdWl6L2Ftb3VudE9mUXVlc3Rpb25zJyxcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgdGVzdFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChWaWV3cy5xdWVzdGlvbkNvbnRhaW5lciAhPT0gbnVsbCAmJiAhcXVlc3Rpb25Db250YWluZXIpIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uQ29udGFpbmVyID0gbmV3IFZpZXdzLnF1ZXN0aW9uQ29udGFpbmVyKHtcbiAgICAgICAgICAgICAgICBtb2RlbDogcXVlc3Rpb25fQkJtb2RlbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBxdWVzdGlvbkNvbnRhaW5lci5saXN0ZW5UbyhxdWVzdGlvbl9CQm1vZGVsLCAnY2hhbmdlJywgcXVlc3Rpb25Db250YWluZXIucmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygn0JfQsNGI0LvQuCDQsiDRgNC+0YPRgiwg0LTQtdC70LDQtdC8INC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgCcpO1xuICAgICAgICBxdWVzdGlvbl9CQm1vZGVsLmZldGNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9xdWl6L25leHRUZXN0JyxcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgZGF0YToge2tleTogbnVtVGVzdFBhZ2V9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpIHtcblxuICAgICAgICAgICAgICAgIC8qYWRkaW5nIG5leHQgbW9kZWwgb2YgYW5zd2VyIGluIHNlc3Npb25TdG9yYWdlLCBidXQgd2l0aG91dCB1c2VyYHMgYW5zd2VyKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHVzZXJzQW5zd2Vyc21vZGVsID0gbmV3IFVzZXJzQW5zd2Vyc21vZGVsKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IHJlc3BvbnNlLmtpbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IHJlc3BvbnNlLl9pZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW5zd2VycycpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlcnNBcnIgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Fuc3dlcnMnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlcnNBbnN3ZXJzbW9kZWwuX2lkICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzQXJyLnB1c2godXNlcnNBbnN3ZXJzbW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyrRgdC00LXQu9Cw0L3QsCDRgtCw0LrQsNGPINGB0LjRgdGC0LXQvNCwINC00L7QsdCw0LLQu9C10L3QuNGPINCyIHNlc3Npb25TdG9yYWdlLCDRh9GC0L7QsdGLINC00YPQsdC70LjQutCw0YIg0L7RgtCy0LXRgtCwXG4gICAgICAgICAgICAgICAgICAgICAgICAg0L3QtSDQtNC+0LHQsNCy0LvRj9C70YHRjyDQsiDQvNCw0YHRgdC40LIg0L7RgtCy0LXRgtC+0LIg0L/RgNC4INC+0LHQvdC+0LLQu9C10L3QuNC4INGB0YLRgNCw0L3QuNGG0YsqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyckxlbmd0aCA9IGFuc3dlcnNBcnIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyckxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KGFuc3dlcnNBcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJyTGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhbnN3ZXJzQXJyW2Fyckxlbmd0aCAtIDFdLl9pZCA9PT0gYW5zd2Vyc0FyclthcnJMZW5ndGggLSAyXS5faWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgYW5zd2Vyc0FyclthcnJMZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbnN3ZXJzJywgSlNPTi5zdHJpbmdpZnkoYW5zd2Vyc0FycikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLypFTkQgYWRkaW5nIGFuc3dlcnMqL1xuXG4gICAgICAgICAgICAgICAgLyoqL1xuICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmNhbGxiYWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuY2FsbGJhY2suZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSAsIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCBpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qd2hlbiBzZXJ2ZXIgc2VuZHMgJ2ZhbHNlJyAtIGl0IG1lYW5zLCB0aGF0IHF1ZXN0aW9ucyBlbmRzKi9cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UgPT09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ25hbWUnKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbnN3ZXJzID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhbnN3ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyczogYW5zd2Vyc1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAncXVpei90ZXN0UmVzdWx0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHRlc3RTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFZpZXdzLnJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBWaWV3cy5yZXN1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Ftb3VudE9mUXVlc3Rpb25zJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdudW1UZXN0UGFnZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2Fuc3dlcnMnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKG1vZGVsLCByZXNwb25zZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGhhcyBiZWVuIG9jY3VyZWQgaW4gbW9kZWwgdXBkYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXN1bHQ6IGZ1bmN0aW9uICgpe1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWx0cycpO1xuXG4gICAgfSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBWaWV3cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIFZpZXdzID0gdmlld3NGYWN0b3J5KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoe3B1c2hTdGF0ZTogdHJ1ZSwgIHJlcGxhY2U6IHRydWV9KTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXI7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG4gICAgdmFyIEJ0blRlc3QgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRlbXBsYXRlOl8udGVtcGxhdGUoJCgnI2J0bi10ZXN0LWpzJykuaHRtbCgpKSxcblxuICAgICAgICB0YWdOYW1lOiAnZGl2JyxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwodGhpcy50ZW1wbGF0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEJ0blRlc3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHZhciBOZXh0VGVzdDtcbiAgICBOZXh0VGVzdCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICAgIGNoZWNrYm94OiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb24tY2hlY2tib3gtanMnKS5odG1sKCkpLFxuICAgICAgICAgICAgcmFkaW86IF8udGVtcGxhdGUoJCgnI3Rlc3RRdWVzdGlvbi1yYWRpby1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICB0ZXh0YXJlYTogXy50ZW1wbGF0ZSgkKCcjdGVzdFF1ZXN0aW9ucy10ZXh0YXJlYS1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICBkaWFncmFtVmVubjogXy50ZW1wbGF0ZSgkKCcjdGVzdFF1ZXN0aW9ucy1kaWFncmFtVmVubi1qcycpLmh0bWwoKSksXG4gICAgICAgICAgICBuZXR3b3JrOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLW5ldHdvcmstanMnKS5odG1sKCkpLFxuICAgICAgICAgICAgdGFibGVzOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb25zLXRhYmxlcy1qcycpLmh0bWwoKSlcbiAgICAgICAgfSxcblxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cg0LXQvdC00LXRgNC40L3QsyDRgdCw0LzQvtCz0L4g0YLQtdGB0YLQsCcpO1xuXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLm1vZGVsO1xuICAgICAgICAgICAgdmFyIGFtb3VudE9mUXVlc3Rpb25zID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW1vdW50T2ZRdWVzdGlvbnMnKTtcbiAgICAgICAgICAgIHZhciBudW1UZXN0UGFnZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ251bVRlc3RQYWdlJyk7XG4gICAgICAgICAgICBpZiAocXVlc3Rpb24uYXR0cmlidXRlcy5faWQgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtpbmQgPSBxdWVzdGlvbi5hdHRyaWJ1dGVzLmtpbmQ7XG4gICAgICAgICAgICAgICAgLy9raW5kINGC0LXRgdGC0LAg0LTQvtC70LbQtdC9INGB0L7QstC/0LDQtNCw0YLRjCDRgSDQvdCw0LfQstCw0L3QuNC1IHRlbXBsYXRlW9GC0LjQv11cbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGVba2luZF0oe3F1ZXN0aW9uOiB0aGlzLm1vZGVsLnRvSlNPTigpfSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCJxdWl6L3F1ZXN0aW9ucy9yZXN1bHRcIiwge3RyaWdnZXI6IHRydWV9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gTmV4dFRlc3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuICAgIHZhciBQcm9ncmVzc1ZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRlbXBsYXRlOl8udGVtcGxhdGUoJCgnI3Byb2dyZXNzLXZpZXctanMnKS5odG1sKCkpLFxuXG4gICAgICAgIHRhZ05hbWU6ICdkaXYnLFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFtb3VudE9mUXVlc3Rpb25zID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbW91bnRPZlF1ZXN0aW9ucycpKTtcbiAgICAgICAgICAgIHZhciBudW1RdWVzdGlvbiA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnbnVtVGVzdFBhZ2UnKSk7XG4gICAgICAgICAgICB0aGlzLiRlbC5odG1sKHRoaXMudGVtcGxhdGUoe1xuICAgICAgICAgICAgICAgIGFtb3VudE9mUXVlc3Rpb25zOiBhbW91bnRPZlF1ZXN0aW9ucyxcbiAgICAgICAgICAgICAgICBudW1RdWVzdGlvbjogbnVtUXVlc3Rpb25cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFByb2dyZXNzVmlldztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG5cbiAgICB2YXIgUmVzdWx0ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSxcblxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgkKCcjcmVzdWx0LWpzJykuaHRtbCgpKSxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcy5lbCkuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbmRlciBSZXN1bHRzJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBSZXN1bHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuXG4gICAgdmFyIFN0YXJ0ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSwgLy8gRE9NINGN0LvQtdC80LXQvdGCIHdpZGdldCfQsFxuXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyNmb3JtLXN0YXJ0LXRlc3QtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgXCJjbGljayAjc3RhcnRUZXN0LWpzXCI6IFwic3RhcnRUZXN0XCIgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQvdCwINC60L3QvtC/0LrQtSBcItCd0LDRh9Cw0YLRjCDRgtC10YHRglwiXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnRUZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJCgnI2lucHV0TmFtZScpLnZhbCgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCJxdWl6L3F1ZXN0aW9ucy8xXCIsIHt0cmlnZ2VyOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbnVtVGVzdFBhZ2UnLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMuZWwpLmh0bWwodGhpcy50ZW1wbGF0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFN0YXJ0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm91dGVyKSB7XG4gICAgdmFyIEJ0blRlc3QgPSByZXF1aXJlKCcuL0J0blRlc3QnKShyb3V0ZXIpO1xuICAgIHZhciBOZXh0VGVzdCA9IHJlcXVpcmUoJy4vTmV4dFRlc3QnKShyb3V0ZXIpO1xuICAgIHZhciBQcm9ncmVzc1ZpZXcgPSByZXF1aXJlKCcuL1Byb2dyZXNzVmlldycpKHJvdXRlcik7XG5cbiAgICB2YXIgUXVlc3Rpb25Db250YWluZXIgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIGVsOiAkKCcjdGVzdCcpLFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICdjbGljayAjYnRuLWNvbnRpbnVlJyA6ICdtb3ZlVG9OZXh0VGVzdCdcbiAgICAgICAgfSxcblxuICAgICAgICBtb3ZlVG9OZXh0VGVzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrJyk7XG4gICAgICAgICAgICB2YXIgbnVtVGVzdFBhZ2UgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ251bVRlc3RQYWdlJykpO1xuXG4gICAgICAgICAgICBudW1UZXN0UGFnZSsrO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbnVtVGVzdFBhZ2UnLCBKU09OLnN0cmluZ2lmeShudW1UZXN0UGFnZSkpO1xuICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwicXVpei9xdWVzdGlvbnMvXCIgKyBKU09OLnN0cmluZ2lmeShudW1UZXN0UGFnZSkgLCB7dHJpZ2dlcjogdHJ1ZSwgcmVwbGFjZTogdHJ1ZX0pO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQktGL0LfQvtCyINC00LvRjyByZW5kZXJpbmdg0LPQsCBWaWV3Jyk7XG4gICAgICAgICAgICB2YXIgYnRuVGVzdCA9IG5ldyBCdG5UZXN0KCk7XG4gICAgICAgICAgICB2YXIgbmV4dFRlc3QgPSBuZXcgTmV4dFRlc3Qoe1xuICAgICAgICAgICAgICAgIG1vZGVsOiB0aGlzLm1vZGVsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBwcm9ncmVzc1ZpZXcgPSBuZXcgUHJvZ3Jlc3NWaWV3KCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKHByb2dyZXNzVmlldy5yZW5kZXIoKSk7XG4gICAgICAgICAgICB0aGlzLiRlbC5hcHBlbmQobmV4dFRlc3QucmVuZGVyKCkpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKGJ0blRlc3QucmVuZGVyKCkpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBRdWVzdGlvbkNvbnRhaW5lcjtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJvdXRlciwgYnRuLCBuZXh0VGV4dCkge1xuXG4gICAgdmFyIFN0YXJ0ID0gcmVxdWlyZSgnLi90ZXN0L1N0YXJ0Jykocm91dGVyKSxcbiAgICAgICAgYnRuVGVzdCA9IHJlcXVpcmUoJy4vdGVzdC9CdG5UZXN0Jykocm91dGVyKSxcbiAgICAgICAgTmV4dFRlc3QgPSByZXF1aXJlICgnLi90ZXN0L05leHRUZXN0Jykocm91dGVyKSxcbiAgICAgICAgUHJvZ3Jlc3NWaWV3ID0gcmVxdWlyZSgnLi90ZXN0L1Byb2dyZXNzVmlldycpKHJvdXRlciksXG4gICAgICAgIFF1ZXN0aW9uQ29udGFpbmVyID0gcmVxdWlyZSgnLi90ZXN0L3F1ZXN0aW9uQ29udGFpbmVyJykocm91dGVyKSxcbiAgICAgICAgUmVzdWx0ID0gcmVxdWlyZSgnLi90ZXN0L1Jlc3VsdCcpKHJvdXRlcik7XG5cbiAgICB2YXIgVmlld3MgPSBWaWV3cyB8fCB7fTtcblxuICAgIFZpZXdzID0ge1xuICAgICAgICBzdGFydDogbmV3IFN0YXJ0KCksXG4gICAgICAgIG5leHRUZXN0OiBuZXcgTmV4dFRlc3QoKSxcbiAgICAgICAgYnRuVGVzdDogbmV3IGJ0blRlc3QoKSxcbiAgICAgICAgcHJvZ3Jlc3NWaWV3OiBuZXcgUHJvZ3Jlc3NWaWV3KCksXG4gICAgICAgIHF1ZXN0aW9uQ29udGFpbmVyOiBRdWVzdGlvbkNvbnRhaW5lcixcbiAgICAgICAgcmVzdWx0OiAgUmVzdWx0XG4gICAgfTtcbiAgICByZXR1cm4gVmlld3M7XG59OyJdfQ==
