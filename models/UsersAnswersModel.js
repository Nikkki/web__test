var UsersAnswersmodel = function (options) {
    options = options || {};
    this.kind = options.kind || null;
    this.checkedAnswers = options.checkedAnswers || [];
    this.userAnswers = options.userAnswers || [];
    this._id = options._id || null;
    this.text = options.text || '';
};
module.exports = UsersAnswersmodel;