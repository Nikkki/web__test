var DiagramVennModel = function (options) {
        options = options || {},
        this.leftPart = options.leftPart || false,
        this.innerPart = options.innerPart || false,
        this.rightPart = options.rightPart || false,
        this.nameOfUnion_js = options.nameOfUnion_js || 'inner_join',
        this.name = options.name || null
};

module.exports = DiagramVennModel;