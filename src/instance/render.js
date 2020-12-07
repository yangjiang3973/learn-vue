module.exports._render = function () {
    const { render } = this.options;
    let vnode;
    try {
        vnode = render.call(this, this.$createElement);
        console.log('vnode', vnode);
    } catch (e) {
        console.error(e);
    }
    return vnode;
};
