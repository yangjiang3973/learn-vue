const _ = require('../utils');
const { Dep } = require('../dep');
require('./object'); // just include and make functions run
require('./array');

const ArrayType = 1;
const ObjectType = 2;

const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']; //overrideArrayMethod

module.exports.observeData = function (data) {
    if (!data || typeof data !== 'object') return;

    if (data.__ob__ && data.__ob__ instanceof Observer) {
        return data.__ob__;
    } else if (_.isArray(data)) {
        return new Observer(data, ArrayType);
    } else if (
        _.isPlainObject(data) &&
        Object.isExtensible(data) &&
        !data._isVue
    ) {
        return new Observer(data);
    }
};

class Observer {
    constructor(obj, type) {
        this.dep = new Dep(); // TODO: mabe init as null
        this.value = obj;
        obj['__ob__'] = this;
        if (type === ArrayType) {
            this.overrideArrayProto(obj, this.dep);
        }
        this.observe(obj);
    }

    observe(obj) {
        Object.keys(obj).forEach((key) => {
            if (_.isReserverd(key)) return;
            this.defineReactive(obj, key, obj[key]);
        });
    }

    defineReactive(obj, key, val) {
        // check if obj already has pre-defined getter/setter, need to keep
        let setter, getter;
        const property = Object.getOwnPropertyDescriptor(obj, key);
        if (property) {
            if (property.configurable === false) return;
            getter = property.get;
            setter = property.set;
        }

        let dep = new Dep();
        // NOTE: always add key/val to this.value, because obj may be a $added data that need to add to original obj
        // but first time this.value === obj
        Object.defineProperty(this.value, key, {
            enumerable: true,
            configurable: true,
            get: function definedGet() {
                if (Dep.target) {
                    dep.depend();
                }
                return getter ? getter.call(obj) : val;
            },
            set: function (newVal) {
                val = getter ? getter.call(obj) : val;
                if (newVal !== val) {
                    if (setter) {
                        setter.call(obj, newVal);
                    } else {
                        val = newVal;
                    }
                    // remove dep from the old val
                    if (val && val.__ob__) {
                        val.__ob__.dep = null;
                    }
                    if (typeof newVal === 'object') {
                        let childOb;
                        if (Array.isArray(newVal)) {
                            childOb = new Observer(newVal, ArrayType);
                        } else {
                            childOb = new Observer(newVal);
                        }
                        childOb.dep = dep;
                    }
                    dep.notify();
                }
            },
        });
        // include obj and array
        if (typeof obj[key] === 'object') {
            // if this is array, fake proto first?
            const childOb = new Observer(obj[key]);
            childOb.dep = dep;
            if (Array.isArray(obj[key])) {
                this.overrideArrayProto(obj[key], childOb.dep);
            }
        }
    }

    overrideArrayProto(obj, dep) {
        const oldArr = obj.slice(0);
        const FakeProto = Object.create(Array.prototype);
        OAM.forEach((method) => {
            FakeProto[method] = function (...args) {
                const result = Array.prototype[method].apply(this, args);
                let inserted;
                switch (method) {
                    case 'push':
                        inserted = args;
                        break;
                    case 'unshift':
                        inserted = args;
                        break;
                    case 'splice':
                        inserted = args.slice(2);
                        break;
                }
                if (inserted) {
                    inserted.forEach((arg) => {
                        if (typeof arg === 'object') {
                            new Observer(arg);
                            // NOTE: will this result in missing deps? yes
                        }
                    });
                }
                dep.notify();
                return result;
            };
        }, this);

        Object.setPrototypeOf(obj, FakeProto);
    }

    // notify() {
    //     this.deps.forEach((dep) => {
    //         dep.notify();
    //     });
    // }

    addVm(vm) {
        this.vm = vm;
    }

    removeVm(vm) {
        if (this.vm === vm) this.vm = null;
    }
}

module.exports.Observer = Observer;
