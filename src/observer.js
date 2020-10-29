const { Dep } = require('./dep.js');
const _ = require('./utils');

const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']; //overrideArrayMethod

class Observer {
    constructor(obj) {
        if (typeof obj !== 'object') {
            console.error('This parameter must be an object：' + obj);
        }
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
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    if (Dep.target) {
                        dep.depend();
                    }
                    return val;
                },
                set: function (newVal) {
                    if (newVal !== val) {
                        if (typeof newVal === 'object') this.observe(newVal);
                        // this.$callback(newVal, val); // pass by value or ref?
                        val = newVal;
                        dep.notify(newVal, val);
                    }
                }.bind(this), // need to bind this! otherwise this points to obj...
            });
            if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
                this.observe(obj[key]);
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
}

module.exports.Observer = Observer;
