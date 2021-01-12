import createElement from '../vdom/create-element';

export const initRender = function (vm) {
    // vm.$vnode = null; // the placeholder node in parent tree
    // vm._vnode = null; // the root of the child tree
    // vm._staticTrees = null;
    // vm._renderContext =
    //     vm.$options._parentVnode && vm.$options._parentVnode.context;
    vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);

    vm.$createElement = createElement.bind(vm);
    if (vm.$options.el) {
        vm.$mount(vm.$options.el);
    }
};

export const renderMixin = function (Aue) {
    Aue.prototype._render = function () {
        const { render } = this.$options;
        console.log(
            '🚀 ~ file: render.js ~ line 16 ~ renderMixin ~ render',
            render
        );
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

// TODO: why need context?
function resolveSlots(renderChildren, context) {
    const slots = {};
    const defaultSlot = [];
    if (!renderChildren) return slots;

    // TODO: need to normalize children array as one level

    renderChildren.forEach((child) => {
        // what if slot='' empty string
        if (child.data && child.data.slot) {
            if (slots[child.data.slot]) {
                slots[child.data.slot].push(child);
            } else {
                slots[child.data.slot] = [child];
            }
        } else {
            defaultSlot.push(child);
        }
    });

    // TODO: trim default slot, such as white space
    // what if 2 spaces or more?
    // what slot is not @index 0
    // this is not a perfect plan
    if (
        defaultSlot.length &&
        !(
            defaultSlot.length === 1 &&
            (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
        )
    ) {
        slots.default = defaultSlot;
    }
    return slots;
}
