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