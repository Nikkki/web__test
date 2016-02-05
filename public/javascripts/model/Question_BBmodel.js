var Question_BBmodel = Backbone.Model.extend({
    defaults: {
        kind: '',
        text: '',
        answers: [],
        _id: '',
        __v: 0,
        amountOfDiagrams: 0
    }
});

/*-Для диаграммы Венна:
        ОБЯЗАТЕЛЬНО указываем количество диаграмм в поле amountOfDiagrams, при добавлении в БД*/
module.exports = Question_BBmodel;