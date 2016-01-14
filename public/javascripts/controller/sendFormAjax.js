'use strict';
var Subscriber = require('./../model/subscriber.js');
var Validator = require('./validateForms.js');
var form = document.getElementById('form-reg');
var modal = require('./../../../dist/js/bootstrap.min');

$('#form-reg').submit(function (e){
    e.preventDefault();

    var subscriber = new Subscriber();
    subscriber.username = $('#form-reg [name = username]').val();
    subscriber.phoneNum = $('#form-reg [name = phoneNum]').val();
    subscriber.email = $('#form-reg [name = email]').val();
    subscriber.ip = geoplugin_request();
    subscriber.city = geoplugin_city();
    subscriber.country = geoplugin_countryName();
    subscriber.update = Date.now();

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
                    var error200Txt = 'Спасибо, Ваша заявка принята! Мы с Вами свяжемся в ближайшее время';
                    $('.modal').modal('show');
                    $('.modal-title').text(error200Txt);
                },
                400: function () {
                    var error400Txt = 'Извините, но что-то пошло не так, повторите попытку'
                    $('.modal').modal('show');
                    $('.modal-title').text(error400Txt);
                }
            }
        }).then(function() {
            console.log('уряя');
        }, function () {
            console.log('что-то пошло не так...');
        });
    }
});

