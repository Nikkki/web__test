var Model = function (options) {
    options = options || {};
    this.number = options.number || null;
    this.arrowLeft = options.arrowLeft || null;
    this.arrowRight = options.arrowRight || null;
    this.textarea = options.textarea || null;
};

module.exports = Model;