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