const { observeData } = require('../observer/observer');
const { Watcher } = require('../watcher');

const _ = require('../utils');

module.exports.initState = function (vm) {
    vm._watcherList = [];
    initProps(vm);
    initData(vm);
    initComputed(vm);
    initMethods(vm);
    intiWatch(vm);
};

function initProps(vm) {}

function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};

    // proxy data
    Object.keys(vm._data).forEach((key) => {
        // check reserved key word
        if (!_.isReserverd(key)) {
            Object.defineProperty(vm, key, {
                enumerable: true,
                configurable: true,
                get: () => {
                    return vm._data[key];
                },
                set: (newVal) => {
                    vm._data[key] = newVal;
                },
            });
        }
    });

    // observe data
    const ob = observeData(this._data);
    // ob.addVm(this); // for $add, after add new data on root level, need to proxy, save vm as the target
}

// TODO: just a very basic computed, need to complete later
function initComputed(vm) {
    const computed = vm.$options.computed;
    if (!computed) return;

    // proxy computed
    Object.keys(computed).forEach((key) => {
        const userDef = computed[key];
        if (typeof userDef === 'function') {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get: userDef,
                set: () => {},
            });
        }
    });
}

function initMethods(vm) {
    const methods = vm.$options.methods;
    Object.keys(methods).forEach((key) => {
        vm[key] = methods[key].bind(vm);
    });
}

function initWatch(vm) {
    // TODO:
}

module.exports.stateMixin = function (Aue) {
    // $data
    Object.defineProperty(Aue.prototype, '$data', {
        get() {
            return this._data;
        },
        set(newData) {
            console.error(
                'Avoid replacing instance root $data. Use nested data properties instead.'
            );
        },
    });

    // $set and $delete
    // TODO: add back and test

    // $watch
    // TODO: $watch in vue2.6 is much simpler, maybe need to refactor and test again
    Aue.prototype.$watch = function (exp, cb, options) {
        const vm = this;
        const wrappedCb = function (newVal, oldVal) {
            cb.call(vm, newVal, oldVal);
        };
        // TODO: now exp can only be simple key, need to improve later
        const key = exp;
        let watcher = vm._userWatchers[key];
        if (watcher) {
            watcher.addCb(wrappedCb);
        } else {
            watcher = new Watcher(vm, exp, wrappedCb, {
                user: true,
                deep: options.deep,
            });

            vm._userWatchers[key] = watcher;
        }
        if (options.immediate) {
            wrappedCb(watcher.value);
        }
        const unwatch = function () {
            watcher.removeCb(wrappedCb);
            if (!watcher.active) {
                vm._userWatchers[key] = null;
            }
        };
        //NOTE: what if you unwatch, then want to watch again? The watcher maybe teardown, but still in _userWatchers
        // so you removed sub from you dep, but you do not add back
        return unwatch;
    };
};