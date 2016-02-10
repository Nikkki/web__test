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
