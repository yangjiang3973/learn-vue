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

    instance.update = effect(() => {
        // in renderComponentRoot()
        // TODO: what is proxy and why use it?
        render.call(
            proxyToUse,
            proxyToUse,
            renderCache,
            props,
            setupState,
            data,
            ctx
        );
    }, createDevEffectOptions);
}

const PublicInstanceProxyHandlers = {
    get: function (target, prop, reveiver) {
        return Reflect.get(target.data, prop);
    },
};

function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render || (() => {});

    // TODO:
    // applyOptions(instance, Component);
}

function setupStatefulComponent(instance) {
    // 1. create public instance / render proxy
    // also mark it raw so it's never observed
    instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
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
