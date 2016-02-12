(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Model = require('./js/NetworkTestModel');
var Controller = require('./js/NetworkTestController');

var model = new Model();
var controller = new Controller();
},{"./js/NetworkTestController":2,"./js/NetworkTestModel":3}],2:[function(require,module,exports){
var NetworkTestModel = require ('./NetworkTestModel');

var NetworkTestController = function(model) {
    var modelsArr = [];
    var that = this;
    this.$amountOfTest = $('.select-with-arrows').length;


    for(var i = 0; i< this.$amountOfTest; i++){
        that.model = model || new NetworkTestModel();
        that.model.name = 'testModel' + i;
        modelsArr.push(that.model);
    }


    $('.arrow-js').on('click', function (e){
        var numberOfSelect = $(e.target).parent().attr('data-number-of-select');
        var directionOfArrow = $(e.target).attr('data-direction-js');

        /*работа с соседней стрелкой*/
        var arrowSibling = $(e.target).siblings('.arrow-js');
        if (modelsArr[numberOfSelect][directionOfArrow] === null) {
            modelsArr[numberOfSelect][directionOfArrow] = true;
            $(e.target).css({'opacity':'1'});

            /*----------работа с соседней стрелкой---------*/
            var arrowSibling = $(e.target).siblings('.arrow-js');
            var directionOfSiblingArrow = $(arrowSibling).attr('data-direction-js');
            modelsArr[numberOfSelect][directionOfSiblingArrow] = null;
            $(arrowSibling).css({'opacity':'0.5'});

        } else {
            modelsArr[numberOfSelect][directionOfArrow] = null;
            $(e.target).css({'opacity':'0.5'});
        }
    });


    $('#btn-continue').on('click', function (e) {
        var answersArr = JSON.parse(sessionStorage.getItem('answers'));
        var arrLength = answersArr.length;
        //
        //for(var i = 0; i < 6; i++){
        //}
        $('.select-js').each(function(index, el){
            modelsArr.forEach( function(item, i, arr){
                if(index === i  &&  $(el).val() !== '?') {
                    item.number = $(el).val() - 1;
                }
            });
        });
        $('.textarea-js').each(function(index, el){
            console.log('------------');
            modelsArr.forEach( function(item, i, arr){

                console.log($(el).attr('data-textarea-js'));
                console.log(typeof ($(el).attr('data-textarea-js')));
                console.log(item.number);
                console.log(typeof (item.number));
                if(item.number == $(el).attr('data-textarea-js')) {
                    item.textarea = $(el).val();
                    console.log('yes');
                }
            });
        });




        answersArr[arrLength - 1].answers = modelsArr;
        console.log(answersArr);
        sessionStorage.setItem('answers', JSON.stringify(answersArr));
    });

    /*For select*/
    //this.$diagramTest.on( 'change', 'select', function (e) {
    //    var that = this;
    //    modelsArr.forEach(function(item, i, arr){
    //        if ( item.name === $(e.target).parent().data('name-diagramvenn') ){
    //            var $that = $(that);
    //            var prop = $that.attr('name');
    //            item[prop] = $that.val();
    //            console.log(arr);
    //        }
    //    });
    //});
};

module.exports = NetworkTestController;
},{"./NetworkTestModel":3}],3:[function(require,module,exports){
var Model = function (options) {
    options = options || {};
    this.number = options.number || null;
    this.arrowLeft = options.arrowLeft || null;
    this.arrowRight = options.arrowRight || null;
    this.textarea = options.textarea || null;
};

module.exports = Model;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy90ZXN0Q29udHJvbGxlcnMvbmV0d29yay9mYWtlX2YyZGU0OTEuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvdGVzdENvbnRyb2xsZXJzL25ldHdvcmsvanMvTmV0d29ya1Rlc3RDb250cm9sbGVyLmpzIiwiL2hvbWUvbmlraXRhL1Byb2plY3RzL3dlYi1zY2hvb2wvcHVibGljL3Rlc3RDb250cm9sbGVycy9uZXR3b3JrL2pzL05ldHdvcmtUZXN0TW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgTW9kZWwgPSByZXF1aXJlKCcuL2pzL05ldHdvcmtUZXN0TW9kZWwnKTtcbnZhciBDb250cm9sbGVyID0gcmVxdWlyZSgnLi9qcy9OZXR3b3JrVGVzdENvbnRyb2xsZXInKTtcblxudmFyIG1vZGVsID0gbmV3IE1vZGVsKCk7XG52YXIgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKCk7IiwidmFyIE5ldHdvcmtUZXN0TW9kZWwgPSByZXF1aXJlICgnLi9OZXR3b3JrVGVzdE1vZGVsJyk7XG5cbnZhciBOZXR3b3JrVGVzdENvbnRyb2xsZXIgPSBmdW5jdGlvbihtb2RlbCkge1xuICAgIHZhciBtb2RlbHNBcnIgPSBbXTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy4kYW1vdW50T2ZUZXN0ID0gJCgnLnNlbGVjdC13aXRoLWFycm93cycpLmxlbmd0aDtcblxuXG4gICAgZm9yKHZhciBpID0gMDsgaTwgdGhpcy4kYW1vdW50T2ZUZXN0OyBpKyspe1xuICAgICAgICB0aGF0Lm1vZGVsID0gbW9kZWwgfHwgbmV3IE5ldHdvcmtUZXN0TW9kZWwoKTtcbiAgICAgICAgdGhhdC5tb2RlbC5uYW1lID0gJ3Rlc3RNb2RlbCcgKyBpO1xuICAgICAgICBtb2RlbHNBcnIucHVzaCh0aGF0Lm1vZGVsKTtcbiAgICB9XG5cblxuICAgICQoJy5hcnJvdy1qcycpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKXtcbiAgICAgICAgdmFyIG51bWJlck9mU2VsZWN0ID0gJChlLnRhcmdldCkucGFyZW50KCkuYXR0cignZGF0YS1udW1iZXItb2Ytc2VsZWN0Jyk7XG4gICAgICAgIHZhciBkaXJlY3Rpb25PZkFycm93ID0gJChlLnRhcmdldCkuYXR0cignZGF0YS1kaXJlY3Rpb24tanMnKTtcblxuICAgICAgICAvKtGA0LDQsdC+0YLQsCDRgSDRgdC+0YHQtdC00L3QtdC5INGB0YLRgNC10LvQutC+0LkqL1xuICAgICAgICB2YXIgYXJyb3dTaWJsaW5nID0gJChlLnRhcmdldCkuc2libGluZ3MoJy5hcnJvdy1qcycpO1xuICAgICAgICBpZiAobW9kZWxzQXJyW251bWJlck9mU2VsZWN0XVtkaXJlY3Rpb25PZkFycm93XSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbW9kZWxzQXJyW251bWJlck9mU2VsZWN0XVtkaXJlY3Rpb25PZkFycm93XSA9IHRydWU7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoeydvcGFjaXR5JzonMSd9KTtcblxuICAgICAgICAgICAgLyotLS0tLS0tLS0t0YDQsNCx0L7RgtCwINGBINGB0L7RgdC10LTQvdC10Lkg0YHRgtGA0LXQu9C60L7QuS0tLS0tLS0tLSovXG4gICAgICAgICAgICB2YXIgYXJyb3dTaWJsaW5nID0gJChlLnRhcmdldCkuc2libGluZ3MoJy5hcnJvdy1qcycpO1xuICAgICAgICAgICAgdmFyIGRpcmVjdGlvbk9mU2libGluZ0Fycm93ID0gJChhcnJvd1NpYmxpbmcpLmF0dHIoJ2RhdGEtZGlyZWN0aW9uLWpzJyk7XG4gICAgICAgICAgICBtb2RlbHNBcnJbbnVtYmVyT2ZTZWxlY3RdW2RpcmVjdGlvbk9mU2libGluZ0Fycm93XSA9IG51bGw7XG4gICAgICAgICAgICAkKGFycm93U2libGluZykuY3NzKHsnb3BhY2l0eSc6JzAuNSd9KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9kZWxzQXJyW251bWJlck9mU2VsZWN0XVtkaXJlY3Rpb25PZkFycm93XSA9IG51bGw7XG4gICAgICAgICAgICAkKGUudGFyZ2V0KS5jc3MoeydvcGFjaXR5JzonMC41J30pO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgICQoJyNidG4tY29udGludWUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgYW5zd2Vyc0FyciA9IEpTT04ucGFyc2Uoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYW5zd2VycycpKTtcbiAgICAgICAgdmFyIGFyckxlbmd0aCA9IGFuc3dlcnNBcnIubGVuZ3RoO1xuICAgICAgICAvL1xuICAgICAgICAvL2Zvcih2YXIgaSA9IDA7IGkgPCA2OyBpKyspe1xuICAgICAgICAvL31cbiAgICAgICAgJCgnLnNlbGVjdC1qcycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKXtcbiAgICAgICAgICAgIG1vZGVsc0Fyci5mb3JFYWNoKCBmdW5jdGlvbihpdGVtLCBpLCBhcnIpe1xuICAgICAgICAgICAgICAgIGlmKGluZGV4ID09PSBpICAmJiAgJChlbCkudmFsKCkgIT09ICc/Jykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLm51bWJlciA9ICQoZWwpLnZhbCgpIC0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy50ZXh0YXJlYS1qcycpLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0nKTtcbiAgICAgICAgICAgIG1vZGVsc0Fyci5mb3JFYWNoKCBmdW5jdGlvbihpdGVtLCBpLCBhcnIpe1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJChlbCkuYXR0cignZGF0YS10ZXh0YXJlYS1qcycpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgKCQoZWwpLmF0dHIoJ2RhdGEtdGV4dGFyZWEtanMnKSkpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0ubnVtYmVyKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgKGl0ZW0ubnVtYmVyKSk7XG4gICAgICAgICAgICAgICAgaWYoaXRlbS5udW1iZXIgPT0gJChlbCkuYXR0cignZGF0YS10ZXh0YXJlYS1qcycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dGFyZWEgPSAkKGVsKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3llcycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXG5cblxuICAgICAgICBhbnN3ZXJzQXJyW2Fyckxlbmd0aCAtIDFdLmFuc3dlcnMgPSBtb2RlbHNBcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKGFuc3dlcnNBcnIpO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdhbnN3ZXJzJywgSlNPTi5zdHJpbmdpZnkoYW5zd2Vyc0FycikpO1xuICAgIH0pO1xuXG4gICAgLypGb3Igc2VsZWN0Ki9cbiAgICAvL3RoaXMuJGRpYWdyYW1UZXN0Lm9uKCAnY2hhbmdlJywgJ3NlbGVjdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIC8vICAgIG1vZGVsc0Fyci5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGksIGFycil7XG4gICAgLy8gICAgICAgIGlmICggaXRlbS5uYW1lID09PSAkKGUudGFyZ2V0KS5wYXJlbnQoKS5kYXRhKCduYW1lLWRpYWdyYW12ZW5uJykgKXtcbiAgICAvLyAgICAgICAgICAgIHZhciAkdGhhdCA9ICQodGhhdCk7XG4gICAgLy8gICAgICAgICAgICB2YXIgcHJvcCA9ICR0aGF0LmF0dHIoJ25hbWUnKTtcbiAgICAvLyAgICAgICAgICAgIGl0ZW1bcHJvcF0gPSAkdGhhdC52YWwoKTtcbiAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKGFycik7XG4gICAgLy8gICAgICAgIH1cbiAgICAvLyAgICB9KTtcbiAgICAvL30pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrVGVzdENvbnRyb2xsZXI7IiwidmFyIE1vZGVsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLm51bWJlciA9IG9wdGlvbnMubnVtYmVyIHx8IG51bGw7XG4gICAgdGhpcy5hcnJvd0xlZnQgPSBvcHRpb25zLmFycm93TGVmdCB8fCBudWxsO1xuICAgIHRoaXMuYXJyb3dSaWdodCA9IG9wdGlvbnMuYXJyb3dSaWdodCB8fCBudWxsO1xuICAgIHRoaXMudGV4dGFyZWEgPSBvcHRpb25zLnRleHRhcmVhIHx8IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyJdfQ==
