import { h } from './h';
import { effect } from '../../reactivity/src/index';
import { isString, isObject, hasOwn, isFunction } from '../../utils';
import { Text, createVDOM } from './vnode';

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
    // if (isString(newVNode.type)) {
    //     console.log(
    //         '🚀 ~ file: renderer.ts ~ line 17 ~ patch ~ newVNode',
    //         newVNode
    //     );
    //     const el = document.createElement(newVNode.type);
    //     container.appendChild(el);
    //     if (newVNode.children) {
    //         newVNode.children.forEach((vnode) => {
    //             if (vnode.type === 'textNode') {
    //                 el.innerHTML = vnode.text;
    //             } else patch(null, vnode, el);
    //         });
    //     }
    // } else if (isObject(newVNode.type)) {
    //     processComponent(oldVNode, newVNode, container);
    // }

    const { type, shapeFlag } = newVNode;
    // use type first, then refactor to shapeFlag
    if (isObject(type)) {
        processComponent(oldVNode, newVNode, container);
    } else if (isString(type)) {
        processElement(oldVNode, newVNode, container);
    } else if (type === Text) {
        processText(oldVNode, newVNode, container);
    }
}

function processText(n1, n2, container) {
    if (!n1) {
        n2.el = document.createTextNode(n2.children);
        container.append(n2.el);
    }
    // TODO:
    // else
}

function processElement(n1, n2, container) {
    if (!n1) mountElement(n2, container);
    // TODO:
    // else patchElement(n1,n2,container)
}

function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    if (vnode.children) {
        mountChildren(vnode.children, el);
    }
    container.appendChild(el);
}

function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        // TODO: should normalize all possible child types
        if (isString(child)) {
            child = createVDOM(Text, null, child);
        }
        patch(null, child, container);
    }
}

function processComponent(n1, n2, container) {
    if (!n1) mountComponent(n2, container);
    // else {
    //     TODO:
    //     updateComponent(n1, n2);
    // }
}

function mountComponent(compVNode, container) {
    // init component instance
    const instance = createComponentInstance(compVNode);
    compVNode.component = instance;
    // setup component, such as props, slots....
    setupComponent(instance);

    // TODO:
    setupRenderEffect(instance, compVNode, container);
    // const vnode = compVNode.type.render.call(instance.proxy, h);
    // patch(null, vnode, container);
}

function setupRenderEffect(instance, initialVNode, container) {
    // TODO:
    let createDevEffectOptions = {};
    const { type: Component, vnode, proxy, withProxy, render } = instance;
    // instance.update = effect(() => {
    // NOTE: vue3 do these in renderComponentRoot()
    // TODO: what is proxy and why use it?
    const proxyToUse = withProxy || proxy;
    const subTree = render.call(proxyToUse, h);
    patch(null, subTree, container);
    // }, createDevEffectOptions);
}

const PublicInstanceProxyHandlers = {
    get: function (target, key) {
        if (hasOwn(target.data, key)) return Reflect.get(target.data, key);
    },
};

function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render || (() => {});

    // TODO:
    // in vue3, use applyOptions(instance, Component);
    if (isFunction(Component.data)) {
        const dataFn = Component.data;
        const data = dataFn.call(instance.proxy);
        instance.data = data;
        // TODO:
        // instance.data = reactive(data);
    }
}

function setupStatefulComponent(instance) {
    // 1. create public instance / render proxy
    // also mark it raw so it's never observed

    // NOTE: here make a proxy of instance, just to trap get/set, not make it reactive
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
}

function setupComponent(instance) {
    // right now just handle stateful case
    // instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
    setupStatefulComponent(instance);

    // TODO:

    finishComponentSetup(instance);
}

function createComponentInstance(compVNode) {
    const instance = {
        type: compVNode.type,
        vnode: compVNode,
        data: {},
        proxy: {},
        ctx: {}, // context 对象
    };

    // instance.ctx = createRenderContext(instance);
    return instance;
}
