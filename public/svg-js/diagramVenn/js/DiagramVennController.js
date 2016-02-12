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
        conso
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