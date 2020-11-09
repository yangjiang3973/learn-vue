const { Dep } = require('../dep.js');
const _ = require('../utils');
require('./object'); // just include and make functions run

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
        if (Array.isArray(obj)) {
            this.overrideArrayProto(obj);
        }

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
                        Dep.target.deps.push(dep); // watcher will have all its dependencies
                        dep.depend(); // dep will have all subs(watchers)
                    }
                    // if (key === 'observeData') console.log(Dep.target);
                    return val;
                },
                set: function (newVal) {
                    if (newVal !== val) {
                        if (typeof newVal === 'object') this.observe(newVal);
                        // this.$callback(newVal, val); // pass by value or ref?
                        val = newVal;
                        // dep.notify(newVal, val);
                        dep.notify();
                    }
                }.bind(this), // need to bind this! otherwise this points to obj...
            });
            if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
                // this.observe(obj[key]); // TODO: change to a instance and will call observe in constructor
                const childOb = new Observer(obj[key]);
                childOb.deps.push(dep);
            }
        });
    }

    overrideArrayProto(obj) {
        const oldArr = obj.slice(0);
        const FakeProto = Object.create(Array.prototype);
        OAM.forEach((method) => {
            const self = this;
            FakeProto[method] = function (args) {
                Array.prototype[method].call(this, args);
                self.observe(this);
                self.$callback(this, oldArr); // call callback
            };
        }, this);

        Object.setPrototypeOf(obj, FakeProto);
    }

    notify() {
        // console.log('Observer -> notify -> this.deps', this);
        this.deps.forEach((dep) => {
            dep.notify();
        });
    }
}

module.exports.Observer = Observer;
