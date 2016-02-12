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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9zdmctanMvZGlhZ3JhbVZlbm4vZmFrZV8yYmY0NzZhZi5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9zdmctanMvZGlhZ3JhbVZlbm4vanMvRGlhZ3JhbVZlbm5Db250cm9sbGVyLmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL3N2Zy1qcy9kaWFncmFtVmVubi9qcy9EaWFncmFtVmVubk1vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRGlhZ3JhbVZlbm5Nb2RlbCA9IHJlcXVpcmUoJy4vanMvRGlhZ3JhbVZlbm5Nb2RlbCcpO1xudmFyIERpYWdyYW1WZW5uQ29udHJvbGxlciA9IHJlcXVpcmUoJy4vanMvRGlhZ3JhbVZlbm5Db250cm9sbGVyJyk7XG4vL3ZhciBkaWFncmFtVmVublN2ZyA9IHJlcXVpcmUoJy4vanMvZGlhZ3JhbVZlbm5TdmcnKTtcblxudmFyIGRpYWdyYW1WZW5uQ29udHJvbGxlciA9IG5ldyBEaWFncmFtVmVubkNvbnRyb2xsZXIoKTsiLCJ2YXIgRGlhZ3JhbVZlbm5Nb2RlbCA9IHJlcXVpcmUoJy4vRGlhZ3JhbVZlbm5Nb2RlbCcpO1xuXG52YXIgRGlhZ3JhbVZlbm5Db250cm9sbGVyID0gZnVuY3Rpb24gKG1vZGVsKSB7XG4gICAgdmFyIG1vZGVsc0FyciA9IFtdO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLiRkaWFncmFtVGVzdF9sZW5ndGggPSAkKCcuZGlhZ3JhbVRlc3RfX2knKS5sZW5ndGg7XG4gICAgdGhpcy4kZGlhZ3JhbVRlc3QgPSAkKCcuZGlhZ3JhbVRlc3RfX2knKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpPCB0aGlzLiRkaWFncmFtVGVzdF9sZW5ndGg7IGkrKyl7XG4gICAgICAgIHRoYXQubW9kZWwgPSBtb2RlbCB8fCBuZXcgRGlhZ3JhbVZlbm5Nb2RlbCgpO1xuICAgICAgICB0aGF0Lm1vZGVsLm5hbWUgPSAnZGlhZ3JhbVRlc3RfX2knICsgaSArICctanMnO1xuICAgICAgICBtb2RlbHNBcnIucHVzaCh0aGF0Lm1vZGVsKTtcbiAgICB9XG5cbiAgICAvKkZvciBzZWxlY3QqL1xuICAgIHRoaXMuJGRpYWdyYW1UZXN0Lm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgbW9kZWxzQXJyLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSwgYXJyKXtcbiAgICAgICAgICAgIGlmICggaXRlbS5uYW1lID09PSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5kYXRhKCduYW1lLWRpYWdyYW12ZW5uJykgKXtcbiAgICAgICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoYXQpO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wID0gJHRoYXQuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIGl0ZW1bcHJvcF0gPSAkdGhhdC52YWwoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvKkZvciBEaWFncmFtKi9cbiAgICAvKmRhdGEoJ3Byb3AtanMnKSDRj9Cy0LvRj9C10YLRgdGPINCw0YLRgNC40LHRg9GC0L7QvCDRgtGN0LPQsCBwYXRoINCyIGh0bWw7XG4gICAgINGC0LDQutC20LUg0LfQvdCw0YfQtdC90LjQtSBkYXRhKCdwcm9wLWRpYWdyYW1WZW5uJykg0LTQvtC70LbQvdC+INGB0L7QstC/0LDQtNCw0YLRjCDRgdC+INGB0LLQvtC50YHRgtCy0LDQvNC4INC80L7QtNC10LvQuCDRjdGC0L7QuSDQtNC40LDQs9GA0LDQvNC80YtcbiAgICAgKi9cblxuICAgIHZhciAkZGlhZ3JhbVBhcnQgPSAkKCcuZGlhZ3JhbVN2ZyBnJyk7XG4gICAgJGRpYWdyYW1QYXJ0LmF0dHIoe1xuICAgICAgICBmaWxsOiAnI2ZmZjE5MycsXG4gICAgICAgIHN0cm9rZTogJ3JlZCdcbiAgICB9KTtcbiAgICBtb2RlbHNBcnIuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpLCBhcnIpe1xuICAgICAgICAkZGlhZ3JhbVBhcnQudG9nZ2xlKFxuXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICggaXRlbS5uYW1lID09PSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5kYXRhKCduYW1lLWRpYWdyYW12ZW5uJykgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSAkKGUudGFyZ2V0KS5hdHRyKCdkYXRhLXByb3AtanMnKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbVtwcm9wXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcIiM2ZWZiNmVcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBpdGVtLm5hbWUgPT09ICQoZS50YXJnZXQpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmRhdGEoJ25hbWUtZGlhZ3JhbXZlbm4nKSApe1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9ICQoZS50YXJnZXQpLmF0dHIoJ2RhdGEtcHJvcC1qcycpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtW3Byb3BdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcIiNmZmYxOTNcIlxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvKlxuICAgICog0JTQvtCx0LDQstC70LXQvdC40LUg0LIgc2Vzc2lvblN0b3JhZ2Ug0L7RgtCy0LXRgtCwXG4gICAgKiAqL1xuICAgICQoJyNidG4tY29udGludWUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIGFuc3dlcnNBcnIgPSBKU09OLnBhcnNlKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2Fuc3dlcnMnKSk7XG4gICAgICAgIHZhciBhcnJMZW5ndGggPSBhbnN3ZXJzQXJyLmxlbmd0aDtcbiAgICAgICAgY29uc29sZS5sb2cobW9kZWxzQXJyWzBdLm5hbWVPZlVuaW9uX2pzKTtcbiAgICAgICAgY29uc29sZS5sb2coYW5zd2Vyc0Fycik7XG4gICAgICAgIGNvbnNvbGUubG9nKGFuc3dlcnNBcnJbYXJyTGVuZ3RoIC0gMV0gKTtcbiAgICAgICAgYW5zd2Vyc0FyclthcnJMZW5ndGggLSAxXS5hbnN3ZXJzID0gbW9kZWxzQXJyO1xuICAgICAgICBjb25zb2xlLmxvZyhhbnN3ZXJzQXJyKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnYW5zd2VycycsIEpTT04uc3RyaW5naWZ5KGFuc3dlcnNBcnIpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBtb2RlbHNBcnI7XG59O1xubW9kdWxlLmV4cG9ydHMgID0gRGlhZ3JhbVZlbm5Db250cm9sbGVyOyIsInZhciBEaWFncmFtVmVubk1vZGVsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge30sXG4gICAgICAgIHRoaXMubGVmdFBhcnQgPSBvcHRpb25zLmxlZnRQYXJ0IHx8IGZhbHNlLFxuICAgICAgICB0aGlzLmlubmVyUGFydCA9IG9wdGlvbnMuaW5uZXJQYXJ0IHx8IGZhbHNlLFxuICAgICAgICB0aGlzLnJpZ2h0UGFydCA9IG9wdGlvbnMucmlnaHRQYXJ0IHx8IGZhbHNlLFxuICAgICAgICB0aGlzLm5hbWVPZlVuaW9uX2pzID0gb3B0aW9ucy5uYW1lT2ZVbmlvbl9qcyB8fCAnaW5uZXJfam9pbicsXG4gICAgICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpYWdyYW1WZW5uTW9kZWw7Il19
