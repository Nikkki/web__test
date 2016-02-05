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
