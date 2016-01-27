(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Router = require('./router/routerTest');
var router = new Router();
var BtnTest = require('./view/test/BtnTest');
var NextText =require('./view/test/NextTest');
var Views= require('./view/testView.js')(router);








},{"./router/routerTest":2,"./view/test/BtnTest":3,"./view/test/NextTest":4,"./view/testView.js":8}],2:[function(require,module,exports){
var viewsFactory = require('../view/testView.js');

var Views;
var id = 0;
var Router = Backbone.Router.extend({
    routes: {
        "quiz(/)": 'startPage', // Начальная страница
        //"quiz/questions/1(/)": 'startTest', //
        "quiz/questions/:numTestPage(/)": 'nextTest',
        "quiz/questions/result": 'result'
    },

    startPage: function () {
        var numTestPage = 0;
        if (Views.start !== null) {
            Views.start.render();
        }
        sessionStorage.removeItem('test');
        sessionStorage.removeItem('numTestPage');
        console.log('router works');
    },

    nextTest: function (numTestPage) {
        $.ajax({
            type: 'POST',
            url: '/quiz/nextTest',
            cache: false,
            async: true,
            data: {key: numTestPage},
            dataType: 'json',
            success: function (data, textStatus) {
                if (data !== false) {
                    console.log(numTestPage);
                    var dataInJSON = JSON.stringify(data);
                    console.log('Присылается с сервака' + dataInJSON);

                    sessionStorage.setItem('test', dataInJSON);
                    console.log('Записывается в sessionStorage' + sessionStorage.getItem('test', dataInJSON));

                    setTimeout(function() {
                        if (Views.questionContainer !== null) {
                            var questionContainer = new Views.questionContainer();
                            questionContainer.render();
                        }
                    }, 250);


                    return data;
                } else {
                    if (Views.result !== null) {
                        var result = new Views.result();
                        result.render();
                    }
                }

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
},{"../view/testView.js":8}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var question = JSON.parse(sessionStorage.getItem('test'));
console.log('это nextTest');
module.exports = function (router) {

    var NextTest = Backbone.View.extend({
        template: _.template($('#testQuestion-checkbox-js').html()),

        render: function () {
                $(this.el).html(this.template({question: question}));
            return this.el;
        }
    });
    return NextTest;
};
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
module.exports = function(router) {
    var BtnTest = require('./BtnTest')(router);
    var NextTest = require('./NextTest')(router);

    var QuestionContainer = Backbone.View.extend({
        el: $('#test'),
        events: {
            'click #btn-continue' : 'moveToNextTest'
        },

        moveToNextTest: function () {
            var numTestPage = JSON.parse(sessionStorage.getItem('numTestPage'));
            console.log('numTestPage from questionCont ' + numTestPage);
            numTestPage++;
            sessionStorage.setItem('numTestPage', JSON.stringify(numTestPage));
            router.navigate("quiz/questions/" + JSON.stringify(numTestPage) , {trigger: true, replace: true});
            console.log('click');
        },
        render: function () {
            console.log('Вызов для rendering`га View');
            var btnTest = new BtnTest();
            var nextTest = new NextTest();

            this.$el.html('');
            this.$el.append(nextTest.render());
            this.$el.append(btnTest.render());

            return this;
        }
    });
    return QuestionContainer;
};

},{"./BtnTest":3,"./NextTest":4}],8:[function(require,module,exports){
module.exports = function(router, btn, nextText) {

    var Start = require('./test/Start')(router),
        btnTest = require('./test/BtnTest')(router),
        NextTest = require ('./test/NextTest')(router),
        QuestionContainer = require('./test/questionContainer')(router),
        Result = require('./test/Result')(router);

    var Views = Views || {};

    Views = {
        start: new Start(),
        nextTest: new NextTest(),
        btnTest: new btnTest(),
        questionContainer: QuestionContainer,
        result:  Result
    };
    return Views;
};
},{"./test/BtnTest":3,"./test/NextTest":4,"./test/Result":5,"./test/Start":6,"./test/questionContainer":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9mYWtlX2FkYTNjNWI3LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3JvdXRlci9yb3V0ZXJUZXN0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdC9CdG5UZXN0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdC9OZXh0VGVzdC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvUmVzdWx0LmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL2phdmFzY3JpcHRzL3ZpZXcvdGVzdC9TdGFydC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy92aWV3L3Rlc3QvcXVlc3Rpb25Db250YWluZXIuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvdmlldy90ZXN0Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJvdXRlciA9IHJlcXVpcmUoJy4vcm91dGVyL3JvdXRlclRlc3QnKTtcbnZhciByb3V0ZXIgPSBuZXcgUm91dGVyKCk7XG52YXIgQnRuVGVzdCA9IHJlcXVpcmUoJy4vdmlldy90ZXN0L0J0blRlc3QnKTtcbnZhciBOZXh0VGV4dCA9cmVxdWlyZSgnLi92aWV3L3Rlc3QvTmV4dFRlc3QnKTtcbnZhciBWaWV3cz0gcmVxdWlyZSgnLi92aWV3L3Rlc3RWaWV3LmpzJykocm91dGVyKTtcblxuXG5cblxuXG5cblxuIiwidmFyIHZpZXdzRmFjdG9yeSA9IHJlcXVpcmUoJy4uL3ZpZXcvdGVzdFZpZXcuanMnKTtcblxudmFyIFZpZXdzO1xudmFyIGlkID0gMDtcbnZhciBSb3V0ZXIgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcbiAgICByb3V0ZXM6IHtcbiAgICAgICAgXCJxdWl6KC8pXCI6ICdzdGFydFBhZ2UnLCAvLyDQndCw0YfQsNC70YzQvdCw0Y8g0YHRgtGA0LDQvdC40YbQsFxuICAgICAgICAvL1wicXVpei9xdWVzdGlvbnMvMSgvKVwiOiAnc3RhcnRUZXN0JywgLy9cbiAgICAgICAgXCJxdWl6L3F1ZXN0aW9ucy86bnVtVGVzdFBhZ2UoLylcIjogJ25leHRUZXN0JyxcbiAgICAgICAgXCJxdWl6L3F1ZXN0aW9ucy9yZXN1bHRcIjogJ3Jlc3VsdCdcbiAgICB9LFxuXG4gICAgc3RhcnRQYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBudW1UZXN0UGFnZSA9IDA7XG4gICAgICAgIGlmIChWaWV3cy5zdGFydCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgVmlld3Muc3RhcnQucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgndGVzdCcpO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdudW1UZXN0UGFnZScpO1xuICAgICAgICBjb25zb2xlLmxvZygncm91dGVyIHdvcmtzJyk7XG4gICAgfSxcblxuICAgIG5leHRUZXN0OiBmdW5jdGlvbiAobnVtVGVzdFBhZ2UpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogJy9xdWl6L25leHRUZXN0JyxcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgZGF0YToge2tleTogbnVtVGVzdFBhZ2V9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG51bVRlc3RQYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFJbkpTT04gPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cf0YDQuNGB0YvQu9Cw0LXRgtGB0Y8g0YEg0YHQtdGA0LLQsNC60LAnICsgZGF0YUluSlNPTik7XG5cbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgndGVzdCcsIGRhdGFJbkpTT04pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0JfQsNC/0LjRgdGL0LLQsNC10YLRgdGPINCyIHNlc3Npb25TdG9yYWdlJyArIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3Rlc3QnLCBkYXRhSW5KU09OKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWaWV3cy5xdWVzdGlvbkNvbnRhaW5lciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbkNvbnRhaW5lciA9IG5ldyBWaWV3cy5xdWVzdGlvbkNvbnRhaW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uQ29udGFpbmVyLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAyNTApO1xuXG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFZpZXdzLnJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBWaWV3cy5yZXN1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVzdWx0OiBmdW5jdGlvbiAoKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VsdHMnKTtcbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIFZpZXdzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgVmlld3MgPSB2aWV3c0ZhY3RvcnkodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCh7cHVzaFN0YXRlOiB0cnVlLCAgcmVwbGFjZTogdHJ1ZX0pO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlcjsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChyb3V0ZXIpIHtcbiAgICB2YXIgQnRuVGVzdCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgICAgICAgdGVtcGxhdGU6Xy50ZW1wbGF0ZSgkKCcjYnRuLXRlc3QtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIHRhZ05hbWU6ICdkaXYnLFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQnRuVGVzdDtcbn07IiwidmFyIHF1ZXN0aW9uID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd0ZXN0JykpO1xuY29uc29sZS5sb2coJ9GN0YLQviBuZXh0VGVzdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG5cbiAgICB2YXIgTmV4dFRlc3QgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyN0ZXN0UXVlc3Rpb24tY2hlY2tib3gtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcy5lbCkuaHRtbCh0aGlzLnRlbXBsYXRlKHtxdWVzdGlvbjogcXVlc3Rpb259KSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBOZXh0VGVzdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocm91dGVyKSB7XG5cbiAgICB2YXIgUmVzdWx0ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSxcblxuICAgICAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgkKCcjcmVzdWx0LWpzJykuaHRtbCgpKSxcblxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcy5lbCkuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbmRlciBSZXN1bHRzJyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBSZXN1bHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHJvdXRlcikge1xuXG4gICAgdmFyIFN0YXJ0ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSwgLy8gRE9NINGN0LvQtdC80LXQvdGCIHdpZGdldCfQsFxuXG4gICAgICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyNmb3JtLXN0YXJ0LXRlc3QtanMnKS5odG1sKCkpLFxuXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgXCJjbGljayAjc3RhcnRUZXN0LWpzXCI6IFwic3RhcnRUZXN0XCIgLy8g0J7QsdGA0LDQsdC+0YLRh9C40Log0LrQu9C40LrQsCDQvdCwINC60L3QvtC/0LrQtSBcItCd0LDRh9Cw0YLRjCDRgtC10YHRglwiXG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RhcnRUZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJCgnI2lucHV0TmFtZScpLnZhbCgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCJxdWl6L3F1ZXN0aW9ucy8xXCIsIHt0cmlnZ2VyOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnbnVtVGVzdFBhZ2UnLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMuZWwpLmh0bWwodGhpcy50ZW1wbGF0ZSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIFN0YXJ0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocm91dGVyKSB7XG4gICAgdmFyIEJ0blRlc3QgPSByZXF1aXJlKCcuL0J0blRlc3QnKShyb3V0ZXIpO1xuICAgIHZhciBOZXh0VGVzdCA9IHJlcXVpcmUoJy4vTmV4dFRlc3QnKShyb3V0ZXIpO1xuXG4gICAgdmFyIFF1ZXN0aW9uQ29udGFpbmVyID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgICAgICBlbDogJCgnI3Rlc3QnKSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAnY2xpY2sgI2J0bi1jb250aW51ZScgOiAnbW92ZVRvTmV4dFRlc3QnXG4gICAgICAgIH0sXG5cbiAgICAgICAgbW92ZVRvTmV4dFRlc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBudW1UZXN0UGFnZSA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnbnVtVGVzdFBhZ2UnKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbnVtVGVzdFBhZ2UgZnJvbSBxdWVzdGlvbkNvbnQgJyArIG51bVRlc3RQYWdlKTtcbiAgICAgICAgICAgIG51bVRlc3RQYWdlKys7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdudW1UZXN0UGFnZScsIEpTT04uc3RyaW5naWZ5KG51bVRlc3RQYWdlKSk7XG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCJxdWl6L3F1ZXN0aW9ucy9cIiArIEpTT04uc3RyaW5naWZ5KG51bVRlc3RQYWdlKSAsIHt0cmlnZ2VyOiB0cnVlLCByZXBsYWNlOiB0cnVlfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2snKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JLRi9C30L7QsiDQtNC70Y8gcmVuZGVyaW5nYNCz0LAgVmlldycpO1xuICAgICAgICAgICAgdmFyIGJ0blRlc3QgPSBuZXcgQnRuVGVzdCgpO1xuICAgICAgICAgICAgdmFyIG5leHRUZXN0ID0gbmV3IE5leHRUZXN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kKG5leHRUZXN0LnJlbmRlcigpKTtcbiAgICAgICAgICAgIHRoaXMuJGVsLmFwcGVuZChidG5UZXN0LnJlbmRlcigpKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gUXVlc3Rpb25Db250YWluZXI7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyb3V0ZXIsIGJ0biwgbmV4dFRleHQpIHtcblxuICAgIHZhciBTdGFydCA9IHJlcXVpcmUoJy4vdGVzdC9TdGFydCcpKHJvdXRlciksXG4gICAgICAgIGJ0blRlc3QgPSByZXF1aXJlKCcuL3Rlc3QvQnRuVGVzdCcpKHJvdXRlciksXG4gICAgICAgIE5leHRUZXN0ID0gcmVxdWlyZSAoJy4vdGVzdC9OZXh0VGVzdCcpKHJvdXRlciksXG4gICAgICAgIFF1ZXN0aW9uQ29udGFpbmVyID0gcmVxdWlyZSgnLi90ZXN0L3F1ZXN0aW9uQ29udGFpbmVyJykocm91dGVyKSxcbiAgICAgICAgUmVzdWx0ID0gcmVxdWlyZSgnLi90ZXN0L1Jlc3VsdCcpKHJvdXRlcik7XG5cbiAgICB2YXIgVmlld3MgPSBWaWV3cyB8fCB7fTtcblxuICAgIFZpZXdzID0ge1xuICAgICAgICBzdGFydDogbmV3IFN0YXJ0KCksXG4gICAgICAgIG5leHRUZXN0OiBuZXcgTmV4dFRlc3QoKSxcbiAgICAgICAgYnRuVGVzdDogbmV3IGJ0blRlc3QoKSxcbiAgICAgICAgcXVlc3Rpb25Db250YWluZXI6IFF1ZXN0aW9uQ29udGFpbmVyLFxuICAgICAgICByZXN1bHQ6ICBSZXN1bHRcbiAgICB9O1xuICAgIHJldHVybiBWaWV3cztcbn07Il19
