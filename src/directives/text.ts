const _ = require('../utils');

module.exports.bind = function () {
    _.isElementNode(this.el)
        ? (this.attrToBind = 'textContent')
        : (this.attrToBind = 'data');
};

module.exports.update = function (value: string) {
    this.el[this.attrToBind] = value;
};
