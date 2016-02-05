(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var controller = require('./js/controller');
var nextTestController = require('./js/nextTestController');
},{"./js/controller":2,"./js/nextTestController":3}],2:[function(require,module,exports){
module.exports = $('#btn-continue').on('click', function (event) {
    var answersArr = JSON.parse(sessionStorage.getItem('answers'));
    var arrLength = answersArr.length;
    var kind = answersArr[arrLength - 1].kind;
    var nextTextController = require('./nextTestController');
    var testTypes = require('./testTypes');

    nextTextController(kind);

});

},{"./nextTestController":3,"./testTypes":4}],3:[function(require,module,exports){
var nextTestController = function(kind){
    var testTypes = require('./testTypes');
    for (var key in testTypes){
        var answersArr = JSON.parse(sessionStorage.getItem('answers'));
        var arrLength = answersArr.length;
        answersArr[arrLength - 1].answers = testTypes[kind];
        console.log(answersArr);
        sessionStorage.setItem('answers', JSON.stringify(answersArr));
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
    diagramVenn: (function (model) {
        var answers = [];
        var modelsArr = [];
        var that = this;
        this.$diagramTest_length = $('.diagramTest__i').length;
        this.$diagramTest = $('.diagramTest__i');
        for(var i = 0; i< this.$diagramTest_length; i++){
            that.model = model || new DiagramVennModel();
            that.model.name = 'diagramTest__i' + i + '-js';
            modelsArr.push(that.model);
        }

        /*For select*/
        this.$diagramTest.on( 'change', 'select', function (e) {
            var that = this;
            modelsArr.forEach(function(item, i, arr){
                if ( item.name === $(e.target).parent().data('name-diagramvenn') ){
                    var $that = $(that);
                    var prop = $that.attr('name');
                    item[prop] = $that.val();
                    console.log(arr);
                }
            });
        });
        /*For Diagram*/
        /*data('prop-js') является атрибутом тэга path в html;
         также значение data('prop-diagramVenn') должно совпадать со свойствами модели этой диаграммы
         */

        var $diagramPart = $('.diagramSvg g');
        $diagramPart.attr({
            fill: '#fff193',
            stroke: 'red'
        });
        modelsArr.forEach(function(item, i, arr){
            $diagramPart.toggle(

                function (e) {
                    if ( item.name === $(e.target).parent().parent().parent().data('name-diagramvenn') ){
                        var prop = $(e.target).attr('data-prop-js');
                        item[prop] = true;
                        $(this).attr({
                            fill: "#6efb6e"
                        });
                    }
                },

                function(e) {
                    if ( item.name === $(e.target).parent().parent().parent().data('name-diagramvenn') ){
                        var prop = $(e.target).attr('data-prop-js');
                        item[prop] = false;
                        $(this).attr({
                            fill: "#fff193"
                        });
                    }
                }
            );
        });
        return modelsArr;
    }())
};
 module.exports = testTypes;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvZmFrZV9mODVlNzE5OS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvanMvY29udHJvbGxlci5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvanMvbmV4dFRlc3RDb250cm9sbGVyLmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL3Rlc3RDb250cm9sbGVycy9qcy90ZXN0VHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2pzL2NvbnRyb2xsZXInKTtcbnZhciBuZXh0VGVzdENvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2pzL25leHRUZXN0Q29udHJvbGxlcicpOyIsIm1vZHVsZS5leHBvcnRzID0gJCgnI2J0bi1jb250aW51ZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBhbnN3ZXJzQXJyID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgIHZhciBhcnJMZW5ndGggPSBhbnN3ZXJzQXJyLmxlbmd0aDtcbiAgICB2YXIga2luZCA9IGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV0ua2luZDtcbiAgICB2YXIgbmV4dFRleHRDb250cm9sbGVyID0gcmVxdWlyZSgnLi9uZXh0VGVzdENvbnRyb2xsZXInKTtcbiAgICB2YXIgdGVzdFR5cGVzID0gcmVxdWlyZSgnLi90ZXN0VHlwZXMnKTtcblxuICAgIG5leHRUZXh0Q29udHJvbGxlcihraW5kKTtcblxufSk7XG4iLCJ2YXIgbmV4dFRlc3RDb250cm9sbGVyID0gZnVuY3Rpb24oa2luZCl7XG4gICAgdmFyIHRlc3RUeXBlcyA9IHJlcXVpcmUoJy4vdGVzdFR5cGVzJyk7XG4gICAgZm9yICh2YXIga2V5IGluIHRlc3RUeXBlcyl7XG4gICAgICAgIHZhciBhbnN3ZXJzQXJyID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgICAgICB2YXIgYXJyTGVuZ3RoID0gYW5zd2Vyc0Fyci5sZW5ndGg7XG4gICAgICAgIGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV0uYW5zd2VycyA9IHRlc3RUeXBlc1traW5kXTtcbiAgICAgICAgY29uc29sZS5sb2coYW5zd2Vyc0Fycik7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2Fuc3dlcnMnLCBKU09OLnN0cmluZ2lmeShhbnN3ZXJzQXJyKSk7XG4gICAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5leHRUZXN0Q29udHJvbGxlcjsiLCJ2YXIgdGVzdFR5cGVzID0ge1xuICAgIHJhZGlvOiAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gW107XG4gICAgICAgIHZhciBpbnB1dCA9ICQoJy5xdWl6LXF1ZXN0aW9uX19pbnB1dDpjaGVja2VkJyk7XG4gICAgICAgIGlucHV0LmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCl7XG4gICAgICAgICAgICBhbnN3ZXJzLnB1c2goSlNPTi5wYXJzZSgkKGVsKS52YWwoKSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGFuc3dlcnM7XG4gICAgfSgpKSxcbiAgICBjaGVja2JveDogKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBbXTtcbiAgICAgICAgdmFyIGlucHV0ID0gJCgnLnF1aXotcXVlc3Rpb25fX2lucHV0OmNoZWNrZWQnKTtcbiAgICAgICAgaW5wdXQuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsKXtcbiAgICAgICAgICAgIGFuc3dlcnMucHVzaChKU09OLnBhcnNlKCQoZWwpLnZhbCgpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYW5zd2VycztcbiAgICB9KCkpLFxuICAgIGRpYWdyYW1WZW5uOiAoZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gW107XG4gICAgICAgIHZhciBtb2RlbHNBcnIgPSBbXTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLiRkaWFncmFtVGVzdF9sZW5ndGggPSAkKCcuZGlhZ3JhbVRlc3RfX2knKS5sZW5ndGg7XG4gICAgICAgIHRoaXMuJGRpYWdyYW1UZXN0ID0gJCgnLmRpYWdyYW1UZXN0X19pJyk7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGk8IHRoaXMuJGRpYWdyYW1UZXN0X2xlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRoYXQubW9kZWwgPSBtb2RlbCB8fCBuZXcgRGlhZ3JhbVZlbm5Nb2RlbCgpO1xuICAgICAgICAgICAgdGhhdC5tb2RlbC5uYW1lID0gJ2RpYWdyYW1UZXN0X19pJyArIGkgKyAnLWpzJztcbiAgICAgICAgICAgIG1vZGVsc0Fyci5wdXNoKHRoYXQubW9kZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLypGb3Igc2VsZWN0Ki9cbiAgICAgICAgdGhpcy4kZGlhZ3JhbVRlc3Qub24oICdjaGFuZ2UnLCAnc2VsZWN0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIG1vZGVsc0Fyci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGksIGFycil7XG4gICAgICAgICAgICAgICAgaWYgKCBpdGVtLm5hbWUgPT09ICQoZS50YXJnZXQpLnBhcmVudCgpLmRhdGEoJ25hbWUtZGlhZ3JhbXZlbm4nKSApe1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoYXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9ICR0aGF0LmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVtwcm9wXSA9ICR0aGF0LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLypGb3IgRGlhZ3JhbSovXG4gICAgICAgIC8qZGF0YSgncHJvcC1qcycpINGP0LLQu9GP0LXRgtGB0Y8g0LDRgtGA0LjQsdGD0YLQvtC8INGC0Y3Qs9CwIHBhdGgg0LIgaHRtbDtcbiAgICAgICAgINGC0LDQutC20LUg0LfQvdCw0YfQtdC90LjQtSBkYXRhKCdwcm9wLWRpYWdyYW1WZW5uJykg0LTQvtC70LbQvdC+INGB0L7QstC/0LDQtNCw0YLRjCDRgdC+INGB0LLQvtC50YHRgtCy0LDQvNC4INC80L7QtNC10LvQuCDRjdGC0L7QuSDQtNC40LDQs9GA0LDQvNC80YtcbiAgICAgICAgICovXG5cbiAgICAgICAgdmFyICRkaWFncmFtUGFydCA9ICQoJy5kaWFncmFtU3ZnIGcnKTtcbiAgICAgICAgJGRpYWdyYW1QYXJ0LmF0dHIoe1xuICAgICAgICAgICAgZmlsbDogJyNmZmYxOTMnLFxuICAgICAgICAgICAgc3Ryb2tlOiAncmVkJ1xuICAgICAgICB9KTtcbiAgICAgICAgbW9kZWxzQXJyLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSwgYXJyKXtcbiAgICAgICAgICAgICRkaWFncmFtUGFydC50b2dnbGUoXG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGl0ZW0ubmFtZSA9PT0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZGF0YSgnbmFtZS1kaWFncmFtdmVubicpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtcHJvcC1qcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVtwcm9wXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwiIzZlZmI2ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaXRlbS5uYW1lID09PSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5kYXRhKCduYW1lLWRpYWdyYW12ZW5uJykgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gJChlLnRhcmdldCkuYXR0cignZGF0YS1wcm9wLWpzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtW3Byb3BdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw6IFwiI2ZmZjE5M1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbW9kZWxzQXJyO1xuICAgIH0oKSlcbn07XG4gbW9kdWxlLmV4cG9ydHMgPSB0ZXN0VHlwZXM7Il19
