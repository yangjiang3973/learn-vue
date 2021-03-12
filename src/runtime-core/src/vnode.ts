import { isString, isObject } from '../../utils';

// only responsible for make the vnode data sctructure
// store the info into the vnode
export function createVNode(type, props?, children?) {
    const vnode = {
        type,
        props,
        children,
    };
    if (isString(type)) {
        return vnode;
    } else if (isObject(type)) {
        return vnode;
    }
}

function createComponent(type, props, children) {}
