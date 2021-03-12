import { h } from '../../runtime-core/src/h';
import { render } from '../../runtime-core/src/renderer';
import { createVNode } from '../../runtime-core/src/vnode';

import { isString } from '../../utils';
// import {h} from '../../runtime-core/src/h';
// re-export everything from core
// h, Component, reactivity API, nextTick, flags & types
export * from '../../runtime-core/src/index';

export const createApp = (rootComponent) => {
    // const app = ensureRenderer().createApp(...args)

    // if (__DEV__) {
    //   injectNativeTagCheck(app)
    //   injectCustomElementCheck(app)
    // }

    // In Vue-next, app is returned from renderer.
    // Right now, ignore renderer

    // const { mount } = app
    const app = {
        _component: rootComponent,
    };
    //* here to write mount method
    (app as any).mount = (containerOrSelector): any => {
        const container = normalizeContainer(containerOrSelector);
        if (!container) return;

        const component = app._component;
        // build a virtual dom tree
        const vnode = createVNode(component);
        console.log('🚀 ~ file: index.ts ~ line 30 ~ createApp ~ vnode', vnode);
        // if (
        //     !isFunction(component) &&
        //     !component.render &&
        //     !component.template
        // ) {
        //     component.template = container.innerHTML;
        // }
        // clear content before mounting
        // container.innerHTML = '';
        // patch vdom to real dom
        render(vnode, container);
        // const proxy = mount(container, false, container instanceof SVGElement);
        // if (container instanceof Element) {
        //     container.removeAttribute('v-cloak');
        //     container.setAttribute('data-v-app', '');
        // }
        // return proxy;
    };

    return app;
};
//   as CreateAppFunction<Element>

// TODO:
function normalizeContainer(container) {
    if (isString(container)) {
        const res = document.querySelector(container);
        if (!res && __DEV__) {
            console.error('Cannot find the target container');
        }
        return res;
    }
}
