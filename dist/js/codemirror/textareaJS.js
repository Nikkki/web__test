var myTextarea = document.getElementById('codemirror-js');

var editor = CodeMirror.fromTextArea(myTextarea, {

    matchBrackets: true,
    lineNumbers: true,
    mode: "javascript",
    tabSize: 3,
    autofocus: true
});