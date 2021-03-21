import { reactive } from '../../reactivity/src/index';
import { isFunction, hasOwn } from '../../utils';

const PublicInstanceProxyHandlers = {
    get: function (target, key) {
        if (hasOwn(target.data, key)) return target.data[key];
    },
    set: function (target, key, value, receiver) {
        // return Reflect.set(target.data, key, value, receiver);
        return (target.data[key] = value);
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
        instance.data = reactive(data);
    }
}

function setupStatefulComponent(instance) {
    // 1. create public instance / render proxy
    // also mark it raw so it's never observed

    // NOTE: here make a proxy of instance, just to trap get/set, not make it reactive
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
}

export function setupComponent(instance) {
    // right now just handle stateful case
    // instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);
    setupStatefulComponent(instance);

    // TODO:

    finishComponentSetup(instance);
}

export function createComponentInstance(compVNode) {
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
