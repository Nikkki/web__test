var testTypes = {
    radio: (function() {
        var answers = [];
        var input = $('.quiz-question__input:checked');
        input.each(function (index, el){
            answers.push(JSON.parse($(el).val()));
        });
        return answers;
    }()),

    checkbox: (function () {
        var answers = [];
        var input = $('.quiz-question__input:checked');
        input.each(function (index, el){
            answers.push(JSON.parse($(el).val()));
        });
        return answers;
    }()),

    tables: (function () {
        var answers = [];
        var AnswerTabelModel = function(options){
            options = options || {};
            this.name =  options.name || '';
            this.arrUserAnswers = options.arrUserAnswers || [];
        };

/*данная функция добавляет в obj массивы из строки ответов в таблице*/
        var makeTableAnswerModel = function (rows, columns, obj, nameOfEachInput) {
            for (i = 0; i < rows; i++){
                arrAnswerRow = [];
                for (j = 0; j < columns; j++) {
                    /*у каждого select`a есть уникальный selector*/
                    nameOfInput = nameOfEachInput + i+ j;
                    selector = '[name =' + nameOfInput + ']';
                    $(selector).each(function(index, el) {
                        arrAnswerRow.push($(el).val());
                        if (j === columns-1){
                            obj.arrUserAnswers.push(arrAnswerRow);
                        }
                    });
                }
            }
        };

        /*Большая таблица*/
        var hugeTable = $('.table-huge-js');
        var hugeTableObj = new AnswerTabelModel({
            name: $(hugeTable).attr('name')
        });
        makeTableAnswerModel(3, 5, hugeTableObj, 'table_select');
        answers.push(hugeTableObj);
        /*END большая таблица*/

        /*Таблица OR*/
        var smallTableOr = $('.table-small-or-js');
        var smallTableOrObj = new AnswerTabelModel({
            name: $(smallTableOr).attr('name')
        });
        makeTableAnswerModel(2, 2, smallTableOrObj, 'table-small1_select');
        answers.push(smallTableOrObj);
        /*END   Таблица OR*/

        /*Таблица AND*/
        var smallTableAnd = $('.table-small-and-js');
        var smallTableAndObj = new AnswerTabelModel({
            name: $(smallTableAnd).attr('name')
        });
        makeTableAnswerModel(2, 2, smallTableAndObj, 'table-small2_select');
        answers.push(smallTableAndObj);
        /*END  Таблица AND*/

        return answers;
    }()),

    textareaPHP: (function () {
        var answers = [];
        var code = $('.CodeMirror-line').text();
        answers.push(code);

        return answers;
    }()),
    textareaJS: (function () {
        var answers = [];
        var code = $('.CodeMirror-line').text();
        answers.push(code);

        return answers;
    }()),
     textareaHTML: (function () {
        var answers = [];
        var code = $('.CodeMirror-line').text();
        answers.push(code);

        return answers;
    }()),

    textarea: (function () {
        var answers = [];
        answers.push($('.textarea-js').val());
        return answers;
    }())

};
 module.exports = testTypes;