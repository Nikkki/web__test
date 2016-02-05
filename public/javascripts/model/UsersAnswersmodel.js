var UsersAnswersmodel = function (options) {
    options = options || {};
    this.kind = options.kind || null;
    this.answers = options.answers || [];
    this._id = options._id || null;
};
module.exports = UsersAnswersmodel;