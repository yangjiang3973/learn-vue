import { h } from './h';
import { isString, isObject } from '../../utils';

export function render(vnode, container) {
    // if (vnode == null) {
    //     if (container._vnode) {
    //       unmount(container._vnode, null, null, true)
    //     }
    //   } else {
    patch(container._vnode || null, vnode, container);
    //   }
}

function patch(oldVNode, newVNode, container) {
    // vue3 does not check newly insert or update at the beginning,
    if (isString(newVNode.type)) {
        console.log(
            '🚀 ~ file: renderer.ts ~ line 17 ~ patch ~ newVNode',
            newVNode
        );
        const el = document.createElement(newVNode.type);
        container.appendChild(el);
        if (newVNode.children) {
            newVNode.children.forEach((vnode) => {
                if (vnode.type === 'textNode') {
                    el.innerHTML = vnode.text;
                } else patch(null, vnode, el);
            });
        }
    } else if (isObject(newVNode.type)) {
        processComponent(oldVNode, newVNode, container);
    }
}

function processComponent(n1, n2, container) {
    if (!n1) mountComponent(n2, container);
    // else {
    //     TODO:
    // }
}

function mountComponent(compVNode, container) {
    // init component instance
    const instance = createComponentInstance(compVNode);
    // setup component, such as props, slots....
    setupComponent(instance);
    console.log(
        '🚀 ~ file: renderer.ts ~ line 58 ~ mountComponent ~ instance',
        instance
    );

    const vnode = compVNode.type.render.call(instance.proxy, h);
    patch(null, vnode, container);
}

const PublicInstanceProxyHandlers = {
    get: function (target, prop, reveiver) {
        return Reflect.get(target.data, prop);
    },
};

function setupComponent(instance) {
    // right now just handle stateful case
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
}

function createComponentInstance(compVNode) {
    const instance = {
        type: compVNode.type,
        vnode: compVNode,
        data: null,
        proxy: null,
        ctx: {}, // context 对象
    };
    instance.data = compVNode.type.data.call(instance);
    return instance;
}
