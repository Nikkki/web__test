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