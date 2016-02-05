module.exports = function (router) {
    var btnStart =  $('#startTest-js');
    var answers = sessionStorage.getItem('answers');

    btnStart.on('click', function(){
        console.log('startingTest works');
        if ($('#inputName').val() != "") {
            var name = $('#inputName').val();
            var testInSessionStor = sessionStorage.setItem('name', JSON.stringify(name));
            var answersArr = sessionStorage.setItem('answers', JSON.stringify([]));
        }
        return testInSessionStor;

    });
};
