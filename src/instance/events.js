export function initEvents(vm) {
    vm._events = Object.create(null);
    const listeners = vm.$options._parentListeners;
    // TODO: need to update listeners later
    // now just simply add listeners to _event
    if (listeners) {
        Object.keys(listeners).forEach((name) => {
            vm.$on(name, listeners[name]);
        });
    }
}

export function eventsMixin(Aue) {
    Aue.prototype.$on = function (event, fn) {
        if (this._events[event]) {
            this._events[event].push(fn);
        } else {
            this._events[event] = [];
            this._events[event].push(fn);
        }
        return this;
    };
    Aue.prototype.$emit = function (event) {
        let cbs = this._events[event];
        if (!cbs) return this;
        const args = [...arguments].slice(1);
        cbs.forEach((cb) => {
            cb.apply(this, args);
        });
    };
}
