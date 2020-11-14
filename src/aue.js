const { Compiler } = require('./compiler');
const { Dep } = require('./dep');
const { Observer } = require('./observer/observer');
const _ = require('./utils');

class Aue {
    constructor(options) {
        // this.$options = options || {};
        this._directives = []; // all directives
        this._data = options.data || {};
        this._computed = options.computed || {};
        this._methods = options.methods || {};
        this._watcherList = [];
        this._userWatchers = {}; // user watchers as a hash

        // TODO: wrap in a init function? so sub class(component constructor can use)
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

        const ob = new Observer(this._data); // observe
        ob.addVm(this); // for $add, after add new data on root level, need to proxy, save vm as the target

        this.$compile = new Compiler(options.el || document.body, this);
    }

    static options = {
        directives: require('./directives'),
        filters: require('./filters'),
        partials: {},
        transitions: {},
        components: {},
    };

    // options of component are diff from instance of vue
    // most options(extendOptions) of component are passed in extend(to comp's constroctor), not when instantiate(options)
    // but options of vue are passed when instantiate
    static extend(extendOptions) {
        Sub = function (options) {
            this.options = { ...options, ...this.constructor.options };
        };
        // const Sub = new Function(
        //     'options',
        //     `this.options = { ...options, ...this.constructor.options };`
        // );
        Sub.prototype = Object.create(this.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = { ...extendOptions, ...Aue.options };
        // TODO: add static method to Sub, like direcitve(), component(), filter()...
        // TODO: set init config of Sub like Vue
        return Sub;
    }

    static component(id, def) {
        if (!def) {
            return this.options['components'][id];
        } else {
            this.options['components'][id] = def;
        }
    }

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

    static config = require('./config');

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

    _unproxyData(key) {
        delete this[key];
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

    _digest = function () {
        this._watcherList.forEach((watcher) => {
            watcher.update();
        });
        //TODO: also need to update children, need to keep an array of children of vms
    };
}

// merge methods to Aue
Object.assign(Aue.prototype, require('./api/data'));

console.log(Aue.config);
module.exports.Aue = Aue;
