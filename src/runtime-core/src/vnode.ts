import { isString, isObject } from '../../utils';

// only responsible for make the vnode data sctructure
// store the info into the vnode
export function createVNode(type, props?, children?) {
    if (isString(type)) {
        const vnode = {
            type,
            props,
            children,
        };
        return vnode;
    } else if (isObject(type)) {
        // createComponent(type, props, children);
    }
}

function createComponent(type, props, children) {}
