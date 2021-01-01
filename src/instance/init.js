import { initLifecycle } from './lifecycle';
import { initState } from './state.js';
import { initRender } from './render';

export const initMixin = function (Aue) {
    Aue.prototype._init = function (options) {
        options = options || {};
        // TODO: could add a _uid
        this._isAue = true;

        if (options._isComponent) {
            // TODO: use function: initInternalComponent(this, options);
            // TODO: need to normalize props
            this.$options = { ...options, ...this.constructor.options };
        } else {
            // merge options(now just a basic merge)
            this.$options = { ...options, ...Aue.options };
        }

        // TODO: in development mode, could add a proxy for debuging purpose

        initLifecycle(this);
        // initEvents(this);
        // callHook(this, 'beforeCreate');
        initState(this);
        // callHook(vm, 'created');
        initRender(this); //* NOTE: call vm.$mount() here!!
    };
};

// function initInternalComponent(vm, options) {
//     vm.$options = { ...options, ...vm.constructor.options };
// }
