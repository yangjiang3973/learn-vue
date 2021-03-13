import { createVDOM } from './vnode';

export function h(type: any, propsOrChildren?: any, children?: any) {
    return createVDOM(type, propsOrChildren, children);
}
