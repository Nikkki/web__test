var Subscriber = function(options){
    options = options || {};
    this.username = options.username || null;
    this.phoneNum = options.phoneNum || null;
    this.email = options.email || null;
    this.ip = options.ip || null;
    this.city = options.city || null;
    this.country = options.country || null;
    this.update = options.update || Date.now();
};

module.exports = Subscriber;
