var Radio_question_BBmodel = Backbone.Model.extend({
    defaults: {
        kind: 'radio',
        question: '',
        answers: [],
        id: ''
    }
});

module.exports = Radio_question_BBmodel;