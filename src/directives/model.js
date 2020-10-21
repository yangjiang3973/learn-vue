const _ = require('../utils');

module.exports.bind = function () {
    this.el.addEventListener(
        'input',
        (e) => {
            this.vm[this.expression] = e.target.value;
        },
        false
    );
};

module.exports.update = function (value) {
    this.el.value = typeof value === 'undefined' ? '' : value;
};
