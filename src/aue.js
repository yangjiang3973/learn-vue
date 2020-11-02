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
class Aue {
    constructor(options) {
        // this.$options = options || {};
        this._directives = []; // all directives
        this._data = options.data || {};
        this._computed = options.computed;
        this._methods = options.methods;

        // TODO: merge options into new this.options
        // static options are custom
        this.options = { ...options, ...Aue.options };

        // data proxy
        Object.keys(this._data).forEach((key) => {
            // check reserved key word
            if (!_.isReserverd(key)) {
                this._proxyData(key);
            }
        });

        // computed proxy
        Object.keys(this._computed).forEach((key) => {
            this._proxyComputed(key);
        });

        // methods proxy
        Object.keys(this._methods).forEach((key) => {
            this._proxyMethods(key);
        });

        new Observer(this._data); // observe

        this.$compile = new Compiler(options.el || document.body, this);
    }

    static options = {
        directives: require('./directives'),
        filters: require('./filters'),
        partials: {},
        transitions: {},
        components: {},
    };
    // add public APIs, like directives()
    static directive(id, def) {
        if (!def) {
            return this.options['directives'][id]; // this.options is static
        } else {
            this.options['directives'][id] = def;
        }
    }

    static filter(id, def) {
        if (!def) {
            return this.options['filters'][id];
        } else {
            this.options['filters'][id] = def;
        }
    }

    _proxyComputed(key) {
        const userDef = this._computed[key];
        if (typeof userDef === 'function') {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get: userDef,
                set: () => {},
            });
        }
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

module.exports.Aue = Aue;
