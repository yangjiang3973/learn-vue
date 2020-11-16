const _ = require('../utils');
const { Dep } = require('../dep');
require('./object'); // just include and make functions run
require('./array');

const ArrayType = 1;
const ObjectType = 2;

const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']; //overrideArrayMethod

class Observer {
    constructor(obj, type) {
        if (typeof obj !== 'object') {
            console.error('This parameter must be an object：' + obj);
            return;
        }
        this.deps = [];
        this.value = obj;
        obj['__ob__'] = this;
        if (type === ArrayType) {
            this.overrideArrayProto(obj, this.deps);
        }
        this.observe(obj);
    }

    observe(obj) {
        const self = this;
        Object.keys(obj).forEach((key) => {
            if (_.isReserverd(key)) return;

            // check if obj already has pre-defined getter/setter, need to keep
            let setter, getter;
            const property = Object.getOwnPropertyDescriptor(obj, key);
            if (property) {
                if (property.configurable === false) return;
                getter = property.get;
                setter = property.set;
            }

            let val = obj[key]; // cannot obj[key] in getter, otherwise circle calling
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
                            val.__ob__.deps.splice(
                                val.__ob__.deps.indexOf(dep),
                                1
                            );
                        }
                        if (typeof newVal === 'object') {
                            let childOb;
                            if (Array.isArray(newVal)) {
                                childOb = new Observer(newVal, ArrayType);
                            } else {
                                childOb = new Observer(newVal);
                            }
                            childOb.deps.push(dep);
                        }
                        dep.notify();
                    }
                },
            });
            // include obj and array
            if (typeof obj[key] === 'object') {
                // if this is array, fake proto first?
                const childOb = new Observer(obj[key]);
                childOb.deps.push(dep);
                // dep.depend();
                if (Array.isArray(obj[key])) {
                    self.overrideArrayProto(obj[key], childOb.deps);
                }
            }
        });
    }

    overrideArrayProto(obj, deps) {
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
                deps.forEach((dep) => {
                    dep.notify();
                });
                return result;
            };
        }, this);

        Object.setPrototypeOf(obj, FakeProto);
    }

    notify() {
        this.deps.forEach((dep) => {
            dep.notify();
        });
    }

    addVm(vm) {
        this.vm = vm;
    }
}

module.exports.Observer = Observer;
