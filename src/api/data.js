const { Watcher } = require('../watcher');

module.exports.$add = function (key, val) {
    this._data.$add(key, val);
};

module.exports.$delete = function (key) {
    this._data.$delete(key);
};

module.exports.$set = function (key) {
    this._data.$set(key);
};

module.exports.$watch = function (exp, cb, options) {
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
        watcher = new Watcher(vm, exp, wrappedCb, {});
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
    return unwatch;
};
