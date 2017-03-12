(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DiagramVennModel = require('./js/DiagramVennModel');
var DiagramVennController = require('./js/DiagramVennController');
//var diagramVennSvg = require('./js/diagramVennSvg');

var diagramVennController = new DiagramVennController();
},{"./js/DiagramVennController":2,"./js/DiagramVennModel":3}],2:[function(require,module,exports){
var DiagramVennModel = require('./DiagramVennModel');

var DiagramVennController = function (model) {
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
     также значение data('prop-_diagramVenn.scss') должно совпадать со свойствами модели этой диаграммы
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

    /*
    * Добавление в sessionStorage ответа
    * */
    $('#btn-continue').on('click', function (event) {
        var answersArr = JSON.parse(sessionStorage.getItem('answers'));
        var arrLength = answersArr.length;
        console.log(modelsArr[0].nameOfUnion_js);
        console.log(answersArr);
        console.log(answersArr[arrLength - 1] );
        answersArr[arrLength - 1].answers = modelsArr;
        console.log(answersArr);
        sessionStorage.setItem('answers', JSON.stringify(answersArr));
    });

    return modelsArr;
};
module.exports  = DiagramVennController;
},{"./DiagramVennModel":3}],3:[function(require,module,exports){
var DiagramVennModel = function (options) {
        options = options || {},
        this.leftPart = options.leftPart || false,
        this.innerPart = options.innerPart || false,
        this.rightPart = options.rightPart || false,
        this.nameOfUnion_js = options.nameOfUnion_js || 'inner_join',
        this.name = options.name || null
};

module.exports = DiagramVennModel;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvc3ZnLWpzL2RpYWdyYW1WZW5uL2Zha2VfNWM1ZGNjOTkuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvc3ZnLWpzL2RpYWdyYW1WZW5uL2pzL0RpYWdyYW1WZW5uQ29udHJvbGxlci5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9zdmctanMvZGlhZ3JhbVZlbm4vanMvRGlhZ3JhbVZlbm5Nb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIERpYWdyYW1WZW5uTW9kZWwgPSByZXF1aXJlKCcuL2pzL0RpYWdyYW1WZW5uTW9kZWwnKTtcbnZhciBEaWFncmFtVmVubkNvbnRyb2xsZXIgPSByZXF1aXJlKCcuL2pzL0RpYWdyYW1WZW5uQ29udHJvbGxlcicpO1xuLy92YXIgZGlhZ3JhbVZlbm5TdmcgPSByZXF1aXJlKCcuL2pzL2RpYWdyYW1WZW5uU3ZnJyk7XG5cbnZhciBkaWFncmFtVmVubkNvbnRyb2xsZXIgPSBuZXcgRGlhZ3JhbVZlbm5Db250cm9sbGVyKCk7IiwidmFyIERpYWdyYW1WZW5uTW9kZWwgPSByZXF1aXJlKCcuL0RpYWdyYW1WZW5uTW9kZWwnKTtcblxudmFyIERpYWdyYW1WZW5uQ29udHJvbGxlciA9IGZ1bmN0aW9uIChtb2RlbCkge1xuICAgIHZhciBtb2RlbHNBcnIgPSBbXTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy4kZGlhZ3JhbVRlc3RfbGVuZ3RoID0gJCgnLmRpYWdyYW1UZXN0X19pJykubGVuZ3RoO1xuICAgIHRoaXMuJGRpYWdyYW1UZXN0ID0gJCgnLmRpYWdyYW1UZXN0X19pJyk7XG4gICAgZm9yKHZhciBpID0gMDsgaTwgdGhpcy4kZGlhZ3JhbVRlc3RfbGVuZ3RoOyBpKyspe1xuICAgICAgICB0aGF0Lm1vZGVsID0gbW9kZWwgfHwgbmV3IERpYWdyYW1WZW5uTW9kZWwoKTtcbiAgICAgICAgdGhhdC5tb2RlbC5uYW1lID0gJ2RpYWdyYW1UZXN0X19pJyArIGkgKyAnLWpzJztcbiAgICAgICAgbW9kZWxzQXJyLnB1c2godGhhdC5tb2RlbCk7XG4gICAgfVxuXG4gICAgLypGb3Igc2VsZWN0Ki9cbiAgICB0aGlzLiRkaWFncmFtVGVzdC5vbiggJ2NoYW5nZScsICdzZWxlY3QnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIG1vZGVsc0Fyci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGksIGFycil7XG4gICAgICAgICAgICBpZiAoIGl0ZW0ubmFtZSA9PT0gJChlLnRhcmdldCkucGFyZW50KCkuZGF0YSgnbmFtZS1kaWFncmFtdmVubicpICl7XG4gICAgICAgICAgICAgICAgdmFyICR0aGF0ID0gJCh0aGF0KTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9ICR0aGF0LmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICBpdGVtW3Byb3BdID0gJHRoYXQudmFsKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLypGb3IgRGlhZ3JhbSovXG4gICAgLypkYXRhKCdwcm9wLWpzJykg0Y/QstC70Y/QtdGC0YHRjyDQsNGC0YDQuNCx0YPRgtC+0Lwg0YLRjdCz0LAgcGF0aCDQsiBodG1sO1xuICAgICDRgtCw0LrQttC1INC30L3QsNGH0LXQvdC40LUgZGF0YSgncHJvcC1fZGlhZ3JhbVZlbm4uc2NzcycpINC00L7Qu9C20L3QviDRgdC+0LLQv9Cw0LTQsNGC0Ywg0YHQviDRgdCy0L7QudGB0YLQstCw0LzQuCDQvNC+0LTQtdC70Lgg0Y3RgtC+0Lkg0LTQuNCw0LPRgNCw0LzQvNGLXG4gICAgICovXG5cbiAgICB2YXIgJGRpYWdyYW1QYXJ0ID0gJCgnLmRpYWdyYW1TdmcgZycpO1xuICAgICRkaWFncmFtUGFydC5hdHRyKHtcbiAgICAgICAgZmlsbDogJyNmZmYxOTMnLFxuICAgICAgICBzdHJva2U6ICdyZWQnXG4gICAgfSk7XG4gICAgbW9kZWxzQXJyLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSwgYXJyKXtcbiAgICAgICAgJGRpYWdyYW1QYXJ0LnRvZ2dsZShcblxuICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIGl0ZW0ubmFtZSA9PT0gJChlLnRhcmdldCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZGF0YSgnbmFtZS1kaWFncmFtdmVubicpICl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gJChlLnRhcmdldCkuYXR0cignZGF0YS1wcm9wLWpzJyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1bcHJvcF0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCIjNmVmYjZlXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmICggaXRlbS5uYW1lID09PSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5kYXRhKCduYW1lLWRpYWdyYW12ZW5uJykgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXByb3AtanMnKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVtwcm9wXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCIjZmZmMTkzXCJcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgLypcbiAgICAqINCU0L7QsdCw0LLQu9C10L3QuNC1INCyIHNlc3Npb25TdG9yYWdlINC+0YLQstC10YLQsFxuICAgICogKi9cbiAgICAkKCcjYnRuLWNvbnRpbnVlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBhbnN3ZXJzQXJyID0gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdhbnN3ZXJzJykpO1xuICAgICAgICB2YXIgYXJyTGVuZ3RoID0gYW5zd2Vyc0Fyci5sZW5ndGg7XG4gICAgICAgIGNvbnNvbGUubG9nKG1vZGVsc0FyclswXS5uYW1lT2ZVbmlvbl9qcyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGFuc3dlcnNBcnIpO1xuICAgICAgICBjb25zb2xlLmxvZyhhbnN3ZXJzQXJyW2Fyckxlbmd0aCAtIDFdICk7XG4gICAgICAgIGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV0uYW5zd2VycyA9IG1vZGVsc0FycjtcbiAgICAgICAgY29uc29sZS5sb2coYW5zd2Vyc0Fycik7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2Fuc3dlcnMnLCBKU09OLnN0cmluZ2lmeShhbnN3ZXJzQXJyKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbW9kZWxzQXJyO1xufTtcbm1vZHVsZS5leHBvcnRzICA9IERpYWdyYW1WZW5uQ29udHJvbGxlcjsiLCJ2YXIgRGlhZ3JhbVZlbm5Nb2RlbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9LFxuICAgICAgICB0aGlzLmxlZnRQYXJ0ID0gb3B0aW9ucy5sZWZ0UGFydCB8fCBmYWxzZSxcbiAgICAgICAgdGhpcy5pbm5lclBhcnQgPSBvcHRpb25zLmlubmVyUGFydCB8fCBmYWxzZSxcbiAgICAgICAgdGhpcy5yaWdodFBhcnQgPSBvcHRpb25zLnJpZ2h0UGFydCB8fCBmYWxzZSxcbiAgICAgICAgdGhpcy5uYW1lT2ZVbmlvbl9qcyA9IG9wdGlvbnMubmFtZU9mVW5pb25fanMgfHwgJ2lubmVyX2pvaW4nLFxuICAgICAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaWFncmFtVmVubk1vZGVsOyJdfQ==
