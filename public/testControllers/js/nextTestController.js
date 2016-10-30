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
            sessionStorage.setItem('answers', JSON.stringify(answersArr));
        }
    }
};

module.exports = nextTestController;