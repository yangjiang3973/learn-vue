const { Compiler } = require('./compiler');
const { Watcher } = require('./watcher');
const { Observer } = require('./compiler');

class MVVM {
    constructor(options) {
        this.$options = options || {};

        this.$compile = new Compiler(options.el || document.body, this);
    }
}

module.exports.MVVM = MVVM;
