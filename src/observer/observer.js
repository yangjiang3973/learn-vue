const { Dep } = require('../dep.js');
const _ = require('../utils');
require('./object'); // just include and make functions run
require('./array');

const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']; //overrideArrayMethod

class Observer {
    constructor(obj) {
        if (typeof obj !== 'object') {
            console.error('This parameter must be an object：' + obj);
        }
        this.deps = [];
        this.value = obj;
        obj['__ob__'] = this;
        this.observe(obj);
    }

    observe(obj) {
        // if (Array.isArray(obj)) {
        //     this.overrideArrayProto(obj);
        // }
        const self = this;
        Object.keys(obj).forEach((key) => {
            // skip $ or _
            if (_.isReserverd(key)) return; //* NOTE: why $ or _ maybe in data?
            let val = obj[key]; // save the old value
            let dep = new Dep();
            // NOTE: always add key/val to this.value, because obj may be a $added data that need to add to original obj
            // but first time this.value === obj
            Object.defineProperty(this.value, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    if (Dep.target) {
                        Dep.target.deps.push(dep);
                        dep.depend();
                    }
                    return val;
                },
                set: function (newVal) {
                    if (newVal !== val) {
                        // TODO: what if it is an array
                        if (typeof newVal === 'object') {
                            const childOb = new Observer(newVal);
                            childOb.deps.push(dep);
                        }
                        val = newVal;
                        dep.notify();
                    }
                },
            });
            // include obj and array
            if (typeof obj[key] === 'object') {
                // if this is array, fake proto first?
                if (Array.isArray(obj[key])) {
                    self.overrideArrayProto(obj[key], dep);
                }
                const childOb = new Observer(obj[key]);
                childOb.deps.push(dep);
            }
        });
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
                        if (typeof arg === 'object') new Observer(arg);
                        // NOTE: will this result in missing deps?
                    });
                }
                dep.notify();
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
