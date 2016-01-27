var Checkbox_question_BBmodel = Backbone.Model.extend({
    defaults: {
        kind: 'checkbox',
        question: '',
        answers: [],
        id: ''
    }
});

module.exports = Checkbox_question_BBmodel;