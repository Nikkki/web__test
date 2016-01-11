'use strict';
var Subscriber = require('./../model/subscriber.js');
var Validator = require('./validateForms.js');
var form = document.getElementById('form-reg');

$('#form-reg').submit(function (e){
    e.preventDefault();

    var subscriber = new Subscriber();
    subscriber.username = $('#form-reg [name = username]').val();
    subscriber.phoneNum = $('#form-reg [name = phoneNum]').val();
    subscriber.email = $('#form-reg [name = email]').val();

    var validator = new Validator({
        username: ['isNonEmpty', 'isAlpha'],
        email: ['isNonEmpty', 'isEmail'],
        phoneNum: ['isNonEmpty','isPhoneUA']
    });

    validator.validate(subscriber);

    $('form#form-reg span.error-message').each(function(i, elem) {
            $(this).addClass('is-hidden');
            $(this).removeClass('error');
    });
/*проверка валидатором массива с ошибками на их наличие*/
    if(validator.errors.length > 0){
        validator.errors.forEach(function (item, i, arr) {
            var nameField = item.nameField;
            var errorTxt = item.errorTitle[0];
            $('form#form-reg input').each(function(i, elem) {
                if (nameField === $(this).attr('name')) {
                    $(this).siblings('.error-message').addClass('error');
                    $(this).siblings('.error-message').text(errorTxt);
                }
            });
        });
    };


    if (validator.errors.length === 0) {
        $.ajax({
            type: 'POST',
            url: '/index/subscribe',
            cache: false,
            async: true,
            data: subscriber,
            statusCode: {

                200: function () {
                    var error200Txt = 'Ваша заявка приянта!';
                    $('.modal-response-js')
                        .removeClass('in')
                        .attr('aria-hidden', 'true')
                        .css({'display': 'none'});
                    $('.modal-title').text(error200Txt);
                },
                400: function () {

                }
            }
        }).then(function() {
            console.log('уряя');
            //var error200Txt = 'Ваша заявка приянта! Мы с Вами свяжемся';
            //$('.modal-response-js')
            //    .addClass('in')
            //    .attr('aria-hidden', 'false')
            //    .css({'display': 'block'});
            //$('.modal-body').text(error200Txt);
        }, function () {
            console.log('lbxm');
        });
        return console.log('request sended = ' + subscriber);
    }
});

