import Watcher from '../watcher';

export const initLifecycle = function initLifecycle(vm) {
    vm.$refs = {};
    // vm._watcher = null;
    // vm._inactive = false;
    vm._isMounted = false;
    // vm._isBeingDestroyed = false;
    vm._isDestroyed = false;
};

export const lifecycleMixin = function lifecycleMixin(Aue) {
    Aue.prototype._mount = function (el, hydrating) {
        this.$el = el;
        if (!this.$options.render) {
            console.error('need render function!');
        }
        //* here should call hook: beforeMount
        // callHook(vm, 'beforeMount');

        // why make a watcher here?
        this._watcher = new Watcher(
            this,
            // pass a fn to watcher. this._render() will run first, then this._update().  this._render() is from file render.js
            // _render() will return a vnode
            () => {
                this._update(this._render());
            },
            () => {}
        );
        return this;
    };

    Aue.prototype._update = function (vnode) {
        const preVnode = this._vnode;
        if (!preVnode) {
            this.$el = this.__patch__(this.$el, vnode);
        } else {
            this.$el = this.__patch__(preVnode, vnode);
        }
        this._vnode = vnode;
    };

    // Aue.prototype._updateFromParent
    // Aue.prototype.$forceUpdate
    // Aue.prototype.$destroy
};
