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
