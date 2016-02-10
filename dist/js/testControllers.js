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

    textarea: (function () {
        var answers = [];
        answers.push($('.textarea-js').val());
        return answers;
    }())

};
 module.exports = testTypes;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvZmFrZV9iZDdjZWJmYi5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvanMvY29udHJvbGxlci5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvanMvbmV4dFRlc3RDb250cm9sbGVyLmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL3Rlc3RDb250cm9sbGVycy9qcy90ZXN0VHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2pzL2NvbnRyb2xsZXInKTtcbnZhciBuZXh0VGVzdENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2pzL25leHRUZXN0Q29udHJvbGxlcicpOyIsIm1vZHVsZS5leHBvcnRzID0gJCgnI2J0bi1jb250aW51ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBhbnN3ZXJzQXJyID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgIHZhciBhcnJMZW5ndGggPSBhbnN3ZXJzQXJyLmxlbmd0aDtcbiAgICB2YXIga2luZCA9IGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV0ua2luZDtcbiAgICB2YXIgbmV4dFRleHRDb250cm9sbGVyID0gcmVxdWlyZSgnLi9uZXh0VGVzdENvbnRyb2xsZXInKTtcbiAgICAvL3ZhciB0ZXN0VHlwZXMgPSByZXF1aXJlKCcuL3Rlc3RUeXBlcycpO1xuXG4gICAgaWYoa2luZCA9PT0gJ2RpYWdyYW1WZW5uJyl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdkaWFncmFtVmVubicpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG5leHRUZXh0Q29udHJvbGxlcihraW5kKTtcblxufSk7XG4iLCJ2YXIgbmV4dFRlc3RDb250cm9sbGVyID0gZnVuY3Rpb24oa2luZCl7XG4gICAgdmFyIHRlc3RUeXBlcyA9IHJlcXVpcmUoJy4vdGVzdFR5cGVzJyk7XG4gICAgZm9yICh2YXIga2V5IGluIHRlc3RUeXBlcyl7XG4gICAgICAgIC8qXG4gICAgICAgICog0KIu0LouLCDQvdCw0L/RgNC40LzQtdGALCDQvNC+0LTQtdC70Ywg0LTQuNCw0LPRgNCw0LzQvNGLINCS0LXQvdC90LAg0LfQsNC/0LjRgdGL0LLQsNC10YLRgdGPINCyIHNlc3Npb25TdG9yYWdlINCyINC00YDRg9Cz0L7QuSDRh9Cw0YHRgtC4INC/0YDQuNC70L7QttC10L3QuNGPLCDRgtC+XG4gICAgICAgICAqINC00LDQvdC90L7QtSDRg9GB0LvQvtCy0LjQtToga2luZCBpbiB0ZXN0VHlwZXMgLSAg0L/RgNC4INCy0YvQsdC+0YDQtSDRgtC40L/QsCDQstC+0L/RgNC+0YHQsCDQvdC1INCx0YPQtNC10YIg0L7QsdGA0LDQsdCw0YLRi9Cy0LDRgtGM0YHRj1xuICAgICAgICAgICog0Lgg0L3QtSDQsdGD0LTQtdGCINC70L7QvNCw0YLRjCDQsiBzZXNzaW9uU3RvcmFnZSDQt9Cw0L/QuNGB0LhcbiAgICAgICAgICogOlxuICAgICAgICAqICovXG4gICAgICAgIGlmKGtpbmQgaW4gdGVzdFR5cGVzKSB7XG4gICAgICAgICAgICB2YXIgYW5zd2Vyc0FyciA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW5zd2VycycpKTtcbiAgICAgICAgICAgIHZhciBhcnJMZW5ndGggPSBhbnN3ZXJzQXJyLmxlbmd0aDtcbiAgICAgICAgICAgIGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV0uYW5zd2VycyA9IHRlc3RUeXBlc1traW5kXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuc3dlcnNBcnIpO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KGFuc3dlcnNBcnIpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbmV4dFRlc3RDb250cm9sbGVyOyIsInZhciB0ZXN0VHlwZXMgPSB7XG4gICAgcmFkaW86IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBbXTtcbiAgICAgICAgdmFyIGlucHV0ID0gJCgnLnF1aXotcXVlc3Rpb25fX2lucHV0OmNoZWNrZWQnKTtcbiAgICAgICAgaW5wdXQuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKXtcbiAgICAgICAgICAgIGFuc3dlcnMucHVzaChKU09OLnBhcnNlKCQoZWwpLnZhbCgpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYW5zd2VycztcbiAgICB9KCkpLFxuXG4gICAgY2hlY2tib3g6IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gW107XG4gICAgICAgIHZhciBpbnB1dCA9ICQoJy5xdWl6LXF1ZXN0aW9uX19pbnB1dDpjaGVja2VkJyk7XG4gICAgICAgIGlucHV0LmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCl7XG4gICAgICAgICAgICBhbnN3ZXJzLnB1c2goSlNPTi5wYXJzZSgkKGVsKS52YWwoKSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFuc3dlcnM7XG4gICAgfSgpKSxcblxuICAgIHRhYmxlczogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBbXTtcbiAgICAgICAgdmFyIEFuc3dlclRhYmVsTW9kZWwgPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gIG9wdGlvbnMubmFtZSB8fCAnJztcbiAgICAgICAgICAgIHRoaXMuYXJyVXNlckFuc3dlcnMgPSBvcHRpb25zLmFyclVzZXJBbnN3ZXJzIHx8IFtdO1xuICAgICAgICB9O1xuXG4vKtC00LDQvdC90LDRjyDRhNGD0L3QutGG0LjRjyDQtNC+0LHQsNCy0LvRj9C10YIg0LIgb2JqINC80LDRgdGB0LjQstGLINC40Lcg0YHRgtGA0L7QutC4INC+0YLQstC10YLQvtCyINCyINGC0LDQsdC70LjRhtC1Ki9cbiAgICAgICAgdmFyIG1ha2VUYWJsZUFuc3dlck1vZGVsID0gZnVuY3Rpb24gKHJvd3MsIGNvbHVtbnMsIG9iaiwgbmFtZU9mRWFjaElucHV0KSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcm93czsgaSsrKXtcbiAgICAgICAgICAgICAgICBhcnJBbnN3ZXJSb3cgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8q0YMg0LrQsNC20LTQvtCz0L4gc2VsZWN0YGEg0LXRgdGC0Ywg0YPQvdC40LrQsNC70YzQvdGL0Lkgc2VsZWN0b3IqL1xuICAgICAgICAgICAgICAgICAgICBuYW1lT2ZJbnB1dCA9IG5hbWVPZkVhY2hJbnB1dCArIGkrIGo7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yID0gJ1tuYW1lID0nICsgbmFtZU9mSW5wdXQgKyAnXSc7XG4gICAgICAgICAgICAgICAgICAgICQoc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJBbnN3ZXJSb3cucHVzaCgkKGVsKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY29sdW1ucy0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmouYXJyVXNlckFuc3dlcnMucHVzaChhcnJBbnN3ZXJSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyrQkdC+0LvRjNGI0LDRjyDRgtCw0LHQu9C40YbQsCovXG4gICAgICAgIHZhciBodWdlVGFibGUgPSAkKCcudGFibGUtaHVnZS1qcycpO1xuICAgICAgICB2YXIgaHVnZVRhYmxlT2JqID0gbmV3IEFuc3dlclRhYmVsTW9kZWwoe1xuICAgICAgICAgICAgbmFtZTogJChodWdlVGFibGUpLmF0dHIoJ25hbWUnKVxuICAgICAgICB9KTtcbiAgICAgICAgbWFrZVRhYmxlQW5zd2VyTW9kZWwoMywgNSwgaHVnZVRhYmxlT2JqLCAndGFibGVfc2VsZWN0Jyk7XG4gICAgICAgIGFuc3dlcnMucHVzaChodWdlVGFibGVPYmopO1xuICAgICAgICAvKkVORCDQsdC+0LvRjNGI0LDRjyDRgtCw0LHQu9C40YbQsCovXG5cbiAgICAgICAgLyrQotCw0LHQu9C40YbQsCBPUiovXG4gICAgICAgIHZhciBzbWFsbFRhYmxlT3IgPSAkKCcudGFibGUtc21hbGwtb3ItanMnKTtcbiAgICAgICAgdmFyIHNtYWxsVGFibGVPck9iaiA9IG5ldyBBbnN3ZXJUYWJlbE1vZGVsKHtcbiAgICAgICAgICAgIG5hbWU6ICQoc21hbGxUYWJsZU9yKS5hdHRyKCduYW1lJylcbiAgICAgICAgfSk7XG4gICAgICAgIG1ha2VUYWJsZUFuc3dlck1vZGVsKDIsIDIsIHNtYWxsVGFibGVPck9iaiwgJ3RhYmxlLXNtYWxsMV9zZWxlY3QnKTtcbiAgICAgICAgYW5zd2Vycy5wdXNoKHNtYWxsVGFibGVPck9iaik7XG4gICAgICAgIC8qRU5EICAg0KLQsNCx0LvQuNGG0LAgT1IqL1xuXG4gICAgICAgIC8q0KLQsNCx0LvQuNGG0LAgQU5EKi9cbiAgICAgICAgdmFyIHNtYWxsVGFibGVBbmQgPSAkKCcudGFibGUtc21hbGwtYW5kLWpzJyk7XG4gICAgICAgIHZhciBzbWFsbFRhYmxlQW5kT2JqID0gbmV3IEFuc3dlclRhYmVsTW9kZWwoe1xuICAgICAgICAgICAgbmFtZTogJChzbWFsbFRhYmxlQW5kKS5hdHRyKCduYW1lJylcbiAgICAgICAgfSk7XG4gICAgICAgIG1ha2VUYWJsZUFuc3dlck1vZGVsKDIsIDIsIHNtYWxsVGFibGVBbmRPYmosICd0YWJsZS1zbWFsbDJfc2VsZWN0Jyk7XG4gICAgICAgIGFuc3dlcnMucHVzaChzbWFsbFRhYmxlQW5kT2JqKTtcbiAgICAgICAgLypFTkQgINCi0LDQsdC70LjRhtCwIEFORCovXG5cbiAgICAgICAgcmV0dXJuIGFuc3dlcnM7XG4gICAgfSgpKSxcblxuICAgIHRleHRhcmVhUEhQOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5zd2VycyA9IFtdO1xuICAgICAgICB2YXIgY29kZSA9ICQoJy5Db2RlTWlycm9yLWxpbmUnKS50ZXh0KCk7XG4gICAgICAgIGFuc3dlcnMucHVzaChjb2RlKTtcblxuXG4gICAgICAgIHJldHVybiBhbnN3ZXJzO1xuICAgIH0oKSksXG5cbiAgICB0ZXh0YXJlYTogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBbXTtcbiAgICAgICAgYW5zd2Vycy5wdXNoKCQoJy50ZXh0YXJlYS1qcycpLnZhbCgpKTtcbiAgICAgICAgcmV0dXJuIGFuc3dlcnM7XG4gICAgfSgpKVxuXG59O1xuIG1vZHVsZS5leHBvcnRzID0gdGVzdFR5cGVzOyJdfQ==
