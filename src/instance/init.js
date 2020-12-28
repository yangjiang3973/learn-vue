const { initLifecycle } = require('./lifecycle');
const { initState } = require('./state.js');
const { initRender } = require('./render');

module.exports.initMixin = function (Aue) {
    Aue.prototype._init = function (options) {
        options = options || {};
        // TODO: could add a _uid
        this._isAue = true;

        // merge options(now just a basic merge)
        this.$options = { ...options, ...Aue.options };

        // TODO: in development mode, could add a proxy for debuging purpose

        initLifecycle(this);
        // initEvents(this);
        // callHook(this, 'beforeCreate');
        initState(this);
        // callHook(vm, 'created');
        initRender(this); //* NOTE: call vm.$mount() here!!
    };
};
