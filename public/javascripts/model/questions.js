//var questions = [
//  {
//      text: 'Какая из перечисленных переменных не относиться к выгрузке файлов?',
//      answers: ['max_file_size','max_execution_time',
//      'post_max_size', 'max_input_time']
//  },
//  {
//  	text: 'Что из ниже перечисленного является предопределенной константой',
//  	answers: ['TRUE', 'NULL', '__FILE__', 'CONSTANT']
//  },
//  {
//  	text: 'Если параметр expire в функции setcookie() не указан тогда:',
//    answers: ['Срок действия Cookie никогда не истечет',
//    'Срок действия Cookie истечет в момент закрытия браузера',
//    'Срок действия Cookie истечет в пределах 30 минут',
//    'Срок действия Cookie истечет в течении 24 часов']
//  },
//  {
//  	text: 'Что из нижеперечисленного позволяет передавать значение переменной между различными страницами?',
//    answers: ['static', 'global', 'session_register()', 'Ничего из вышеперечисленного']
//  },
//{
//  	text: 'Существует ли поддержка ключевого слова goto в последней версии PHP',
//    answers: ['Да', 'Нет']
//  }
//];
//
//module.exports = questions;

/*
* ['inner_join','left_outer_join','right_outer_join','full_outer_join']
* amountOfDiagrams: 4
* */

/*
* поле callback - это массив, туда вносим скрипты, которые нужно подгрузить
* */

/*
* kinds:
* */

/*
* Правильный ответ для ДИАГРАММЫ ВЕННА:
*
var arr = [{
 inner_join: [{leftPart: false, innerPart: true, rightPart: false}],

 left_outer_join: [{leftPart: true, innerPart: false, rightPart: false},
 {leftPart: true, innerPart: true, rightPart: false}],

 right_outer_join: [{leftPart: false, innerPart: false, rightPart: true},
 {leftPart: false, innerPart: true, rightPart: true}],

 full_outer_join: [{leftPart: true, innerPart: true, rightPart: true},
 {leftPart: true, innerPart: false, rightPart: true}]

 }];
*
* */


/*
* Правильные ответы для Таблиц
* var arr = [
 {
 name: 'table-huge',
 arrUserAnswers: [[1,0,1,1,1],[1,1,0,0,1], [0,1,0,1,1], [0,1,0,1,1]]
 },
 {
 name: 'table-small-and',
 arrUserAnswers: [[1,0],[0,0]]
 },
 {
 name: 'table-small-or',
 arrUserAnswer: [[1,1],[1,0]]
 }
 ];
*  */
//var arr = [
//    {
//        name: 'table-huge',
//        arrUserAnswers: [[1,0,1,1,1],[1,1,0,0,1], [0,1,0,1,1], [0,1,0,1,1]]
//    },
//    {
//        name: 'table-small-and',
//        arrUserAnswers: [[1,0],[0,0]]
//    },
//    {
//        name: 'table-small-or',
//        arrUserAnswers: [[1,1],[1,0]]
//    }
//];


///* callback for textarea JS */
//['/js/testControllers.js','/js/codemirror/codemirror.js', '/js/codemirror/javascript.js', '/js/codemirror/textareaJS.js']
//
///*callback for textarea HTML*/
//['/js/testControllers.js','/js/codemirror/codemirror.js',
//    '/js/codemirror/css.js','/js/codemirror/htmlmixed.js','/js/codemirror/javascript.js','/js/codemirror/xml.js',
//    '/js/codemirror/textareaHTML.js']
//
///*callback for textarea PHP*/
//    ['/js/testControllers.js','/js/codemirror/codemirror.js', '/js/codemirror/javascript.js', '/js/codemirror/textareaJS.js']
