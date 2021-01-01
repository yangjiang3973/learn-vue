import observeData from '../observer/observer';
import Watcher from '../watcher';
import { isReserverd } from '../utils';

export const initState = function (vm) {
    vm._watcherList = [];
    initProps(vm);
    initData(vm);
    initComputed(vm);
    initMethods(vm);
    initWatch(vm);
};

function initProps(vm) {
    // no copy to vm, just defineProperty on vm to get from prop
    // TODO: re-use defineReactive logic from Observer, maybe extract some code in defineReactive into a new function(simple defineProperty) and use in defineReactive
    const props = vm.$options.props;
    const propsData = vm.$options.propsData;
    if (!props || !propsData) return;

    Object.keys(props).forEach((key) => {
        const val = propsData[key];
        Object.defineProperty(vm, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                return val;
            },
            set: function reactiveSetter(newVal) {},
        });
    });
}

function initData(vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
    console.log('🚀 ~ file: state.js ~ line 37 ~ initData ~ data', data);

    // proxy data
    Object.keys(vm._data).forEach((key) => {
        // check reserved key word
        if (!isReserverd(key)) {
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
    const ob = observeData(vm._data);
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
            Object.defineProperty(vm, key, {
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
    if (methods) {
        Object.keys(methods).forEach((key) => {
            vm[key] = methods[key].bind(vm);
        });
    }
}

function initWatch(vm) {
    // TODO:
}

export const stateMixin = function (Aue) {
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
