const { Compiler } = require('./compiler');
const { Watcher } = require('./watcher');
const { Observer } = require('./observer');

class MVVM {
    constructor(options) {
        this.$options = options || {};
        this._data = options.data;
        // data proxy
        Object.keys(this._data).forEach((key) => {
            this._proxyData(key);
        });

        new Observer(this._data); // observe

        this.$compile = new Compiler(options.el || document.body, this);
    }

    _proxyData(key) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get: () => {
                return this._data[key];
            },
            set: (newVal) => {
                this._data[key] = newVal;
            },
        });
    }
}

module.exports.MVVM = MVVM;
