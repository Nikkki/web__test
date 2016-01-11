(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./../model/subscriber.js":4,"./validateForms.js":2}],2:[function(require,module,exports){
var Validator = function (options) {
    options = options || {};
    this.rules = options || {};
    this.errors = [];
};

var Error = function (options) {
    options = options  || {};
    this.nameField = options.nameField || null;
    this.errorTitle = options.errorTitle || null;
};

Validator.prototype.types = {
    'isNonEmpty': function (value) {
        if (value && value.length !== 0) {
            return true;
        }
        return 'Поле не должно быть пустым';
    },
    'isAlpha' : function (value) {
        var alphaOnly = /[a-zа-я]/i;
        if (value.match(alphaOnly)) {
            return true;
        } else {
            return 'Поле должно содержать только буквы';
        }
    },
    'isEmail' : function (value) {
        var email = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/i;
        if (value.match(email)) {
            return true;
        } else {
            return 'Введите корректный email адрес';
        }
    },
    'isPhoneUA' : function (value) {
        var phone = /^[+]?\d{12}$/gi;
        if (value.match(phone)) {
            return true;
        } else {
            return 'Введите номер мобильного телефона в формате +380XXXXXXXXX';
        }
    }
};

Validator.prototype.validate = function (data, callback) {
    var result;
    var rules = this.rules;
    this.errors = [];
    var errorsInField = []; /*ошибки в одном поле*/

    for (var name in data) { /*название правила*/
        /*проверка наличия правил для поля*/
        if (rules[name]) {
            var currentRules = rules[name];
            for (var index in currentRules) {
                result = this.types[currentRules[index]](data[name]);
                if (result !== true) {
                    errorsInField.push(result);
                }
            }
            /*проверка наличия ошибок в поле*/
            if(errorsInField.length > 0) {
                error = new Error ({
                    nameField: name,
                    errorTitle: errorsInField
                });
                errorsInField = [];
                this.errors.push(error);
            }
        }
    }
};

/*EXAMPLE*/

var data = {
    username: '',
    email: '',
    phoneNum: '+380500000248'
};

/*1.название свойства должно совпадать с name в form*/
/*2.вывод ошибок на экран будет последователен,
    как вписать название ошибок в массив значений свойств*/
var validator = new Validator({
    username: ['isNonEmpty', 'isAlpha'],
    email: ['isNonEmpty', 'isEmail'],
    phoneNum: ['isNonEmpty','isPhoneUA']
});

validator.validate(data);
//console.log(validator.errors);

module.exports = Validator;
},{}],3:[function(require,module,exports){
var Subscriber = require('./model/subscriber.js'),
    validation = require('./controller/validateForms.js'),
    sendFormAjax = require('./controller/sendFormAjax.js');
},{"./controller/sendFormAjax.js":1,"./controller/validateForms.js":2,"./model/subscriber.js":4}],4:[function(require,module,exports){
var Subscriber = function(options){
    options = options || {};
    this.username = options.username || null;
    this.phoneNum = options.phoneNum || null;
    this.email = options.email || null;
};

module.exports = Subscriber;

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9jb250cm9sbGVyL3NlbmRGb3JtQWpheC5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9jb250cm9sbGVyL3ZhbGlkYXRlRm9ybXMuanMiLCIvaG9tZS9uaWtpdGEvUHJvamVjdHMvd2ViLXNjaG9vbC9wdWJsaWMvamF2YXNjcmlwdHMvZmFrZV8zMDZhYjViYS5qcyIsIi9ob21lL25pa2l0YS9Qcm9qZWN0cy93ZWItc2Nob29sL3B1YmxpYy9qYXZhc2NyaXB0cy9tb2RlbC9zdWJzY3JpYmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG52YXIgU3Vic2NyaWJlciA9IHJlcXVpcmUoJy4vLi4vbW9kZWwvc3Vic2NyaWJlci5qcycpO1xudmFyIFZhbGlkYXRvciA9IHJlcXVpcmUoJy4vdmFsaWRhdGVGb3Jtcy5qcycpO1xudmFyIGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1yZWcnKTtcblxuJCgnI2Zvcm0tcmVnJykuc3VibWl0KGZ1bmN0aW9uIChlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgc3Vic2NyaWJlciA9IG5ldyBTdWJzY3JpYmVyKCk7XG4gICAgc3Vic2NyaWJlci51c2VybmFtZSA9ICQoJyNmb3JtLXJlZyBbbmFtZSA9IHVzZXJuYW1lXScpLnZhbCgpO1xuICAgIHN1YnNjcmliZXIucGhvbmVOdW0gPSAkKCcjZm9ybS1yZWcgW25hbWUgPSBwaG9uZU51bV0nKS52YWwoKTtcbiAgICBzdWJzY3JpYmVyLmVtYWlsID0gJCgnI2Zvcm0tcmVnIFtuYW1lID0gZW1haWxdJykudmFsKCk7XG5cbiAgICB2YXIgdmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcih7XG4gICAgICAgIHVzZXJuYW1lOiBbJ2lzTm9uRW1wdHknLCAnaXNBbHBoYSddLFxuICAgICAgICBlbWFpbDogWydpc05vbkVtcHR5JywgJ2lzRW1haWwnXSxcbiAgICAgICAgcGhvbmVOdW06IFsnaXNOb25FbXB0eScsJ2lzUGhvbmVVQSddXG4gICAgfSk7XG5cbiAgICB2YWxpZGF0b3IudmFsaWRhdGUoc3Vic2NyaWJlcik7XG5cbiAgICAkKCdmb3JtI2Zvcm0tcmVnIHNwYW4uZXJyb3ItbWVzc2FnZScpLmVhY2goZnVuY3Rpb24oaSwgZWxlbSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgIH0pO1xuLyrQv9GA0L7QstC10YDQutCwINCy0LDQu9C40LTQsNGC0L7RgNC+0Lwg0LzQsNGB0YHQuNCy0LAg0YEg0L7RiNC40LHQutCw0LzQuCDQvdCwINC40YUg0L3QsNC70LjRh9C40LUqL1xuICAgIGlmKHZhbGlkYXRvci5lcnJvcnMubGVuZ3RoID4gMCl7XG4gICAgICAgIHZhbGlkYXRvci5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSwgYXJyKSB7XG4gICAgICAgICAgICB2YXIgbmFtZUZpZWxkID0gaXRlbS5uYW1lRmllbGQ7XG4gICAgICAgICAgICB2YXIgZXJyb3JUeHQgPSBpdGVtLmVycm9yVGl0bGVbMF07XG4gICAgICAgICAgICAkKCdmb3JtI2Zvcm0tcmVnIGlucHV0JykuZWFjaChmdW5jdGlvbihpLCBlbGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWVGaWVsZCA9PT0gJCh0aGlzKS5hdHRyKCduYW1lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmVycm9yLW1lc3NhZ2UnKS5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmVycm9yLW1lc3NhZ2UnKS50ZXh0KGVycm9yVHh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuXG4gICAgaWYgKHZhbGlkYXRvci5lcnJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6ICcvaW5kZXgvc3Vic2NyaWJlJyxcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxuICAgICAgICAgICAgZGF0YTogc3Vic2NyaWJlcixcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IHtcblxuICAgICAgICAgICAgICAgIDIwMDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IyMDBUeHQgPSAn0JLQsNGI0LAg0LfQsNGP0LLQutCwINC/0YDQuNGP0L3RgtCwISc7XG4gICAgICAgICAgICAgICAgICAgICQoJy5tb2RhbC1yZXNwb25zZS1qcycpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2luJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5tb2RhbC10aXRsZScpLnRleHQoZXJyb3IyMDBUeHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgNDAwOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0YPRgNGP0Y8nKTtcbiAgICAgICAgICAgIC8vdmFyIGVycm9yMjAwVHh0ID0gJ9CS0LDRiNCwINC30LDRj9Cy0LrQsCDQv9GA0LjRj9C90YLQsCEg0JzRiyDRgSDQktCw0LzQuCDRgdCy0Y/QttC10LzRgdGPJztcbiAgICAgICAgICAgIC8vJCgnLm1vZGFsLXJlc3BvbnNlLWpzJylcbiAgICAgICAgICAgIC8vICAgIC5hZGRDbGFzcygnaW4nKVxuICAgICAgICAgICAgLy8gICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJylcbiAgICAgICAgICAgIC8vICAgIC5jc3MoeydkaXNwbGF5JzogJ2Jsb2NrJ30pO1xuICAgICAgICAgICAgLy8kKCcubW9kYWwtYm9keScpLnRleHQoZXJyb3IyMDBUeHQpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbGJ4bScpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdyZXF1ZXN0IHNlbmRlZCA9ICcgKyBzdWJzY3JpYmVyKTtcbiAgICB9XG59KTtcblxuIiwidmFyIFZhbGlkYXRvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5ydWxlcyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbn07XG5cbnZhciBFcnJvciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgIHx8IHt9O1xuICAgIHRoaXMubmFtZUZpZWxkID0gb3B0aW9ucy5uYW1lRmllbGQgfHwgbnVsbDtcbiAgICB0aGlzLmVycm9yVGl0bGUgPSBvcHRpb25zLmVycm9yVGl0bGUgfHwgbnVsbDtcbn07XG5cblZhbGlkYXRvci5wcm90b3R5cGUudHlwZXMgPSB7XG4gICAgJ2lzTm9uRW1wdHknOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICfQn9C+0LvQtSDQvdC1INC00L7Qu9C20L3QviDQsdGL0YLRjCDQv9GD0YHRgtGL0LwnO1xuICAgIH0sXG4gICAgJ2lzQWxwaGEnIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBhbHBoYU9ubHkgPSAvW2EtetCwLdGPXS9pO1xuICAgICAgICBpZiAodmFsdWUubWF0Y2goYWxwaGFPbmx5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJ9Cf0L7Qu9C1INC00L7Qu9C20L3QviDRgdC+0LTQtdGA0LbQsNGC0Ywg0YLQvtC70YzQutC+INCx0YPQutCy0YsnO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAnaXNFbWFpbCcgOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gL15bLVxcdy5dK0AoW0EtejAtOV1bLUEtejAtOV0rXFwuKStbQS16XXsyLDR9JC9pO1xuICAgICAgICBpZiAodmFsdWUubWF0Y2goZW1haWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAn0JLQstC10LTQuNGC0LUg0LrQvtGA0YDQtdC60YLQvdGL0LkgZW1haWwg0LDQtNGA0LXRgSc7XG4gICAgICAgIH1cbiAgICB9LFxuICAgICdpc1Bob25lVUEnIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBwaG9uZSA9IC9eWytdP1xcZHsxMn0kL2dpO1xuICAgICAgICBpZiAodmFsdWUubWF0Y2gocGhvbmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAn0JLQstC10LTQuNGC0LUg0L3QvtC80LXRgCDQvNC+0LHQuNC70YzQvdC+0LPQviDRgtC10LvQtdGE0L7QvdCwINCyINGE0L7RgNC80LDRgtC1ICszODBYWFhYWFhYWFgnO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuVmFsaWRhdG9yLnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgIHZhciByZXN1bHQ7XG4gICAgdmFyIHJ1bGVzID0gdGhpcy5ydWxlcztcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIHZhciBlcnJvcnNJbkZpZWxkID0gW107IC8q0L7RiNC40LHQutC4INCyINC+0LTQvdC+0Lwg0L/QvtC70LUqL1xuXG4gICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhKSB7IC8q0L3QsNC30LLQsNC90LjQtSDQv9GA0LDQstC40LvQsCovXG4gICAgICAgIC8q0L/RgNC+0LLQtdGA0LrQsCDQvdCw0LvQuNGH0LjRjyDQv9GA0LDQstC40Lsg0LTQu9GPINC/0L7Qu9GPKi9cbiAgICAgICAgaWYgKHJ1bGVzW25hbWVdKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFJ1bGVzID0gcnVsZXNbbmFtZV07XG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBjdXJyZW50UnVsZXMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnR5cGVzW2N1cnJlbnRSdWxlc1tpbmRleF1dKGRhdGFbbmFtZV0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzSW5GaWVsZC5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyrQv9GA0L7QstC10YDQutCwINC90LDQu9C40YfQuNGPINC+0YjQuNCx0L7QuiDQsiDQv9C+0LvQtSovXG4gICAgICAgICAgICBpZihlcnJvcnNJbkZpZWxkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvciAoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lRmllbGQ6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yVGl0bGU6IGVycm9yc0luRmllbGRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlcnJvcnNJbkZpZWxkID0gW107XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKkVYQU1QTEUqL1xuXG52YXIgZGF0YSA9IHtcbiAgICB1c2VybmFtZTogJycsXG4gICAgZW1haWw6ICcnLFxuICAgIHBob25lTnVtOiAnKzM4MDUwMDAwMDI0OCdcbn07XG5cbi8qMS7QvdCw0LfQstCw0L3QuNC1INGB0LLQvtC50YHRgtCy0LAg0LTQvtC70LbQvdC+INGB0L7QstC/0LDQtNCw0YLRjCDRgSBuYW1lINCyIGZvcm0qL1xuLyoyLtCy0YvQstC+0LQg0L7RiNC40LHQvtC6INC90LAg0Y3QutGA0LDQvSDQsdGD0LTQtdGCINC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9C10L0sXG4gICAg0LrQsNC6INCy0L/QuNGB0LDRgtGMINC90LDQt9Cy0LDQvdC40LUg0L7RiNC40LHQvtC6INCyINC80LDRgdGB0LjQsiDQt9C90LDRh9C10L3QuNC5INGB0LLQvtC50YHRgtCyKi9cbnZhciB2YWxpZGF0b3IgPSBuZXcgVmFsaWRhdG9yKHtcbiAgICB1c2VybmFtZTogWydpc05vbkVtcHR5JywgJ2lzQWxwaGEnXSxcbiAgICBlbWFpbDogWydpc05vbkVtcHR5JywgJ2lzRW1haWwnXSxcbiAgICBwaG9uZU51bTogWydpc05vbkVtcHR5JywnaXNQaG9uZVVBJ11cbn0pO1xuXG52YWxpZGF0b3IudmFsaWRhdGUoZGF0YSk7XG4vL2NvbnNvbGUubG9nKHZhbGlkYXRvci5lcnJvcnMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZhbGlkYXRvcjsiLCJ2YXIgU3Vic2NyaWJlciA9IHJlcXVpcmUoJy4vbW9kZWwvc3Vic2NyaWJlci5qcycpLFxuICAgIHZhbGlkYXRpb24gPSByZXF1aXJlKCcuL2NvbnRyb2xsZXIvdmFsaWRhdGVGb3Jtcy5qcycpLFxuICAgIHNlbmRGb3JtQWpheCA9IHJlcXVpcmUoJy4vY29udHJvbGxlci9zZW5kRm9ybUFqYXguanMnKTsiLCJ2YXIgU3Vic2NyaWJlciA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG51bGw7XG4gICAgdGhpcy5waG9uZU51bSA9IG9wdGlvbnMucGhvbmVOdW0gfHwgbnVsbDtcbiAgICB0aGlzLmVtYWlsID0gb3B0aW9ucy5lbWFpbCB8fCBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdWJzY3JpYmVyO1xuIl19
