(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controller = require('./js/controller');
var nextTestController = require('./js/nextTestController');
},{"./js/controller":2,"./js/nextTestController":3}],2:[function(require,module,exports){
module.exports = $('#btn-continue').on('click', function (event) {
    var answersArr = JSON.parse(sessionStorage.getItem('answers'));
    var arrLength = answersArr.length;
    var kind = answersArr[arrLength - 1].kind;
    var nextTextController = require('./nextTestController');
    //var testTypes = require('./testTypes');

    if(kind === 'diagramVenn'){
        console.log('diagramVenn');
        event.preventDefault();
    }

    nextTextController(kind);

});

},{"./nextTestController":3}],3:[function(require,module,exports){
var nextTestController = function(kind){
    var testTypes = require('./testTypes');
    for (var key in testTypes){
        /*
        * Т.к., например, модель диаграммы Венна записывается в sessionStorage в другой части приложения, то
         * данное условие: kind in testTypes -  при выборе типа вопроса не будет обрабатываться
          * и не будет ломать в sessionStorage записи
         * :
        * */
        if(kind in testTypes) {
            var answersArr = JSON.parse(sessionStorage.getItem('answers'));
            var arrLength = answersArr.length;
            answersArr[arrLength - 1].answers = testTypes[kind];
            console.log(answersArr);
            sessionStorage.setItem('answers', JSON.stringify(answersArr));
        }
    }
};

module.exports = nextTestController;
},{"./testTypes":4}],4:[function(require,module,exports){
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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvZmFrZV9jYzE2ZTUzNS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvanMvY29udHJvbGxlci5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvanMvbmV4dFRlc3RDb250cm9sbGVyLmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL3Rlc3RDb250cm9sbGVycy9qcy90ZXN0VHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29udHJvbGxlciA9IHJlcXVpcmUoJy4vanMvY29udHJvbGxlcicpO1xudmFyIG5leHRUZXN0Q29udHJvbGxlciA9IHJlcXVpcmUoJy4vanMvbmV4dFRlc3RDb250cm9sbGVyJyk7IiwibW9kdWxlLmV4cG9ydHMgPSAkKCcjYnRuLWNvbnRpbnVlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGFuc3dlcnNBcnIgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Fuc3dlcnMnKSk7XG4gICAgdmFyIGFyckxlbmd0aCA9IGFuc3dlcnNBcnIubGVuZ3RoO1xuICAgIHZhciBraW5kID0gYW5zd2Vyc0FyclthcnJMZW5ndGggLSAxXS5raW5kO1xuICAgIHZhciBuZXh0VGV4dENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL25leHRUZXN0Q29udHJvbGxlcicpO1xuICAgIC8vdmFyIHRlc3RUeXBlcyA9IHJlcXVpcmUoJy4vdGVzdFR5cGVzJyk7XG5cbiAgICBpZihraW5kID09PSAnZGlhZ3JhbVZlbm4nKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2RpYWdyYW1WZW5uJyk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgbmV4dFRleHRDb250cm9sbGVyKGtpbmQpO1xuXG59KTtcbiIsInZhciBuZXh0VGVzdENvbnRyb2xsZXIgPSBmdW5jdGlvbihraW5kKXtcbiAgICB2YXIgdGVzdFR5cGVzID0gcmVxdWlyZSgnLi90ZXN0VHlwZXMnKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGVzdFR5cGVzKXtcbiAgICAgICAgLypcbiAgICAgICAgKiDQoi7Qui4sINC90LDQv9GA0LjQvNC10YAsINC80L7QtNC10LvRjCDQtNC40LDQs9GA0LDQvNC80Ysg0JLQtdC90L3QsCDQt9Cw0L/QuNGB0YvQstCw0LXRgtGB0Y8g0LIgc2Vzc2lvblN0b3JhZ2Ug0LIg0LTRgNGD0LPQvtC5INGH0LDRgdGC0Lgg0L/RgNC40LvQvtC20LXQvdC40Y8sINGC0L5cbiAgICAgICAgICog0LTQsNC90L3QvtC1INGD0YHQu9C+0LLQuNC1OiBraW5kIGluIHRlc3RUeXBlcyAtICDQv9GA0Lgg0LLRi9Cx0L7RgNC1INGC0LjQv9CwINCy0L7Qv9GA0L7RgdCwINC90LUg0LHRg9C00LXRgiDQvtCx0YDQsNCx0LDRgtGL0LLQsNGC0YzRgdGPXG4gICAgICAgICAgKiDQuCDQvdC1INCx0YPQtNC10YIg0LvQvtC80LDRgtGMINCyIHNlc3Npb25TdG9yYWdlINC30LDQv9C40YHQuFxuICAgICAgICAgKiA6XG4gICAgICAgICogKi9cbiAgICAgICAgaWYoa2luZCBpbiB0ZXN0VHlwZXMpIHtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJzQXJyID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgICAgICAgICAgdmFyIGFyckxlbmd0aCA9IGFuc3dlcnNBcnIubGVuZ3RoO1xuICAgICAgICAgICAgYW5zd2Vyc0FyclthcnJMZW5ndGggLSAxXS5hbnN3ZXJzID0gdGVzdFR5cGVzW2tpbmRdO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYW5zd2Vyc0Fycik7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbnN3ZXJzJywgSlNPTi5zdHJpbmdpZnkoYW5zd2Vyc0FycikpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXh0VGVzdENvbnRyb2xsZXI7IiwidmFyIHRlc3RUeXBlcyA9IHtcbiAgICByYWRpbzogKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYW5zd2VycyA9IFtdO1xuICAgICAgICB2YXIgaW5wdXQgPSAkKCcucXVpei1xdWVzdGlvbl9faW5wdXQ6Y2hlY2tlZCcpO1xuICAgICAgICBpbnB1dC5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWwpe1xuICAgICAgICAgICAgYW5zd2Vycy5wdXNoKEpTT04ucGFyc2UoJChlbCkudmFsKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhbnN3ZXJzO1xuICAgIH0oKSksXG5cbiAgICBjaGVja2JveDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBbXTtcbiAgICAgICAgdmFyIGlucHV0ID0gJCgnLnF1aXotcXVlc3Rpb25fX2lucHV0OmNoZWNrZWQnKTtcbiAgICAgICAgaW5wdXQuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKXtcbiAgICAgICAgICAgIGFuc3dlcnMucHVzaChKU09OLnBhcnNlKCQoZWwpLnZhbCgpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYW5zd2VycztcbiAgICB9KCkpLFxuXG4gICAgdGFibGVzOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5zd2VycyA9IFtdO1xuICAgICAgICB2YXIgQW5zd2VyVGFiZWxNb2RlbCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAgb3B0aW9ucy5uYW1lIHx8ICcnO1xuICAgICAgICAgICAgdGhpcy5hcnJVc2VyQW5zd2VycyA9IG9wdGlvbnMuYXJyVXNlckFuc3dlcnMgfHwgW107XG4gICAgICAgIH07XG5cbi8q0LTQsNC90L3QsNGPINGE0YPQvdC60YbQuNGPINC00L7QsdCw0LLQu9GP0LXRgiDQsiBvYmog0LzQsNGB0YHQuNCy0Ysg0LjQtyDRgdGC0YDQvtC60Lgg0L7RgtCy0LXRgtC+0LIg0LIg0YLQsNCx0LvQuNGG0LUqL1xuICAgICAgICB2YXIgbWFrZVRhYmxlQW5zd2VyTW9kZWwgPSBmdW5jdGlvbiAocm93cywgY29sdW1ucywgb2JqLCBuYW1lT2ZFYWNoSW5wdXQpIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByb3dzOyBpKyspe1xuICAgICAgICAgICAgICAgIGFyckFuc3dlclJvdyA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLyrRgyDQutCw0LbQtNC+0LPQviBzZWxlY3RgYSDQtdGB0YLRjCDRg9C90LjQutCw0LvRjNC90YvQuSBzZWxlY3RvciovXG4gICAgICAgICAgICAgICAgICAgIG5hbWVPZklucHV0ID0gbmFtZU9mRWFjaElucHV0ICsgaSsgajtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IgPSAnW25hbWUgPScgKyBuYW1lT2ZJbnB1dCArICddJztcbiAgICAgICAgICAgICAgICAgICAgJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyckFuc3dlclJvdy5wdXNoKCQoZWwpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBjb2x1bW5zLTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iai5hcnJVc2VyQW5zd2Vycy5wdXNoKGFyckFuc3dlclJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKtCR0L7Qu9GM0YjQsNGPINGC0LDQsdC70LjRhtCwKi9cbiAgICAgICAgdmFyIGh1Z2VUYWJsZSA9ICQoJy50YWJsZS1odWdlLWpzJyk7XG4gICAgICAgIHZhciBodWdlVGFibGVPYmogPSBuZXcgQW5zd2VyVGFiZWxNb2RlbCh7XG4gICAgICAgICAgICBuYW1lOiAkKGh1Z2VUYWJsZSkuYXR0cignbmFtZScpXG4gICAgICAgIH0pO1xuICAgICAgICBtYWtlVGFibGVBbnN3ZXJNb2RlbCgzLCA1LCBodWdlVGFibGVPYmosICd0YWJsZV9zZWxlY3QnKTtcbiAgICAgICAgYW5zd2Vycy5wdXNoKGh1Z2VUYWJsZU9iaik7XG4gICAgICAgIC8qRU5EINCx0L7Qu9GM0YjQsNGPINGC0LDQsdC70LjRhtCwKi9cblxuICAgICAgICAvKtCi0LDQsdC70LjRhtCwIE9SKi9cbiAgICAgICAgdmFyIHNtYWxsVGFibGVPciA9ICQoJy50YWJsZS1zbWFsbC1vci1qcycpO1xuICAgICAgICB2YXIgc21hbGxUYWJsZU9yT2JqID0gbmV3IEFuc3dlclRhYmVsTW9kZWwoe1xuICAgICAgICAgICAgbmFtZTogJChzbWFsbFRhYmxlT3IpLmF0dHIoJ25hbWUnKVxuICAgICAgICB9KTtcbiAgICAgICAgbWFrZVRhYmxlQW5zd2VyTW9kZWwoMiwgMiwgc21hbGxUYWJsZU9yT2JqLCAndGFibGUtc21hbGwxX3NlbGVjdCcpO1xuICAgICAgICBhbnN3ZXJzLnB1c2goc21hbGxUYWJsZU9yT2JqKTtcbiAgICAgICAgLypFTkQgICDQotCw0LHQu9C40YbQsCBPUiovXG5cbiAgICAgICAgLyrQotCw0LHQu9C40YbQsCBBTkQqL1xuICAgICAgICB2YXIgc21hbGxUYWJsZUFuZCA9ICQoJy50YWJsZS1zbWFsbC1hbmQtanMnKTtcbiAgICAgICAgdmFyIHNtYWxsVGFibGVBbmRPYmogPSBuZXcgQW5zd2VyVGFiZWxNb2RlbCh7XG4gICAgICAgICAgICBuYW1lOiAkKHNtYWxsVGFibGVBbmQpLmF0dHIoJ25hbWUnKVxuICAgICAgICB9KTtcbiAgICAgICAgbWFrZVRhYmxlQW5zd2VyTW9kZWwoMiwgMiwgc21hbGxUYWJsZUFuZE9iaiwgJ3RhYmxlLXNtYWxsMl9zZWxlY3QnKTtcbiAgICAgICAgYW5zd2Vycy5wdXNoKHNtYWxsVGFibGVBbmRPYmopO1xuICAgICAgICAvKkVORCAg0KLQsNCx0LvQuNGG0LAgQU5EKi9cblxuICAgICAgICByZXR1cm4gYW5zd2VycztcbiAgICB9KCkpLFxuXG4gICAgdGV4dGFyZWFQSFA6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gW107XG4gICAgICAgIHZhciBjb2RlID0gJCgnLkNvZGVNaXJyb3ItbGluZScpLnRleHQoKTtcbiAgICAgICAgYW5zd2Vycy5wdXNoKGNvZGUpO1xuXG4gICAgICAgIHJldHVybiBhbnN3ZXJzO1xuICAgIH0oKSksXG4gICAgdGV4dGFyZWFKUzogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBbXTtcbiAgICAgICAgdmFyIGNvZGUgPSAkKCcuQ29kZU1pcnJvci1saW5lJykudGV4dCgpO1xuICAgICAgICBhbnN3ZXJzLnB1c2goY29kZSk7XG5cbiAgICAgICAgcmV0dXJuIGFuc3dlcnM7XG4gICAgfSgpKSxcbiAgICAgdGV4dGFyZWFIVE1MOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5zd2VycyA9IFtdO1xuICAgICAgICB2YXIgY29kZSA9ICQoJy5Db2RlTWlycm9yLWxpbmUnKS50ZXh0KCk7XG4gICAgICAgIGFuc3dlcnMucHVzaChjb2RlKTtcblxuICAgICAgICByZXR1cm4gYW5zd2VycztcbiAgICB9KCkpLFxuXG4gICAgdGV4dGFyZWE6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gW107XG4gICAgICAgIGFuc3dlcnMucHVzaCgkKCcudGV4dGFyZWEtanMnKS52YWwoKSk7XG4gICAgICAgIHJldHVybiBhbnN3ZXJzO1xuICAgIH0oKSlcblxufTtcbiBtb2R1bGUuZXhwb3J0cyA9IHRlc3RUeXBlczsiXX0=
