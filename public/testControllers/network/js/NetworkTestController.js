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

                if(item.number == $(el).attr('data-textarea-js')) {
                    item.textarea = $(el).val();
                }
            });
        });


        answersArr[arrLength - 1].answers = modelsArr;
        console.log(answersArr);
        sessionStorage.setItem('answers', JSON.stringify(answersArr));
    });

};

module.exports = NetworkTestController;