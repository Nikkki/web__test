module.exports = function(router, btn, nextText) {

    var Start = require('./test/Start')(router),
        btnTest = require('./test/BtnTest')(router),
        NextTest = require ('./test/NextTest')(router),
        ProgressView = require('./test/ProgressView')(router),
        QuestionContainer = require('./test/questionContainer')(router),
        Result = require('./test/Result')(router);

    var Views = Views || {};

    Views = {
        start: new Start(),
        nextTest: new NextTest(),
        btnTest: new btnTest(),
        progressView: new ProgressView(),
        questionContainer: QuestionContainer,
        result:  Result
    };
    return Views;
};