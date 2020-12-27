module.exports.initRender = function (vm) {
    // vm.$vnode = null; // the placeholder node in parent tree
    // vm._vnode = null; // the root of the child tree
    // vm._staticTrees = null;
    vm.$createElement = createElement.bind(vm);
    if (vm.$options.el) {
        vm.$mount(vm.$options.el);
    }
};

module.exports.renderMixin = function(Aue) {
    Vue.prototype._render = function () {
        const { render } = this.$options;
        let vnode;
        try {
            vnode = render.call(this, this.$createElement);
        } catch (e) {
            console.error(e);
        }
        return vnode;
}

// module.exports._render = function () {
//     const { render } = this.$options;
//     let vnode;
//     try {
//         vnode = render.call(this, this.$createElement);
//     } catch (e) {
//         console.error(e);
//     }
//     return vnode;
// };
