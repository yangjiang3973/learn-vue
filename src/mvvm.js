const { Compiler } = require('./compiler');
const { Watcher } = require('./watcher');
const { Observer } = require('./observer');
const _ = require('./utils');

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
        this._data = options.data || {};
        this._methods = options.methods;
        // data proxy
        Object.keys(this._data).forEach((key) => {
            // check reserved key word
            if (!_.isReserved(key)) {
                this._proxyData(key);
            }
        });

        Object.keys(this._methods).forEach((key) => {
            this._proxyMethods(key);
        });

        new Observer(this._data); // observe

        this.$compile = new Compiler(options.el || document.body, this);
    }

    _proxyData(key) {
        // need to store ref to self here
        // because these getter/setters might
        // be called by child instances!
        // var self = this; // if no this line, what will happened?
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
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
