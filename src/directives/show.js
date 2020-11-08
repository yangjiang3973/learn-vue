const _ = require('../utils');

module.exports.bind = function () {
    this.attrToBind = this.el.style;
};

module.exports.update = function (value) {
    if (value) {
        this.attrToBind.display = '';
    } else {
        this.attrToBind.display = 'none';
    }
};
