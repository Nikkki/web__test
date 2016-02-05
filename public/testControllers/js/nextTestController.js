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