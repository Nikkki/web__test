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