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