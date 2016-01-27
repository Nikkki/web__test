var questions = [
  {
      text: 'Какая из перечисленных переменных не относиться к выгрузке файлов?',
      answers: ['max_file_size','max_execution_time',
      'post_max_size', 'max_input_time'],
      correctAnswer: '' // нумерация ответов с нуля!
  },
  {
  	text: 'Что из ниже перечисленного является предопределенной константой',
  	answers: ['TRUE', 'NULL', '__FILE__', 'CONSTANT'],
    correctAnswer: '' 
  },
  {
  	text: 'Если параметр expire в функции setcookie() не указан тогда:',
    answers: ['Срок действия Cookie никогда не истечет',
    'Срок действия Cookie истечет в момент закрытия браузера',
    'Срок действия Cookie истечет в пределах 30 минут',
    'Срок действия Cookie истечет в течении 24 часов'],
    correctAnswer: '' 
  },
  {
  	text: 'Что из нижеперечисленного позволяет передавать значение переменной между различными страницами?',
    answers: ['static', 'global', 'session_register()', 'Ничего из вышеперечисленного'],
    correctAnswer: ''
  },
{
  	text: 'Существует ли поддержка ключевого слова goto в последней версии PHP',
    answers: ['Да', 'Нет'],
    correctAnswer: ''
  }
];

module.exports = questions;