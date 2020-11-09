module.exports.priority = 1000;

module.exports.isLiteral = true;

module.exports.bind = function () {
    this.update(this.expression);
};

module.exports.update = function (exp) {
    this.el.__v_trans = exp; // save transition id
};
