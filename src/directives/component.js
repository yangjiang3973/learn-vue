import Compiler from '../compiler';

export const bind = function () {
    /*
    1. instantiate sub class
    2. call compiler
    */
    const Ctor = this.vm.options.components[this.expression];
    const comp = new Ctor();
    new Compiler(this.el, comp);
};

export const update = function (value) {};
