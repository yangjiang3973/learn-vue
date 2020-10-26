const _ = require('../utils');

module.exports.bind = function () {
    const eventType = this.name.split(':')[1];
    const fn = this.vm[this.expression];
    if (eventType && fn) {
        this.el.addEventListener(eventType, fn.bind(this.vm), false);
    }
};

module.exports.update = function (value) {
    return;
};
