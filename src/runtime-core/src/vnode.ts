import { ShapeFlags } from './shapeFlags';
import { isString, isObject, isArray, isFunction } from '../../utils';

export const Text = Symbol(__DEV__ ? 'Text' : undefined);
// export const Comment = Symbol(__DEV__ ? 'Comment' : undefined)
// export const Static = Symbol(__DEV__ ? 'Static' : undefined)

export type VNodeTypes =
    | string
    | VNode
    //   | Component
    | typeof Text
    | typeof Comment;

export interface VNode {
    __v_isVNode: true;
    type: VNodeTypes;
    props: any;
    // key: string | number | null;
    children: any;
    component: any;
    el: any;
    shapeFlag: number;
}

// only responsible for make the vnode data sctructure
// store the info into the vnode
export function createVDOM(type, props?, children?) {
    // if no props, data will hold child nodes and children will be undefined
    if (props && isArray(props)) {
        children = props;
        props = undefined;
    }

    // encode the vnode type information into a bitmap
    // const shapeFlag = isString(type)
    //     ? ShapeFlags.ELEMENT
    //     : __FEATURE_SUSPENSE__ && isSuspense(type)
    //     ? ShapeFlags.SUSPENSE
    //     : isTeleport(type)
    //     ? ShapeFlags.TELEPORT
    //     : isObject(type)
    //     ? ShapeFlags.STATEFUL_COMPONENT
    //     : isFunction(type)
    //     ? ShapeFlags.FUNCTIONAL_COMPONENT
    //     : 0;

    let shapeFlag: ShapeFlags;
    if (isString(type)) shapeFlag = ShapeFlags.ELEMENT;
    else if (isObject(type)) shapeFlag = ShapeFlags.STATEFUL_COMPONENT;
    else if (isFunction(type)) shapeFlag = ShapeFlags.FUNCTIONAL_COMPONENT;

    const vnode: VNode = {
        __v_isVNode: true,
        type,
        props,
        children,
        shapeFlag,
        el: null,
        component: null,
    };

    normalizeChildren(vnode, children);

    // if (isString(type)) {
    //     if (isArray(children)) {
    //         for (let i = 0; i < children.length; i++) {
    //             // text node
    //             if (isString(children[i])) {
    //                 vnode.type = 'textNode';
    //                 vnode.text = children[i];
    //                 children[i] = vnode;
    //             }
    //         }
    //     }
    //     return vnode;
    // } else if (isObject(type)) {
    //     return vnode;
    // }
    return vnode;
}

function normalizeChildren(vnode: VNode, children: unknown) {}
