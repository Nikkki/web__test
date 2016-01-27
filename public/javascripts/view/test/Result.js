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