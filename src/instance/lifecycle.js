const { Watcher } = require('../watcher');

module.exports._mount = function (el) {
    if (!this.options.render) {
        console.error('need render function!');
    }
    //* here should call hook: beforeMount

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
};

module.exports._update = function (vnode) {
    const preVnode = this._vnode;

    if (!preVnode) {
        this.$el = this.__patch__(this.$el, vnode);
    } else {
        this.$el = this.__patch__(preVnode, vnode);
    }
    this._vnode = vnode;
};
