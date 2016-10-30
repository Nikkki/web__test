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

//var data = {
//    username: '',
//    email: '',
//    phoneNum: '+380500000248'
//};

/*1.название свойства должно совпадать с name в form*/
/*2.вывод ошибок на экран будет последователен,
    как вписать название ошибок в массив значений свойств*/
//var validator = new Validator({
//    username: ['isNonEmpty', 'isAlpha'],
//    email: ['isNonEmpty', 'isEmail'],
//    phoneNum: ['isNonEmpty','isPhoneUA']
//});
//
//validator.validate(data);
//console.log(validator.errors);

module.exports = Validator;