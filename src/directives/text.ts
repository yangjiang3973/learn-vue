import {isElementNode} from '../utils';

module.exports.bind = function () {
    isElementNode(this.el)
        ? (this.attrToBind = 'textContent')
        : (this.attrToBind = 'data');
};

module.exports.update = function (value: string) {
    this.el[this.attrToBind] = value;
};
