var Subscriber = function(options){
    options = options || {};
    this.username = options.username || null;
    this.phoneNum = options.phoneNum || null;
    this.email = options.email || null;
};

module.exports = Subscriber;
