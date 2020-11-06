const _ = require('../utils');
const { Compiler } = require('../compiler');

module.exports.bind = function () {
    /*
    1. instantiate sub class
    2. call compiler
    */
    const Ctor = this.vm.options.components[this.expression];
    const comp = new Ctor();
    new Compiler(this.el, comp);
};

module.exports.update = function (value) {};
