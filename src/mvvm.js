const { Compiler } = require('./compiler');
const { Watcher } = require('./watcher');
const { Observer } = require('./observer');

// let vm = new MVVM({
//     el: '#app',
//     data: {
//         word: 'Hello World!',
//         msg: 'greeting',
//     },
//     method: {
//         changeWord() {
//             this.word = 'fuck world!';
//         },
//     },
// });

class MVVM {
    constructor(options) {
        this.$options = options || {};
        this._data = options.data;
        this._methods = options.methods;
        // data proxy
        Object.keys(this._data).forEach((key) => {
            this._proxyData(key);
        });

        Object.keys(this._methods).forEach((key) => {
            this._proxyMethods(key);
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

    _proxyMethods(key) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get: () => {
                return this._methods[key];
            },
            set: (newVal) => {
                this._methods[key] = newVal;
            },
        });
    }
}

module.exports.MVVM = MVVM;
