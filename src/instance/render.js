const { createElement } = require('../vdom/create-element');

module.exports.initRender = function (vm) {
    // vm.$vnode = null; // the placeholder node in parent tree
    // vm._vnode = null; // the root of the child tree
    // vm._staticTrees = null;
    vm.$createElement = createElement.bind(vm);
    if (vm.$options.el) {
        vm.$mount(vm.$options.el);
    }
};

module.exports.renderMixin = function (Aue) {
    Aue.prototype._render = function () {
        const { render } = this.$options;
        let vnode;
        try {
            vnode = render.call(this, this.$createElement);
        } catch (e) {
            console.error(e);
        }
        console.log('🚀 ~ file: render.js ~ line 24 ~ vnode', vnode);
        return vnode;
    };
};
